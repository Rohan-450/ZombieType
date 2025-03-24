import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, BarChart2, Keyboard, AlertCircle, Timer } from 'lucide-react';
import './speedTyping.css';

const paragraphs = [
  "A plant is one of the most important living things that develop on the Earth and is made up of stems, leaves, roots, and so on. The part of the plant that develops beneath the soil is referred to as the root, while the part that grows outside the soil is known as the shoot.",
  "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo, and its main function is to provide stability to the plant and absorb mineral salts from the soil for various metabolic processes.",
  "The stem is the upper part of the plant that remains above the ground and grows in a direction opposite to gravity (negatively geotropic). It consists of nodes and internodes. Various structures such as branches, buds, leaves, petioles, flowers, and inflorescences develop at the nodes.",
  "A flower is the blossom of a plant and plays a crucial role in reproduction by producing seeds, which eventually grow into new plants. It serves as the reproductive system of a plant. Most flowers consist of four main parts: sepals, petals, stamens, and carpels.",
  "An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic Myanmar to be less than kutcha. One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look.",
];

export default function TypingSpeedTest() {
  const [typingText, setTypingText] = useState([]);
  const maxTime = 60;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(100);
  const [accuracy, setAccuracy] = useState(100);

  const calculateWPM = (charIndex, mistakes, timeLeft) => {
    const wpm = Math.round(((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60);
    return wpm < 0 || !wpm || wpm === Number.POSITIVE_INFINITY ? 0 : wpm;
  };

  const calculateCPM = (charIndex, mistakes, timeLeft) => {
    const cpm = (charIndex - mistakes) * (60 / (maxTime - timeLeft));
    return cpm < 0 || !cpm || cpm === Number.POSITIVE_INFINITY ? 0 : cpm;
  };

  const calculateAccuracy = (charIndex, mistakes) => {
    if (charIndex === 0) return 100;
    return Math.max(0, Math.floor(((charIndex - mistakes) / charIndex) * 100));
  };

  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        className={`${index === 0 ? "active" : ""} ${letter === " " ? "space" : ""}`}
      >
        {letter}
      </span>
    ));
    setTypingText(content);
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setAccuracy(100);
    if (inputRef.current) inputRef.current.value = "";
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  };

  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll(".typing-text span");
    if (event.key === "Backspace" && charIndex > 0 && charIndex < characters.length && timeLeft > 0) {
      if (characters[charIndex - 1].classList.contains("correct")) {
        characters[charIndex - 1].classList.remove("correct");
      }
      if (characters[charIndex - 1].classList.contains("incorrect")) {
        characters[charIndex - 1].classList.remove("incorrect");
        setMistakes((prevMistakes) => prevMistakes - 1);
      }
      characters[charIndex].classList.remove("active");
      characters[charIndex - 1].classList.add("active");
      setCharIndex((prevCharIndex) => prevCharIndex - 1);
      setCPM(calculateCPM(charIndex - 1, mistakes, timeLeft));
      setWPM(calculateWPM(charIndex - 1, mistakes, timeLeft));
      setAccuracy(calculateAccuracy(charIndex - 1, mistakes));
    }
  };

  const initTyping = (event) => {
    const characters = document.querySelectorAll(".typing-text span");
    const typedChar = event.target.value;

    if (charIndex < characters.length && timeLeft > 0) {
      const currentChar = characters[charIndex].textContent || "";

      if (!isTyping) {
        setIsTyping(true);
      }

      if (typedChar === currentChar) {
        characters[charIndex].classList.add("correct");
        characters[charIndex].classList.remove("active");
        
        if (charIndex + 1 < characters.length) {
          characters[charIndex + 1].classList.add("active");
        }
        
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
      } else {
        characters[charIndex].classList.add("incorrect");
        characters[charIndex].classList.remove("active");
        
        if (charIndex + 1 < characters.length) {
          characters[charIndex + 1].classList.add("active");
        }
        
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
        setMistakes((prevMistakes) => prevMistakes + 1);
      }

      if (charIndex === characters.length - 1) setIsTyping(false);

      setWPM(calculateWPM(charIndex, mistakes, timeLeft));
      setCPM(calculateCPM(charIndex, mistakes, timeLeft));
      setAccuracy(calculateAccuracy(charIndex, mistakes));

      if (inputRef.current) inputRef.current.value = "";
    } else {
      setIsTyping(false);
    }
  };

  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(maxTime);
    setCharIndex(0);
    setMistakes(0);
    setCPM(0);
    setWPM(0);
    setProgress(100);
    setAccuracy(100);
    loadParagraph();
  };

  useEffect(() => {
    loadParagraph();
  }, []);

  useEffect(() => {
    let interval;
    if (isTyping && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        setProgress(((timeLeft - 1) / maxTime) * 100);
        setCPM(calculateCPM(charIndex, mistakes, timeLeft));
        setWPM(calculateWPM(charIndex, mistakes, timeLeft));
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      setIsTyping(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTyping, timeLeft, charIndex, mistakes]);

  return (
    <div className="typing-container">
      <div className="typing-header">
        <h1>
          <Keyboard /> Speed Typing Test
        </h1>
        <button className="reset-button" onClick={resetGame}>
          <RefreshCw /> Reset
        </button>
      </div>

      <div className="typing-content">
        <div className="time-progress">
          <div className="time-header">
            <span>Time Remaining</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="typing-text">
          {typingText}
        </div>

        <input
          type="text"
          ref={inputRef}
          onChange={initTyping}
          onKeyDown={handleKeyDown}
          className="hidden-input"
          autoFocus
        />

        <div className="stats-grid">
          {[
            { 
              icon: <BarChart2 className="stat-icon" />, 
              label: 'WPM', 
              value: WPM 
            },
            { 
              icon: <Keyboard className="stat-icon" />, 
              label: 'CPM', 
              value: Math.round(CPM) 
            },
            { 
              icon: <AlertCircle className="stat-icon" />, 
              label: 'Mistakes', 
              value: mistakes 
            },
            { 
              icon: <Timer className="stat-icon" />, 
              label: 'Accuracy', 
              value: `${accuracy}%` 
            }
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              {stat.icon}
              <div className="stat-value">{stat.value}</div>
              <div>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="typing-footer">
        <div className={`status-badge ${
          timeLeft === 0 
            ? 'status-complete' 
            : isTyping 
              ? 'status-typing' 
              : ''
        }`}>
          {timeLeft === 0 
            ? 'Test Complete!' 
            : isTyping 
              ? 'Typing...' 
              : 'Start typing to begin'}
        </div>
        <button className="reset-button" onClick={resetGame}>
          <RefreshCw /> Try Again
        </button>
      </div>
    </div>
  );
}