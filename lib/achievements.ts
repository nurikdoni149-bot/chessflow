export type Achievement = {
    id: string;
    title: string;
    description: string;
    gamesRequired: number;
    reward: string;
  };
  
  export const ACHIEVEMENTS: Achievement[] = [
    {
      id: "games_5",
      title: "Beginner",
      description: "Play 5 games",
      gamesRequired: 5,
      reward: "Wooden Board",
    },
    {
      id: "games_10",
      title: "Grinder",
      description: "Play 10 games",
      gamesRequired: 10,
      reward: "Neon Pieces",
    },
    {
      id: "games_25",
      title: "Arena Master",
      description: "Play 25 games",
      gamesRequired: 25,
      reward: "Galaxy Board",
    },
    {
      id: "games_50",
      title: "ChessFlow Elite",
      description: "Play 50 games",
      gamesRequired: 50,
      reward: "Gold Pieces",
    },
  ];