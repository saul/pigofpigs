import React from "react";
import { NavLink } from "react-router-dom";
import useFetch from "use-http";
import { apiHost } from "./const";
import { PositionEmoji } from "./PositionEmoji";
import "./GameListPage.css";

interface GameListPlayer {
  readonly name: string;
  readonly score: string;
}

interface GameList {
  readonly id: number;
  readonly title: string;
  readonly date: string;
  readonly players: GameListPlayer[];
}

export function GameListPage() {
  const {
    loading,
    error,
    data = [],
  } = useFetch<GameList[]>(`${apiHost}/game`, {}, []);

  if (error) return <>Error: {error.message}</>;
  if (loading) return <>Loading...</>;

  return (
    <>
      <h2>Games played</h2>
      {data.map((game) => (
        <div className="game-card">
          <h3 className="game-card--title">
            <NavLink to={`/game/${game.id}`}>{game.title}</NavLink>
          </h3>
          <div className="game-card--meta">
            Played on <em>{new Date(game.date).toLocaleDateString()}</em> by{" "}
            {game.players.length} players
          </div>
          <ul className="game-card--players">
            {game.players.map((player, index) => (
              <li className={index === 0 ? "winner" : "loser"}>
                <PositionEmoji position={index + 1} /> {player.name} (
                {player.score})
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
