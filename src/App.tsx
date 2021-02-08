import React from "react";
import logo from "./logo.png";
import "./App.css";
import {
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import { LeaderboardPage } from "./LeaderboardPage";
import { AddGamePage } from "./AddGamePage";
import { GameDetail } from "./GameDetail";
import useFetch from "use-http";
import { Roles } from "./Claims";
import { apiHost } from "./const";

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
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />

      <nav>
        <ul>
          <li>
            <NavLink to="/" exact>
              Leaderboards
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
        <Route path="/" exact>
          <LeaderboardPage />
        </Route>
        <Route path="/">
          <h2>404</h2>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
