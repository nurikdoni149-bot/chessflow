"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, ChevronRight, Loader2, MessageSquare, Sparkles, Trophy } from "lucide-react";
import type { CoachFeedback } from "@/components/ChessBoard";
import { getQualityMeta } from "@/lib/move-quality";

type AICoachPanelProps = {
  coach: CoachFeedback;
  isEngineThinking: boolean;
};

export default function AICoachPanel({
  coach,
  isEngineThinking,
}: AICoachPanelProps) {
  const statusLabel = coach.isAnalyzing
    ? "Analyzing"
    : isEngineThinking
      ? "Engine"
      : "Live";

  const statusClass = coach.isAnalyzing
    ? "bg-violet-500/10 text-violet-300"
    : isEngineThinking
      ? "bg-zinc-500/10 text-zinc-400"
      : "bg-emerald-500/10 text-emerald-400";

  const qualityMeta = coach.quality ? getQualityMeta(coach.quality) : null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl"
        animate={{ opacity: coach.isAnalyzing ? 0.9 : 0.5 }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative">
        <motion.div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 ring-1 ring-violet-500/30">
            <Bot className="h-4 w-4 text-violet-300" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">AI Coach</h2>
            <p className="text-[10px] text-zinc-500">Stockfish evaluation</p>
          </div>
          <span
            className={`ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-300 ${statusClass}`}
          >
            {coach.isAnalyzing ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {statusLabel}
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          {coach.isAnalyzing ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="mb-4 flex items-center gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 px-3 py-3"
            >
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-400" />
              <p className="text-sm text-zinc-300">
                Reviewing your move with Stockfish…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence mode="popLayout">
                {qualityMeta && coach.lastMoveSan && (
                  <motion.div
                    key={`${coach.quality}-${coach.lastMoveSan}`}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-lg ${qualityMeta.badgeClass} ${qualityMeta.glowClass}`}
                  >
                    {qualityMeta.label}
                    <span className="font-mono font-normal normal-case tracking-normal text-white/70">
                      {coach.lastMoveSan}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.p
                layout
                className="mb-4 text-sm leading-relaxed text-zinc-400"
              >
                {coach.explanation}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 transition-colors duration-300">
            <span className="flex items-center gap-2 text-xs text-zinc-500">
              <MessageSquare className="h-3.5 w-3.5" />
              Eval
            </span>
            <motion.span
              key={coach.evalDisplay}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs font-medium text-zinc-200"
            >
              {coach.evalDisplay}
            </motion.span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2 transition-colors duration-300">
            <span className="flex items-center gap-2 text-xs text-zinc-500">
              <Trophy className="h-3.5 w-3.5" />
              Best move
            </span>
            <motion.span
              key={coach.bestMoveSan ?? "—"}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-xs font-medium text-zinc-200"
            >
              {coach.bestMoveSan ?? "—"}
            </motion.span>
          </div>
        </motion.div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-xs font-medium text-violet-200 transition hover:bg-violet-500/20"
        >
          Deep analysis
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
