export interface GamePlayer {
  readonly name: string;
  readonly scores: number[];
}

export interface Game {
  readonly title: string;
  readonly date: string;
  readonly players: GamePlayer[];
}
