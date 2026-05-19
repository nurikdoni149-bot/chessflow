export type Puzzle = {
    id: number;
    title: string;
    fen: string;
    solution: string;
  };
  
  export const PUZZLES: Puzzle[] = [
    {
      id: 1,
      title: "Mate in 1",
      fen: "6k1/5ppp/8/8/8/8/5PPP/6KQ w - - 0 1",
      solution: "Qd8#",
    },
  
    {
      id: 2,
      title: "Mate in 1",
      fen: "7k/5Q2/7K/8/8/8/8/8 w - - 0 1",
      solution: "Qg7#",
    },
  
    {
      id: 3,
      title: "Win the queen",
      fen: "rnb1kbnr/pppp1ppp/8/4p3/3q4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      solution: "Qxd4",
    },
  ];