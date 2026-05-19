export type BoardTheme = {
    id: string;
    name: string;
  
    light: string;
    dark: string;
  };
  
  export const BOARD_THEMES: BoardTheme[] = [
    {
      id: "classic",
      name: "Classic",
      light: "#f0d9b5",
      dark: "#b58863",
    },
  
    {
      id: "midnight",
      name: "Midnight",
      light: "#c7d2fe",
      dark: "#312e81",
    },
  
    {
      id: "emerald",
      name: "Emerald",
      light: "#d1fae5",
      dark: "#065f46",
    },
  
    {
      id: "obsidian",
      name: "Obsidian",
      light: "#52525b",
      dark: "#18181b",
    },
  
    {
      id: "neon",
      name: "Neon",
      light: "#67e8f9",
      dark: "#7c3aed",
    },
  ];