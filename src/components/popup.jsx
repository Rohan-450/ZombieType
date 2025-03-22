import React, { useContext, useState } from "react";
import "./speedTyping.css";
import { ContextProvider } from "./context";
function Popup({ inputRef }) {
  const { time, setTime, setIsOpen, setTimeLeft } = useContext(ContextProvider); //get the time from contextAPI

  //update the state of the time
  const handleChnage = (e) => {
    let tempTime = Math.floor(e.target.value);
    tempTime = removeZero(tempTime); //remove if there any leading zero
    if (tempTime <= 60 && tempTime >= 1) {
      setTime(tempTime);
    } else {
      tempTime = tempTime / 10;
      setTime(Math.floor(tempTime));
    }
  };

  //remove if there any leading zero
  const removeZero = (num) => {
    let tempNum = num.toString();
    if (tempNum.startsWith("0")) {
      tempNum = Number(tempNum.slice(1));
    }

    return tempNum;
  };

  // handle the set button click

  const handleClick = () => {
    setIsOpen(false);
    setTimeLeft(time);
    inputRef.current.focus();
  };

  const handleCancle = () => {
    setIsOpen(false);
  };
  return (
    <div className="popup">
      <input type="number" value={time} onChange={handleChnage} />
      <div className="box">
        <button
          style={{ backgroundColor: "white", color: "black" }}
          onClick={handleClick}
        >
          Set Time
        </button>

        <button
          style={{ backgroundColor: "white", color: "black" }}
          onClick={handleCancle}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Popup;
