import { useState } from "react";
import "./AddGamePage.css";
import { useHistory } from "react-router-dom";
import { Game } from "./GameTypes";
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

function makeEmptyPlayer(numRounds: number): FormPlayer {
  return { name: "", scores: new Array(numRounds).fill("0") };
}

export function AddGamePage() {
  const [gameTitle, setGameTitle] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [numRounds, setNumRounds] = useState(10);
  const [players, setPlayers] = useState<FormPlayer[]>([
    makeEmptyPlayer(numRounds),
    makeEmptyPlayer(numRounds),
  ]);
  const [posting, setPosting] = useState(false);
  const history = useHistory();

  function removeRound() {
    if (numRounds <= 10) return;

    setNumRounds(numRounds - 1);
    setPlayers(
      players.map((p) => ({ ...p, scores: p.scores.slice(0, numRounds - 1) }))
    );
  }

  function addRound() {
    setNumRounds(numRounds + 1);
    setPlayers(
      players.map((p) => ({
        ...p,
        scores: [...p.scores, p.scores[numRounds - 1]],
      }))
    );
  }

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
      <table>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td className="min-width">{index + 1}.</td>
              <td className="fill">
                <input
                  type="text"
                  value={player.name}
                  placeholder={`Player #${index + 1}'s name`}
                  className={
                    "fill " + (validateString(player.name) ? "" : "invalid")
                  }
                  onChange={(e) => {
                    players[index] = {
                      ...players[index],
                      name: e.target.value.trim(),
                    };
                    setPlayers([...players]);
                  }}
                />
              </td>
              <td className="min-width">
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
              </td>
            </tr>
          ))}
          <tr>
            <td className="min-width" />
            <td colSpan={2}>
              <button
                onClick={() => {
                  setPlayers([...players, makeEmptyPlayer(numRounds)]);
                }}
              >
                Add player
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
              {Array.from({ length: numRounds }, (_, index) => (
                <tr key={index}>
                  <th>
                    {numRounds > 10 && index === numRounds - 1 ? (
                      <button type="button" onClick={removeRound}>
                        ❌
                      </button>
                    ) : (
                      `#${index + 1}`
                    )}
                  </th>
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
            <tfoot>
              <tr>
                <th>
                  <button type="button" onClick={addRound}>
                    ➕
                  </button>
                </th>
                <th colSpan={players.length}>
                  Add {numRounds > 10 ? "another" : ""} tie breaker round
                </th>
              </tr>
            </tfoot>
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
