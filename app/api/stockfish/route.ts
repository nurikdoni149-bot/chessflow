import { Chess } from "chess.js";
import { NextResponse } from "next/server";
import { getStockfishMove } from "@/lib/stockfish-server";

export const runtime = "nodejs";

function parseUciMove(uci: string) {
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci[4] : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { fen?: string; movetime?: number };
    const { fen, movetime } = body;

    if (!fen || typeof fen !== "string") {
      return NextResponse.json({ error: "fen is required" }, { status: 400 });
    }

    const game = new Chess(fen);
    if (game.turn() !== "b") {
      return NextResponse.json(
        { error: "Engine only moves for black" },
        { status: 400 },
      );
    }

    if (game.isGameOver()) {
      return NextResponse.json({ error: "Game is already over" }, { status: 400 });
    }

    const uci = await getStockfishMove(fen, movetime ?? 600);
    const aiGame = new Chess(fen);
    const move = aiGame.move(parseUciMove(uci));

    if (!move) {
      return NextResponse.json({ error: "Illegal engine move" }, { status: 500 });
    }

    return NextResponse.json({
      fen: aiGame.fen(),
      san: move.san,
      uci,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Stockfish request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
