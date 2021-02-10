import React from "react";
import useFetch from "use-http";
import { apiHost } from "./const";
import { PositionEmoji } from "./PositionEmoji";

interface Player {
  readonly name: string;
  readonly gamesPlayed: number;
  readonly gamesWon: number;
  readonly averageScore: number;
}

export function PlayersPage() {
  const { loading, error, data = [] } = useFetch<Player[]>(
    `${apiHost}/player`,
    {},
    []
  );

  if (error) return <>Error: {error.message}</>;
  if (loading) return <>Loading...</>;

  return <>
    <h2>Player league table</h2>
    <table>
      <thead>
        <tr>
          <th className="min-width">#</th>
          <th className="fill">Player</th>
          <th className="min-width">P</th>
          <th className="min-width">W</th>
          <th className="min-width">L</th>
          <th className="min-width">AvS</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p, index) => (
          <tr key={index}>
            <td className="min-width score">
              <PositionEmoji position={index + 1} />
            </td>
            <td className="fill">{p.name}</td>
            <td className="min-width fill">{p.gamesPlayed}</td>
            <td className="min-width fill">{p.gamesWon}</td>
            <td className="min-width fill">{p.gamesPlayed - p.gamesWon}</td>
            <td className="min-width right">{p.averageScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>;
}
