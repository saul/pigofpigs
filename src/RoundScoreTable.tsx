import React from "react";
import { NavLink } from "react-router-dom";
import useFetch from "use-http";
import { apiHost } from "./const";
import { PositionEmoji } from "./PositionEmoji";

interface RoundScoreResult {
  readonly player: string;
  readonly date: string;
  readonly game: string;
  readonly gameID: number;
  readonly round: number;
  readonly points: number;
}

interface RoundScoreTableProps {
  url: string;
  pointsTitle: string;
  winnerEmoji?: string;
}

export function RoundScoreTable({
  url,
  pointsTitle,
  winnerEmoji
}: RoundScoreTableProps): JSX.Element {
  const { loading, error, data = [] } = useFetch<RoundScoreResult[]>(
    `${apiHost}/${url}`,
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
          <th className="min-width">{pointsTitle}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((r, index) => (
          <tr key={index}>
            <td className="min-width score">
              <PositionEmoji position={index + 1} winnerEmoji={winnerEmoji} />
            </td>
            <td className="fill">
              <strong>{r.player}</strong>
              <br />
              in round {r.round} of <NavLink to={`/game/${r.gameID}`}>{r.game}</NavLink>
              <br />
              on <em>{new Date(r.date).toLocaleDateString()}</em>
            </td>
            <td className="min-width right">{r.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
