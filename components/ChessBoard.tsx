"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Loader2 } from "lucide-react";
import { Chessboard, type PieceDropHandlerArgs } from "react-chessboard";
import { INITIAL_COACH_MESSAGE } from "@/lib/move-quality";
import type { MoveQuality } from "@/lib/move-quality";
import { BOARD_THEMES } from "@/lib/board-themes";

export type CoachFeedback = {
  isAnalyzing: boolean;
  quality: MoveQuality | null;
  explanation: string;
  evalDisplay: string;
  bestMoveSan: string | null;
  lastMoveSan: string | null;
};

export type GameState = {
  fen: string;
  moves: string[];
  isThinking: boolean;
  turn: "w" | "b";
  isGameOver: boolean;
  winner?: "white" | "black" | "draw";
  coach: CoachFeedback;
};

export type ChessBoardProps = {
  onGameUpdate?: (state: GameState) => void;
  className?: string;

  boardLight?: string;
  boardDark?: string;
};

const INITIAL_FEN = new Chess().fen();

const INITIAL_COACH: CoachFeedback = {
  isAnalyzing: false,
  quality: null,
  explanation: INITIAL_COACH_MESSAGE,
  evalDisplay: "0.0",
  bestMoveSan: null,
  lastMoveSan: null,
};

function buildGameState(
  fen: string,
  moves: string[],
  isThinking: boolean,
  coach: CoachFeedback,
): GameState {
  const game = new Chess(fen);

  let winner: "white" | "black" | "draw" | undefined;

  if (game.isGameOver()) {
    if (game.isDraw()) {
      winner = "draw";
    } else {
      winner = game.turn() === "w" ? "black" : "white";
    }
  }

  return {
    fen,
    moves,
    isThinking,
    turn: game.turn(),
    isGameOver: game.isGameOver(),
    winner,
    coach,
  };
}

export default function ChessBoard({
  onGameUpdate,
  className,
  boardLight,
  boardDark,
}: ChessBoardProps) {
  const [fen, setFen] = useState(INITIAL_FEN);
  const [moves, setMoves] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [coach, setCoach] = useState<CoachFeedback>(INITIAL_COACH);


  const thinkingGenRef = useRef(0);
  const coachGenRef = useRef(0);
  const onGameUpdateRef = useRef(onGameUpdate);


  const game = useMemo(() => new Chess(fen), [fen]);
  const canPlayerMove = !isThinking && game.turn() === "w" && !game.isGameOver();
  console.log("canPlayerMove =", canPlayerMove);

  const emitUpdate = useCallback(
    (
      nextFen: string,
      nextMoves: string[],
      thinking: boolean,
      nextCoach: CoachFeedback,
    ) => {
      onGameUpdateRef.current?.(
        buildGameState(nextFen, nextMoves, thinking, nextCoach),
      );
    },
    [],
  );

  useEffect(() => {
    emitUpdate(fen, moves, isThinking, coach);
  }, [fen, moves, isThinking, coach, emitUpdate]);

  const requestCoachAnalysis = useCallback(
    async (
      fenBefore: string,
      fenAfter: string,
      uci: string,
      san: string,
    ) => {
      const generation = ++coachGenRef.current;

      setCoach((prev) => ({
        ...prev,
        isAnalyzing: true,
        lastMoveSan: san,
      }));

      try {
        const response = await fetch("/api/coach/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fenBefore, fenAfter, uci, san }),
        });

        if (!response.ok) throw new Error("Coach analysis failed");

        const data = (await response.json()) as {
          quality: MoveQuality;
          explanation: string;
          evalDisplay: string;
          bestMoveSan: string | null;
          error?: string;
        };

        if (data.error) throw new Error(data.error);
        if (generation !== coachGenRef.current) return;

        setCoach({
          isAnalyzing: false,
          quality: data.quality,
          explanation: data.explanation,
          evalDisplay: data.evalDisplay,
          bestMoveSan: data.bestMoveSan,
          lastMoveSan: san,
        });
      } catch {
        if (generation !== coachGenRef.current) return;
        setCoach((prev) => ({
          ...prev,
          isAnalyzing: false,
          explanation:
            "Could not analyze that move. Keep playing — I'll try again next move.",
        }));
      }
    },
    [],
  );

  const requestAiMove = useCallback(
    async (fenAfterPlayer: string, nextMoves: string[]) => {
      const generation = ++thinkingGenRef.current;
      setIsThinking(true);

      try {
        const response = await fetch("/api/stockfish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fen: fenAfterPlayer, movetime: 600 }),
        });

        if (!response.ok) {
          throw new Error("Stockfish request failed");
        }

        const data = (await response.json()) as {
          fen: string;
          san: string;
          error?: string;
        };

        if (data.error) throw new Error(data.error);
        if (generation !== thinkingGenRef.current) return;

        setFen(data.fen);
        setMoves([...nextMoves, data.san]);
      } catch {
        if (generation === thinkingGenRef.current) {
          thinkingGenRef.current += 1;
        }
      } finally {
        if (generation === thinkingGenRef.current) {
          setIsThinking(false);
        }
      }
    },
    [],
  );

  const onPieceDrop = ({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs) => {
    if (!canPlayerMove) {
      return false;
    }
  
    const game = new Chess(fen);
  
    const move = game.move({
      from: sourceSquare,
      to: targetSquare!,
      promotion: "q",
    });
  
    if (!move) {
      return false;
    }
  
    const updatedFen = game.fen();
    const updatedMoves = [...moves, move.san];
  
    setFen(updatedFen);
    setMoves(updatedMoves);
  
    requestAiMove(updatedFen, updatedMoves);
  
    return true;
  };
  const canDragPiece = useCallback(
    ({ square }: { square: string | null }) => {
      if (!canPlayerMove || !square) return false;
      const piece = game.get(square as Parameters<Chess["get"]>[0]);
      return piece?.color === "w";
    },
    [canPlayerMove, game],
  );



  return (
    <div
    className={`relative ${className ?? ""}`}

  >
<Chessboard
  options={{
    position: fen,
    onPieceDrop,
  }}
/>
  
      {isThinking && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px] transition-opacity duration-200">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-zinc-900/90 px-4 py-2.5 shadow-xl">
            <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            <span className="text-sm font-medium text-zinc-200">
              Stockfish is thinking…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
