import React, { useState } from "react";
import { BestScoreTable } from "./BestScoreTable";
import { RoundScoreTable } from "./RoundScoreTable";
import "./AddGamePage.css";
import { useHistory } from "react-router-dom";
import { Game, GamePlayer } from "./GameTypes";
import useFetch from "use-http";
import { apiHost } from "./const";

function validateString(s: string) {
  return s.length > 0;
}

function validateNumber(i: string) {
  return i.match(/^\d+$/);
}

interface FormPlayer {
  readonly name: string;
  readonly scores: string[];
}

function makeEmptyPlayer(): FormPlayer {
  return { name: "", scores: new Array(10).fill("0") };
}

export function AddGamePage() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [players, setPlayers] = useState<FormPlayer[]>([
    makeEmptyPlayer(),
    makeEmptyPlayer(),
  ]);
  const [posting, setPosting] = useState(false);
  const history = useHistory();

  function submit() {
    const errors = [];
    if (!validateString(gameTitle)) {
      errors.push("Game must have a title");
    }
    if (!validateString(gameDate)) {
      errors.push("Game must have a date");
    }
    if (players.length < 2) {
      errors.push("Game must have at least two players");
    }
    for (let i = 0; i < players.length; ++i) {
      let player = players[i];
      if (!validateString(player.name)) {
        errors.push(`Expected a name for player #${i + 1}`);
      }
      for (let j = 0; j < player.scores.length; ++j) {
        if (!validateNumber(player.scores[j])) {
          errors.push(
            `Player #${i + 1}'s score for round #${j + 1} must be a number`
          );
        }
      }
    }
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }

    const game: Game = {
      title: gameTitle,
      date: gameDate,
      players: players.map((player) => ({
        ...player,
        scores: player.scores.map((x) => parseInt(x)),
      })),
    };

    setPosting(true);
    fetch(`${apiHost}/game`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(game),
    })
      .then(async (resp) => {
        if (resp.status !== 200) {
          throw new Error(`[${resp.status}] ${await resp.text()}`);
        } else {
          return await resp.json();
        }
      })
      .then(({ id }) => {
        history.push(`/game/${id}`);
      })
      .catch((error) => {
        alert(`${error}`);
      })
      .finally(() => {
        setPosting(false);
      });
  }

  return (
    <div className="AddGamePage">
      <h2>Add game</h2>

      <p>
        <label>
          Title of game
          <input
            type="text"
            placeholder="Title of game"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value.trimStart())}
            className={validateString(gameDate) ? "" : "invalid"}
          />
        </label>
      </p>

      <p>
        <label>
          Date of game
          <input
            type="date"
            value={gameDate}
            onChange={(e) => setGameDate(e.target.value)}
            className={validateString(gameDate) ? "" : "invalid"}
          />
        </label>
      </p>

      <h3>Players</h3>
      <ol className="player-list">
        {players.map((player, index) => (
          <li key={index}>
            <div className="player-row">
              <input
                type="text"
                value={player.name}
                placeholder={`Player #${index + 1}'s name`}
                className={validateString(player.name) ? "" : "invalid"}
                onChange={(e) => {
                  players[index] = {
                    ...players[index],
                    name: e.target.value.trim(),
                  };
                  setPlayers([...players]);
                }}
              />
              <button
                tabIndex={-1}
                onClick={() => {
                  if (
                    !window.confirm(
                      "Are you sure you want to delete this player?"
                    )
                  )
                    return;
                  players.splice(index, 1);
                  setPlayers([...players]);
                }}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            onClick={() => {
              setPlayers([...players, makeEmptyPlayer()]);
            }}
          >
            Add player
          </button>
        </li>
      </ol>

      {players.length > 0 ? (
        <>
          <h3>Scores</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {players.map((player, index) => (
                  <th key={index}>{player.name || `P${index + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, index) => (
                <tr key={index}>
                  <th>#{index + 1}</th>
                  {players.map((player, playerIndex) => (
                    <td key={playerIndex} className="score-entry">
                      <input
                        type="text"
                        value={player.scores[index]}
                        className={
                          validateNumber(player.scores[index]) ? "" : "invalid"
                        }
                        onChange={(e) => {
                          player.scores[index] = e.target.value.trim();
                          setPlayers([...players]);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            <button type="submit" onClick={submit} disabled={posting}>
              {posting ? "Submitting..." : "Add game"}
            </button>
          </p>
        </>
      ) : null}
    </div>
  );
}
