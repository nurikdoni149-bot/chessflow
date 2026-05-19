const lessons = [
    {
      title: "Control the center",
      description:
        "Try to control the center squares with your pawns and pieces.",
    },
  
    {
      title: "Develop your pieces",
      description:
        "Bring knights and bishops into the game early.",
    },
  
    {
      title: "Castle early",
      description:
        "Protect your king by castling in the opening.",
    },
  
    {
      title: "Do not hang pieces",
      description:
        "Always check if your pieces are defended.",
    },
  ];
  
  export default function LearnPage() {
    return (
      <div className="min-h-screen bg-[#060608] p-8 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold">
            Learn Chess
          </h1>
  
          <p className="mt-2 text-zinc-400">
            Improve your chess fundamentals.
          </p>
  
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {lessons.map((lesson) => (
              <div
                key={lesson.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h2 className="text-2xl font-bold">
                  {lesson.title}
                </h2>
  
                <p className="mt-3 text-zinc-400">
                  {lesson.description}
                </p>
  
                <button className="mt-5 rounded-xl bg-violet-600 px-4 py-2 font-semibold text-white transition hover:bg-violet-500">
                  Start Lesson
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }