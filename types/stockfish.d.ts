declare module "stockfish" {
  type StockfishEngine = {
    sendCommand: (cmd: string) => void;
    listener?: (line: string) => void;
  };

  function initEngine(
    enginePath?: string | ((err: Error | null, engine: StockfishEngine) => void),
  ): Promise<StockfishEngine>;

  export default initEngine;
}
