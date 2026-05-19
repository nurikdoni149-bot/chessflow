export type EvalScore = {
  cp: number | null;
  mate: number | null;
};

/** Normalize engine score to White's perspective. */
export function toWhitePerspective(
  cp: number | null,
  mate: number | null,
  turn: "w" | "b",
): EvalScore {
  if (mate !== null) {
    return { cp: null, mate: turn === "w" ? mate : -mate };
  }
  if (cp !== null) {
    return { cp: turn === "w" ? cp : -cp, mate: null };
  }
  return { cp: 0, mate: null };
}

/** Single number for comparison (centipawns; mate ≈ ±10000). */
export function evalToCentipawns(score: EvalScore): number {
  if (score.mate !== null) {
    return score.mate > 0 ? 10_000 - score.mate * 10 : -10_000 - Math.abs(score.mate) * 10;
  }
  return score.cp ?? 0;
}

export function formatEval(score: EvalScore): string {
  if (score.mate !== null) {
    if (score.mate > 0) return `#${score.mate}`;
    return `#${score.mate}`;
  }
  const pawns = (score.cp ?? 0) / 100;
  if (Math.abs(pawns) < 0.05) return "0.0";
  return pawns > 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
}
