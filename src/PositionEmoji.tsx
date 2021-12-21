import React from "react";

interface PositionEmojiProps {
  position: number;
  winnerEmoji?: string;
}

const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
const suffixes: any = {
  one: "st",
  two: "nd",
  few: "rd",
};
function ordinal(number: number) {
  return suffixes[ordinalRules.select(number)] || "th";
}

export function PositionEmoji({ position, winnerEmoji }: PositionEmojiProps) {
  if (position === 1) {
    return <>{winnerEmoji || "👑"}</>;
  } else if (position === 2) {
    return <>🥈</>;
  } else if (position === 3) {
    return <>🥉</>;
  } else {
    return (
      <small>
        {position.toString()}
        <sup>{ordinal(position)}</sup>
      </small>
    );
  }
}
