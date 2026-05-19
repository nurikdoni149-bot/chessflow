"use client";

import { useCallback, useEffect, useMemo, useState } from "react";  
import { Chess } from "chess.js";
import { ChevronRight, Crown, Flame, LayoutGrid, Zap } from "lucide-react";
import ChessBoard, { type GameState } from "@/components/ChessBoard";
import AICoachPanel from "@/components/play/AICoachPanel";
import { INITIAL_COACH_MESSAGE } from "@/lib/move-quality";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { BOARD_THEMES } from "@/lib/board-themes";
import AuthButton from "@/components/play/AuthButton";
import Link from "next/link";

const INITIAL_GAME: GameState = {
  fen: new Chess().fen(),
  moves: [],
  isThinking: false,
  turn: "w",
  isGameOver: false,
  coach: {
    isAnalyzing: false,
    quality: null,
    explanation: INITIAL_COACH_MESSAGE,
    evalDisplay: "0.0",
    bestMoveSan: null,
    lastMoveSan: null,
  },
};

function formatMovePairs(moves: string[]) {
  const pairs: { num: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }
  return pairs;
}

function PlayerCard({
  name,
  rating,
  subtitle,
  isActive,
  isThinking,
  avatarGradient,
}: {
  name: string;
  rating: number;
  subtitle: string;
  isActive?: boolean;
  isThinking?: boolean;
  avatarGradient: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
        isActive ? "bg-white/[0.06] ring-1 ring-emerald-500/30" : "bg-white/[0.02]"
      }`}
    >
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${avatarGradient} text-sm font-semibold text-white shadow-lg`}
      >
        {name.slice(0, 2).toUpperCase()}
        {isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white">{name}</p>
          {isThinking && (
            <span className="rounded-md bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-violet-300">
              Thinking
            </span>
          )}
          {isActive && !isThinking && (
            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
              Turn
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-semibold tabular-nums text-zinc-200">
          {rating}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Elo</p>
      </div>
    </div>
  );
}

function GlassPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 shadow-xl shadow-black/20 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export default function PlayPage() {
  const [gameKey, setGameKey] = useState(0);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(
  BOARD_THEMES[4],
);
const [showGameOverModal, setShowGameOverModal] =
  useState(false);

  const { moves, isThinking, turn, isGameOver, coach } = gameState;
  const movePairs = useMemo(() => formatMovePairs(moves), [moves]);
  const unlockedAchievements = ACHIEVEMENTS.filter(
    (a) => gamesPlayed >= a.gamesRequired,
  );
  
  const nextAchievement = ACHIEVEMENTS.find(
    (a) => gamesPlayed < a.gamesRequired,
  );

  const handleGameUpdate = useCallback((state: GameState) => {
    setGameState(state);
  
    if (state.isGameOver) {
      const updatedGames = gamesPlayed + 1;
  
      setGamesPlayed(updatedGames);
      if (state.winner === "white") {
        const updatedWins = wins + 1;
      
        setWins(updatedWins);
      
        localStorage.setItem(
          "wins",
          String(updatedWins),
        );
      }
      
      if (state.winner === "black") {
        const updatedLosses = losses + 1;
      
        setLosses(updatedLosses);
      
        localStorage.setItem(
          "losses",
          String(updatedLosses),
        );
      }
      
      if (state.winner === "draw") {
        const updatedDraws = draws + 1;
      
        setDraws(updatedDraws);
      
        localStorage.setItem(
          "draws",
          String(updatedDraws),
        );
      }
  
      localStorage.setItem("gamesPlayed", String(updatedGames));
  
      setShowGameOverModal(true);
    }
  }, [gamesPlayed, wins, losses, draws]);
  useEffect(() => {
    const savedGames = localStorage.getItem("gamesPlayed");
    const savedWins = localStorage.getItem("wins");
    const savedLosses = localStorage.getItem("losses");
    const savedDraws = localStorage.getItem("draws");
  
    if (savedGames) {
      setGamesPlayed(Number(savedGames));
    }
  
    if (savedWins) {
      setWins(Number(savedWins));
    }
  
    if (savedLosses) {
      setLosses(Number(savedLosses));
    }
  
    if (savedDraws) {
      setDraws(Number(savedDraws));
    }
  }, []);

  const handleNewGame = useCallback(() => {
    setGameKey((key) => key + 1);
    setGameState(INITIAL_GAME);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060608] text-zinc-100">
      {/* Ambient gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="animate-gradient-shift absolute -left-[20%] top-[-10%] h-[520px] w-[520px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="animate-gradient-shift-reverse absolute -right-[15%] top-[20%] h-[480px] w-[480px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="animate-gradient-pulse absolute bottom-[-10%] left-[30%] h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/[0.06] bg-black/20 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/25">
              <span className="text-sm font-bold text-white">♞</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                ChessFlow
              </p>
              <p className="hidden text-[10px] text-zinc-500 sm:block">
                AI-powered chess studio
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
          {[
  {
    name: "Play",
    href: "/play",
  },
  {
    name: "Puzzles",
    href: "/puzzles",
  },
  {
    name: "Learn",
    href: "/learn",
  },
  {
    name: "Analysis",
    href: "/analysis",
  },
  {
    name: "Premium",
    href: "/premium",
  },
].map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
  >
    {item.name}
    </Link>
))}
          </nav>

          <div className="flex items-center gap-3">
  <Link
    href="/premium"
    className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-300 transition hover:bg-yellow-500/20"
  >
    👑 Premium
  </Link>

  <Link
    href="/premium"
    className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 font-semibold text-white transition hover:scale-105"
  >
    Upgrade
  </Link>

  <AuthButton />
</div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 backdrop-blur-sm">
              <Flame className="h-3 w-3 text-orange-400" />
              Live training session
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Rapid Arena
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              10+0 · Rated · {moves.length} moves played
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 backdrop-blur-sm transition hover:bg-white/10"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Resign
            </button>
            <button
              type="button"
              onClick={handleNewGame}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:opacity-90"
            >
              <Zap className="h-3.5 w-3.5" />
              New game
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start">
          {/* Board column */}
          <div className="flex flex-col items-center gap-4">
            <GlassPanel className="w-full max-w-[min(100%,640px)] p-3 sm:p-4">
              <PlayerCard
                name="Stockfish"
                rating={3200}
                subtitle="Engine · Black"
                isActive={isThinking || turn === "b"}
                isThinking={isThinking}
                avatarGradient="from-zinc-600 to-zinc-800"
              />
            </GlassPanel>

            <div className="flex w-full max-w-[min(100%,640px)] gap-3">

{/* EVAL BAR */}
<div className="relative w-4 overflow-hidden rounded-full bg-zinc-800 ring-1 ring-white/10">
  <div
    className="absolute bottom-0 w-full bg-white transition-all duration-500"
    style={{
      height: `${Math.max(
        0,
        Math.min(100, 50 + Number(coach.evalDisplay) * 10)
      )}%`,
    }}
  />

  <div className="absolute inset-0 flex items-center justify-center">
    <span className="rotate-90 text-[9px] font-bold text-zinc-400">
      {coach.evalDisplay}
    </span>
  </div>
</div>

{/* CHESS BOARD */}
<GlassPanel className="flex-1 p-2 sm:p-3">
  <div
    className="chess-wrapper"
    style={{
      "--light": selectedTheme.light,
      "--dark": selectedTheme.dark,
    } as any}
  >
<ChessBoard
  key={gameKey}
  onGameUpdate={handleGameUpdate}
  boardLight={selectedTheme.light}
  boardDark={selectedTheme.dark}
  className="aspect-square w-full [&_div]:!max-w-none"
/>
  </div>
</GlassPanel>

</div>

            <GlassPanel className="w-full max-w-[min(100%,640px)]">
              <PlayerCard
                name="You"
                rating={1847}
                subtitle="Human · White"
                isActive={!isThinking && turn === "w" && !isGameOver}
                avatarGradient="from-violet-500 to-cyan-500"
              />
            </GlassPanel>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          <GlassPanel>
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
      Board Theme
    </h2>

    <span className="text-[10px] text-zinc-600">
      {selectedTheme.name}
    </span>
  </div>

  <div className="grid grid-cols-2 gap-2">
    {BOARD_THEMES.map((theme) => {
      const active = selectedTheme.id === theme.id;

      return (
        <button
          key={theme.id}
          type="button"
          onClick={() => setSelectedTheme(theme)}
          className={`rounded-xl border p-2 transition ${
            active
              ? "border-violet-500 bg-violet-500/10"
              : "border-white/5 bg-black/20 hover:bg-white/5"
          }`}
        >
          <div className="mb-2 flex gap-1">
            <div
              className="h-5 flex-1 rounded"
              style={{
                backgroundColor: theme.light,
              }}
            />

            <div
              className="h-5 flex-1 rounded"
              style={{
                backgroundColor: theme.dark,
              }}
            />
          </div>

          <p className="text-xs text-zinc-300">
            {theme.name}
          </p>
        </button>
      );
    })}
  </div>
</GlassPanel>
            <GlassPanel>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Move history
                </h2>
                <span className="font-mono text-xs text-zinc-600">
                  {Math.ceil(moves.length / 2) || "—"}
                </span>
              </div>
              <div className="max-h-[200px] overflow-y-auto rounded-xl bg-black/30 p-2 font-mono text-sm scrollbar-thin">
                {movePairs.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-zinc-600">
                    No moves yet — make your first move on the board
                  </p>
                ) : (
                  <table className="w-full">
                    <tbody>
                      {movePairs.map(({ num, white, black }) => (
                        <tr
                          key={num}
                          className="border-b border-white/[0.04] last:border-0"
                        >
                          <td className="w-8 py-1.5 pl-2 text-zinc-600">{num}.</td>
                          <td className="py-1.5 pr-2 text-zinc-200">{white}</td>
                          <td className="py-1.5 text-zinc-400">{black ?? ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </GlassPanel>

            <AICoachPanel coach={coach} isEngineThinking={isThinking} />
            <GlassPanel>
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
      Stats
    </h2>
  </div>

  <div className="space-y-3">
    <div className="flex items-center justify-between rounded-xl bg-black/20 p-3">
      <span className="text-sm text-zinc-400">
        Games
      </span>

      <span className="font-semibold text-white">
        {gamesPlayed}
      </span>
    </div>

    <div className="flex items-center justify-between rounded-xl bg-black/20 p-3">
      <span className="text-sm text-zinc-400">
        Wins
      </span>

      <span className="font-semibold text-emerald-400">
        {wins}
      </span>
    </div>

    <div className="flex items-center justify-between rounded-xl bg-black/20 p-3">
      <span className="text-sm text-zinc-400">
        Losses
      </span>

      <span className="font-semibold text-red-400">
        {losses}
      </span>
    </div>

    <div className="flex items-center justify-between rounded-xl bg-black/20 p-3">
      <span className="text-sm text-zinc-400">
        Draws
      </span>

      <span className="font-semibold text-yellow-400">
        {draws}
      </span>
    </div>
  </div>
</GlassPanel>
            <GlassPanel>
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
      Progression
    </h2>

    <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-300">
      {gamesPlayed} games
    </span>
  </div>

  <div className="space-y-3">
    {ACHIEVEMENTS.map((achievement) => {
      const unlocked =
        gamesPlayed >= achievement.gamesRequired;

      return (
        <div
          key={achievement.id}
          className={`rounded-xl border p-3 transition ${
            unlocked
              ? "border-emerald-500/20 bg-emerald-500/10"
              : "border-white/5 bg-black/20"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-sm font-medium ${
                  unlocked
                    ? "text-emerald-300"
                    : "text-zinc-300"
                }`}
              >
                {achievement.title}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {achievement.description}
              </p>
            </div>

            <div
              className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
                unlocked
                  ? "bg-emerald-400/20 text-emerald-300"
                  : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {unlocked ? "Unlocked" : "Locked"}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2">
            <span className="text-xs text-zinc-500">
              Reward
            </span>

            <span className="text-xs font-medium text-amber-300">
              {achievement.reward}
            </span>
          </div>
        </div>
      );
    })}
  </div>

  {nextAchievement && (
    <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
      <p className="text-xs font-medium text-violet-300">
        Next unlock
      </p>

      <p className="mt-1 text-sm text-white">
        {nextAchievement.reward}
      </p>

      <p className="mt-1 text-xs text-zinc-400">
        Play{" "}
        {nextAchievement.gamesRequired - gamesPlayed} more
        games
      </p>
    </div>
  )}
</GlassPanel>

            <GlassPanel className="border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] to-orange-500/[0.04]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-amber-100">
                    Unlock Premium
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                    Unlimited AI coaching, opening explorer, and advanced
                    engine depth.
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:opacity-90"
                  >
                    Start free trial
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </GlassPanel>
          </aside>
        </div>
        {showGameOverModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111114] p-6 shadow-2xl">
      <h2 className="text-3xl font-bold text-white">
        Game Over
      </h2>

      <p className="mt-2 text-zinc-400">
        Your progress has been saved.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            setShowGameOverModal(false);

            setGameKey((key) => key + 1);
            setGameState(INITIAL_GAME);
          }}
          className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          Play Again
        </button>

        <button
          onClick={() => setShowGameOverModal(false)}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-zinc-300 transition hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </main>
    </div>
  );
}
