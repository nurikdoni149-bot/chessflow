"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

import { PUZZLES } from "@/lib/puzzles";

export default function PuzzlesPage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] =
    useState(0);

  const [message, setMessage] = useState("");

  const puzzle = useMemo(
    () => PUZZLES[currentPuzzleIndex],
    [currentPuzzleIndex],
  );

  const handleMove = (
    sourceSquare: string,
    targetSquare: string,
  ) => {
    const chess = new Chess(puzzle.fen);

    const move = chess.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) {
      return false;
    }

    if (move.san === puzzle.solution) {
      setMessage("Correct!");
    } else {
      setMessage("Wrong move");
    }

    return true;
  };

  return (
    <div className="min-h-screen bg-[#060608] p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">
          Chess Puzzles
        </h1>

        <p className="mt-2 text-zinc-400">
          Solve tactical positions and improve your chess.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <Chessboard
              position={puzzle.fen}
              onPieceDrop={(sourceSquare, targetSquare) =>
                handleMove(sourceSquare, targetSquare)
              }
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm uppercase tracking-wider text-violet-400">
              Puzzle #{puzzle.id}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {puzzle.title}
            </h2>

            <div className="mt-6 rounded-xl bg-black/30 p-4">
              <p className="text-zinc-400">
                Goal
              </p>

              <p className="mt-2 text-lg text-white">
                Find the best move.
              </p>
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-lg font-semibold">
                {message || "Make your move"}
              </p>
            </div>

            <button
              onClick={() => {
                setMessage("");

                setCurrentPuzzleIndex((prev) =>
                  (prev + 1) % PUZZLES.length,
                );
              }}
              className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
            >
              Next Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}