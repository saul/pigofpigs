import React from "react";

interface PositionEmojiProps {
  position: number;
  winnerEmoji?: string;
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
      <>
        {position.toString()}
        <sup>th</sup>
      </>
    );
  }
}
