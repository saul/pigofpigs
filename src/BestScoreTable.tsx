import React from "react";
import useFetch from "use-http";
import { apiHost } from "./const";
import { PositionEmoji } from "./PositionEmoji";

interface GameResult {
  readonly player: string;
  readonly date: string;
  readonly game: string;
  readonly gameID: number;
  readonly score: number;
}

export function BestScoreTable(): JSX.Element {
  const { loading, error, data = [] } = useFetch<GameResult[]>(
    `${apiHost}/leaderboard/best-scores`,
    {},
    []
  );

  if (error) return <>Error: {error.message}</>;
  if (loading) return <>Loading...</>;

  return (
    <table>
      <thead>
        <tr>
          <th className="min-width">#</th>
          <th className="fill">Player</th>
          <th className="min-width">Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, index) => (
          <tr key={index}>
            <td className="min-width score">
              <PositionEmoji position={index + 1} />
            </td>
            <td className="fill">
              <strong>{r.player}</strong>
              <br />
              in <a href={`/game/${r.gameID}`}>{r.game}</a>
              <br />
              on <em>{new Date(r.date).toLocaleDateString()}</em>
            </td>
            <td className="min-width right">{r.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
