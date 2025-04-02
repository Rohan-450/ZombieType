import React from "react";
import { useTime } from "../context/timeContext";
import ScreenshotShare from "./screenshotShare.jsx";

const TypingArea = ({
  typingText,
  inpFieldValue,
  timeLeft,
  mistakes,
  WPM,
  CPM,
  initTyping,
  handleKeyDown,
  resetGame,
}) => {
  const { setIsOpen } = useTime();
  const hanldeSetButton = () => {
    setIsOpen(true);
  };

  return (
    <div className="typing-area">
      <div className="section1">
        {timeLeft > 0 ? (
          <p id="paragraph">{typingText}</p>
        ) : (
          <p id="time-over">Time Over</p>
        )}
      </div>

      <div className="section2">
        <button onClick={hanldeSetButton} style={{ background: '#4299e1' }}>Set Time</button>
        <ul className="resultDetails">
          {/* <li className="time">Time Left: {timeLeft}s</li>
          <li className="mistakes">Mistakes: {mistakes}</li>
          <li className="wpm">WPM: {WPM}</li>
          <li className="cpm">CPM: {CPM.toFixed(2)}</li> */}
          <li>⏳ Time Left: {timeLeft}s</li>
          <li>❌ Mistakes: {mistakes}</li>
          <li>⚡ WPM: {WPM}</li>
          <li>🎯 CPM: {CPM.toFixed(2)}</li>
        </ul>
        <button onClick={resetGame} style={{ background: '#e53e3e' }} className="reset-btn">Reset</button>
      </div>
    </div>
  );
};

export default TypingArea;
