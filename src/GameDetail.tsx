import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useFetch from "use-http";
import { Roles } from "./Claims";
import { apiHost } from "./const";
import { Game } from "./GameTypes";
import { PositionEmoji } from "./PositionEmoji";

interface GameDetailProps {
  readonly roles?: Roles;
}

interface GameDetailParams {
  id: string;
}

export function GameDetail({ roles }: GameDetailProps) {
  const { id } = useParams<GameDetailParams>();
  const history = useHistory();
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading, error, data } = useFetch<Game>(
    `${apiHost}/game/${id}`,
    {},
    []
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return (
      <>
        <h2>Failed to load game 😢</h2>
        <p>{error.message}</p>
      </>
    );
  }

  if (!data) {
    throw new Error("unreachable");
  }

  function onDelete() {
    if (!window.confirm("Are you sure you want to delete this game?")) return;

    setIsDeleting(true);
    fetch(`${apiHost}/game/${id}/delete`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (resp) => {
        setIsDeleting(false);
        if (resp.status !== 200) {
          throw new Error(`[${resp.status}] ${await resp.text()}`);
        } else {
          history.replace("/");
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  }

  const orderedScores = data.players
    .map((p) => p.scores[9])
    .sort((a, b) => b - a);
  
  const numRounds = data.players[0].scores.length;

  return (
    <>
      <h2>Game: {data.title}</h2>
      <p>
        Played on <em>{new Date(data.date).toLocaleDateString()}</em>
      </p>

      <h3>Scores</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {data.players.map((p, i) => (
              <th key={i}>
                {p.name} (
                <PositionEmoji
                  position={1 + orderedScores.indexOf(p.scores[9])}
                />
                )
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numRounds }, (_, roundIndex) => (
            <tr key={roundIndex} id={`round-${roundIndex + 1}`}>
              <th>#{roundIndex + 1}</th>
              {data.players.map((p, playerIndex) => (
                <td key={playerIndex}>{p.scores[roundIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {roles?.isAdmin ? (
        <p>
          <button type="button" onClick={onDelete} disabled={isDeleting}>
            🚮 Delete
          </button>
        </p>
      ) : null}
    </>
  );
}
