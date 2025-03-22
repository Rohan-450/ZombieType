import React, { useContext } from "react";
import { ContextProvider } from "./context";

const TypingArea = ({
  typingText,
  inpFieldValue,
  mistakes,
  WPM,
  CPM,
  initTyping,
  handleKeyDown,
  resetGame,
}) => {
  console.log("Hello");
  const { setIsOpen, timeLeft } = useContext(ContextProvider);
  const hanldeSetButton = () => {
    setIsOpen(true);
  };
  return (
    <div className="typing-area">
      <div className="section1">
        <p id="paragraph">{typingText}</p>
      </div>
      <div className="section2">
        <button onClick={hanldeSetButton}>Set Time</button>
        <ul className="resultDetails">
          <li className="time">Time Left: {timeLeft}s</li>
          <li className="mistakes">Mistakes: {mistakes}</li>
          <li className="wpm">WPM: {WPM}</li>
          <li className="cpm">CPM: {CPM.toFixed(2)}</li>
        </ul>
        <button onClick={resetGame}>Reset</button>
      </div>
    </div>
  );
};

export default TypingArea;
