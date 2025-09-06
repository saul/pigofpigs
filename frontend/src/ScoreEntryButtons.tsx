import React from "react";
import "./ScoreEntryButtons.css";

export type ScoreEntryAction = "add-plus" | "pigged-out";

export type ScoreEntryCallback = (action: ScoreEntryAction) => void;

interface ScoreEntryButtonsProps {
  onAction: ScoreEntryCallback;
}

export function ScoreEntryButtons({ onAction }: ScoreEntryButtonsProps) {
  return (
    <div className="entry-buttons">
      <div className="container">
        <button onClick={() => onAction("add-plus")}>+</button>
        <button onClick={() => onAction("pigged-out")}>Pigged out</button>
      </div>
    </div>
  );
}
