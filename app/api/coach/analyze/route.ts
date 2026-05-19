import { Chess } from "chess.js";
import { NextResponse } from "next/server";
import { analyzePlayerMove } from "@/lib/stockfish-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fenBefore?: string;
      fenAfter?: string;
      uci?: string;
      san?: string;
      movetime?: number;
    };

    const { fenBefore, fenAfter, uci, san, movetime } = body;

    if (!fenBefore || !fenAfter || !uci || !san) {
      return NextResponse.json(
        { error: "fenBefore, fenAfter, uci, and san are required" },
        { status: 400 },
      );
    }

    const before = new Chess(fenBefore);
    if (before.turn() !== "w") {
      return NextResponse.json(
        { error: "Coach only analyzes White moves" },
        { status: 400 },
      );
    }

    const analysis = await analyzePlayerMove(
      fenBefore,
      fenAfter,
      uci,
      san,
      movetime ?? 350,
    );

    return NextResponse.json(analysis);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Coach analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
