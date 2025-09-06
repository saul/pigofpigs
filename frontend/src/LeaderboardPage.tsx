import React from "react";
import { BestScoreTable } from "./BestScoreTable";
import { RoundScoreTable } from "./RoundScoreTable";

export function LeaderboardPage() {
  return (
    <>
      <h2>Jump to</h2>
      <ul>
        <li>
          <a href="#highest-scores">Highest scores</a>
        </li>
        <li>
          <a href="#best-round-scores">Best round scores</a>
        </li>
        <li>
          <a href="#best-comebacks">Best comebacks</a>
        </li>
        <li>
          <a href="#worst-round-scores">Worst round scores</a>
        </li>
      </ul>

      <h2 id="highest-scores">Highest scores</h2>
      <BestScoreTable />

      <h2 id="best-round-scores">Best round scores</h2>
      <RoundScoreTable url="leaderboard/best-rounds" pointsTitle="Points" />

      <h2 id="best-comebacks">Best comebacks</h2>
      <RoundScoreTable url="leaderboard/comebacks" pointsTitle="Trailing by" />

      <h2 id="worst-round-scores">Biggest round loss</h2>
      <RoundScoreTable
        url="leaderboard/worst-rounds"
        pointsTitle="Points lost"
        winnerEmoji="💩"
      />
    </>
  );
}
