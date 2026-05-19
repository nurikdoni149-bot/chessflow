import { Chess } from "chess.js";
import {
  buildCoachingMessage,
  classifyMove,
  type MoveQuality,
} from "@/lib/move-quality";

export type PositionAnalysis = {
  score: number;
  evalDisplay: string;
  bestMove: string | null;
};

export type PlayerMoveAnalysis = {
  quality: MoveQuality;
  explanation: string;
  evalDisplay: string;
  bestMoveSan: string | null;
  cpLoss: number;
  playedBest: boolean;
};

function randomEval() {
  return (Math.random() * 2 - 1).toFixed(1);
}

function randomCpLoss() {
  return Math.floor(Math.random() * 120);
}

export async function getStockfishMove(
  fen: string,
  _movetimeMs = 600,
): Promise<string> {
  const game = new Chess(fen);

  const moves = game.moves({ verbose: true });

  if (moves.length === 0) {
    throw new Error("No legal moves");
  }

  const move =
    moves[Math.floor(Math.random() * moves.length)];

  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

export async function analyzePlayerMove(
  fenBefore: string,
  _fenAfter: string,
  playedUci: string,
  moveSan: string,
  _movetimeMs = 350,
): Promise<PlayerMoveAnalysis> {
  const game = new Chess(fenBefore);

  const moves = game.moves({ verbose: true });

  const bestMove =
    moves[Math.floor(Math.random() * moves.length)];

  const bestMoveUci = `${bestMove.from}${bestMove.to}${
    bestMove.promotion ?? ""
  }`;

  const playedBest = playedUci === bestMoveUci;

  const cpLoss = playedBest
    ? Math.floor(Math.random() * 10)
    : randomCpLoss();

  const quality = classifyMove(cpLoss, playedBest);

  return {
    quality,
    explanation: buildCoachingMessage(
      quality,
      moveSan,
      bestMove.san,
      playedBest,
    ),
    evalDisplay: randomEval(),
    bestMoveSan: bestMove.san,
    cpLoss,
    playedBest,
  };
}