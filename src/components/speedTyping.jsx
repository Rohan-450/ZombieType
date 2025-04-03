


import React, { useState, useEffect, useRef } from "react";
import "./speedTyping.css";
import TypingArea from "./typingArea.jsx";
import { useTime } from "../context/timeContext.js";
import Pop from "./pop.jsx";

import axios from "axios";

const SpeedTypingGame = () => {
  const { isOpen, time } = useTime();
  const [paragraphs, setParagraphs] = useState([]);
  const [typingText, setTypingText] = useState([]);



  const [inpFieldValue, setInpFieldValue] = useState("");
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);

  // Fetch paragraphs from backend
  useEffect(() => {
    const fetchParagraphs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/para/getpara");
        setParagraphs(response.data.map(item => item.para)); // Extract only `para` field
      } catch (error) {
        console.error("Error fetching paragraphs:", error);
      }
    };
    fetchParagraphs();
  }, []);

  // Load a random paragraph
  const loadParagraph = () => {
    if (paragraphs.length === 0) return;

    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        className={`char ${index === 0 ? "active" : ""}`}
        style={{ color: letter !== " " ? "black" : "transparent" }}
      >
        {letter !== " " ? letter : "_"}
      </span>
    ));

    setTypingText(content);
    setInpFieldValue("");
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    inputRef.current.focus();
  };

  // Calculate WPM
  const calculateWPM = (charIndex, mistakes, timeLeft) => {
    let wpm = Math.round(((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60);
    return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
  };

  // Calculate CPM
  const calculateCPM = (charIndex, mistakes, timeLeft) => {
    let cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
    return cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
  };

  // Handle user input
  const initTyping = (event) => {
    const characters = document.querySelectorAll(".char");
    let typedChar = event.target.value;

    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].innerText;
      if (currentChar === "_") currentChar = " ";

      if (!isTyping) setIsTyping(true);

      if (typedChar === currentChar) {
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
        if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.remove("active");
        characters[charIndex].classList.add("correct");
      } else {
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
        setMistakes((prevMistakes) => prevMistakes + 1);
        characters[charIndex].classList.remove("active");
        if (charIndex + 1 < characters.length) characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.add("wrong");
      }

      if (charIndex === characters.length - 1) setIsTyping(false);

      setWPM(calculateWPM(charIndex, mistakes, timeLeft));
      setCPM(calculateCPM(charIndex, mistakes, timeLeft));
    } else {
      setIsTyping(false);
    }
  };

  // Handle backspace
  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll(".char");
    if (event.key === "Backspace" && charIndex > 0 && timeLeft > 0) {
      if (characters[charIndex - 1].classList.contains("correct")) {
        characters[charIndex - 1].classList.remove("correct");
      }
      if (characters[charIndex - 1].classList.contains("wrong")) {
        characters[charIndex - 1].classList.remove("wrong");
        setMistakes((prevMistakes) => prevMistakes - 1);
      }
      characters[charIndex].classList.remove("active");
      characters[charIndex - 1].classList.add("active");
      setCharIndex((prevCharIndex) => prevCharIndex - 1);
      setCPM(calculateCPM(charIndex - 1, mistakes, timeLeft));
      setWPM(calculateWPM(charIndex - 1, mistakes, timeLeft));
    }
  };

  // Reset the game
  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setTypingText([]);
    setCPM(0);
    setWPM(0);

    const characters = document.querySelectorAll(".char");
    characters.forEach((span) => {
      span.classList.remove("correct", "wrong", "active");
    });

    loadParagraph();
  };

  // Update timer from context
  useEffect(() => {
    setTimeLeft(time);
    if (isTyping) {
      setIsTyping(false);
      setTimeout(resetGame, 0);
    } else {
      setTimeout(() => {
        const characters = document.querySelectorAll(".char");
        characters.forEach((char) => char.classList.remove("active"));
        if (characters[charIndex]) characters[charIndex].classList.add("active");
      }, 0);

      if (inputRef.current) inputRef.current.focus();
    }
  }, [time]);

  // Load a paragraph once data is available
  useEffect(() => {
    if (paragraphs.length > 0) loadParagraph();
  }, [paragraphs]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        setCPM(calculateCPM(charIndex, mistakes, timeLeft));
        setWPM(calculateWPM(charIndex, mistakes, timeLeft));
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => clearInterval(interval);
  }, [isTyping, timeLeft]);

  return (
    <div className="container" ref={resultRef}>
      <input
        type="text"
        className="input-field"
        value={inpFieldValue}
        onChange={initTyping}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      <TypingArea
        typingText={typingText}
        inpFieldValue={inpFieldValue}
        timeLeft={timeLeft}
        mistakes={mistakes}
        WPM={WPM}
        CPM={CPM}
        initTyping={initTyping}
        handleKeyDown={handleKeyDown}
        resetGame={resetGame}
      />

      {isOpen && <Pop inputRef={inputRef} />}

    </div>
  );
};

export default SpeedTypingGame;
