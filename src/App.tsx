import React from "react";
import "./App.css";
import { Switch, Route, NavLink } from "react-router-dom";
import { LeaderboardPage } from "./LeaderboardPage";
import { AddGamePage } from "./AddGamePage";
import { GameDetail } from "./GameDetail";
import useFetch from "use-http";
import { Roles } from "./Claims";
import { apiHost } from "./const";
import { PlayersPage } from "./PlayersPage";
import { GameListPage } from "./GameListPage";

function App() {
  const { loading, data: roles } = useFetch<Roles>(
    `${apiHost}/account/claims`,
    { credentials: "include" },
    []
  );

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink to="/" exact>
              Leaderboards
            </NavLink>
          </li>
          <li>
            <NavLink to="/game">
              Games
            </NavLink>
          </li>
          <li>
            <NavLink to="/players" exact>
              Players
            </NavLink>
          </li>
          <li>
            {roles?.isAdmin ? (
              <NavLink to="/add">Add game</NavLink>
            ) : (
              <a
                href={`${apiHost}/account/google-login?redirect=${window.location.href}`}
              >
                Login...
              </a>
            )}
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path="/add">
          <AddGamePage />
        </Route>
        <Route path="/game/:id">
          <GameDetail roles={roles} />
        </Route>
        <Route path="/game" exact>
          <GameListPage />
        </Route>
        <Route path="/players">
          <PlayersPage />
        </Route>
        <Route path="/" exact>
          <LeaderboardPage />
        </Route>
        <Route path="/">
          <h2>Not found!</h2>
        </Route>
      </Switch>
    </>
  );
}

export default App;
