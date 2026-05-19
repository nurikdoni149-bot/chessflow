export type MoveQuality =
  | "brilliant"
  | "excellent"
  | "good"
  | "inaccuracy"
  | "blunder";

export type MoveQualityMeta = {
  label: string;
  description: string;
  badgeClass: string;
  glowClass: string;
};

const QUALITY_META: Record<MoveQuality, MoveQualityMeta> = {
  brilliant: {
    label: "Brilliant",
    description: "A powerful move that matches the engine's top choice.",
    badgeClass:
      "border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-100",
    glowClass: "shadow-cyan-500/30",
  },
  excellent: {
    label: "Excellent",
    description: "Very strong — you kept nearly all of your advantage.",
    badgeClass:
      "border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-100",
    glowClass: "shadow-emerald-500/25",
  },
  good: {
    label: "Good",
    description: "A solid choice with only a small eval drop.",
    badgeClass:
      "border-lime-400/30 bg-lime-500/10 text-lime-100",
    glowClass: "shadow-lime-500/20",
  },
  inaccuracy: {
    label: "Inaccuracy",
    description: "Playable, but a sharper continuation was available.",
    badgeClass:
      "border-amber-400/40 bg-amber-500/15 text-amber-100",
    glowClass: "shadow-amber-500/25",
  },
  blunder: {
    label: "Blunder",
    description: "This move loses significant ground — review tactics next time.",
    badgeClass:
      "border-red-400/40 bg-gradient-to-r from-red-500/20 to-orange-500/15 text-red-100",
    glowClass: "shadow-red-500/30",
  },
};

export function getQualityMeta(quality: MoveQuality): MoveQualityMeta {
  return QUALITY_META[quality];
}

export function classifyMove(cpLoss: number, playedBest: boolean): MoveQuality {
  if (playedBest && cpLoss <= 5) return "brilliant";
  if (cpLoss <= 12) return "excellent";
  if (cpLoss <= 35) return "good";
  if (cpLoss <= 90) return "inaccuracy";
  return "blunder";
}

export function buildCoachingMessage(
  quality: MoveQuality,
  moveSan: string,
  bestMoveSan: string | null,
  playedBest: boolean,
): string {
  const meta = QUALITY_META[quality];

  switch (quality) {
    case "brilliant":
      return `${moveSan} is the engine's pick — well spotted. Keep pressing your advantage.`;
    case "excellent":
      return playedBest
        ? `${moveSan} matches the engine. Stay active and coordinate your pieces.`
        : `${moveSan} is very strong. ${meta.description}`;
    case "good":
      return `${moveSan} is reasonable. Look for slightly more forcing follow-ups when you can.`;
    case "inaccuracy":
      return bestMoveSan
        ? `${moveSan} is okay, but ${bestMoveSan} was stronger. Re-check loose pieces before you move.`
        : `${moveSan} drifts from the best line. Slow down and scan for tactics.`;
    case "blunder":
      return bestMoveSan
        ? `${moveSan} drops material or position. ${bestMoveSan} would have held much better.`
        : `${moveSan} is a serious mistake — calculate one more move before committing.`;
  }
}

export const INITIAL_COACH_MESSAGE =
  "Make a move as White. I'll rate your move quality using Stockfish evaluation.";
