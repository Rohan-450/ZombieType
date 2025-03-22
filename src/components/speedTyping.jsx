import React, { useState, useEffect, useRef, useContext } from "react";
import "./speedTyping.css";
import TypingArea from "./typingArea.jsx";
import Popup from "./popup.jsx";
import { ContextProvider } from "./context.jsx";
const SpeedTypingGame = () => {
  const { time, isOpen, timeLeft, setTimeLeft } = useContext(ContextProvider); // getting the state of time and popup open from CONTEXT API
  console.log(time);
  const paragraphs = [
    "A plant is one of the most important living things that develop on the Earth and is made up of stems, leaves, roots, and so on. The part of the plant that develops beneath the soil is referred to as the root, while the part that grows outside the soil is known as the shoot. The shoot consists of stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts: roots, stems, leaves, flowers, fruits, and seeds.",
    "The root is the part of the plant that grows in the soil. The primary root emerges from the embryo, and its main function is to provide stability to the plant and absorb mineral salts from the soil for various metabolic processes. There are three types of roots: Tap Root, Adventitious Root, and Lateral Root. The roots arise from different parts of the plant and not from the rhizomes.",
    "The stem is the upper part of the plant that remains above the ground and grows in a direction opposite to gravity (negatively geotropic). It consists of nodes and internodes. Various structures such as branches, buds, leaves, petioles, flowers, and inflorescences develop at the nodes and remain above the ground. Trees typically have brown bark, while young and newly developed stems are green. The roots arise from different parts of the plant and not from rhizomes.",
    "A flower is the blossom of a plant and plays a crucial role in reproduction by producing seeds, which eventually grow into new plants. It serves as the reproductive system of a plant. Most flowers consist of four main parts: sepals, petals, stamens, and carpels. The carpel is the female part of the flower. The majority of flowers are hermaphrodites, meaning they contain both male and female reproductive structures. However, some flowers may have only one reproductive part and can be either male or female.",
    "An aunt is a bassoon from the right perspective. As far as we can estimate, some posit the melic Myanmar to be less than kutcha. One cannot separate foods from blowzy bows. The scampish closet reveals itself as a sclerous llama to those who look. A hip is the skirt of a peak. Some hempy laundries are thought of simply as orchids. A gum is a trumpet from the right perspective. A freebie flight is a wrench of the mind. Some posit the croupy.",
  ];
  //setting the time;
  const [typingText, setTypingText] = useState("");
  const [inpFieldValue, setInpFieldValue] = useState("");

  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [WPM, setWPM] = useState(0);
  const [CPM, setCPM] = useState(0);
  const inputRef = useRef(null);

  const calculateWPM = (charIndex, mistakes, timeLeft) => {
    let wpm = Math.round(((charIndex - mistakes) / 5 / (time - timeLeft)) * 60);
    return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
  };

  const calculateCPM = (charIndex, mistakes, timeLeft) => {
    let cpm = (charIndex - mistakes) * (60 / (time - timeLeft));
    return cpm < 0 || !cpm || cpm === Infinity ? 0 : cpm;
  };

  const loadParagraph = () => {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    const content = Array.from(paragraphs[ranIndex]).map((letter, index) => (
      <span
        key={index}
        style={{ color: letter !== " " ? "black" : "transparent" }}
        className={`char ${index === 0 ? "active" : ""}`}
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

  const handleKeyDown = (event) => {
    const characters = document.querySelectorAll(".char");
    if (
      event.key === "Backspace" &&
      charIndex > 0 &&
      charIndex < characters.length &&
      timeLeft > 0
    ) {
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

  const initTyping = (event) => {
    const characters = document.querySelectorAll(".char");
    let typedChar = event.target.value;
    if (charIndex < characters.length && timeLeft > 0) {
      let currentChar = characters[charIndex].innerText;
      if (currentChar === "_") currentChar = " ";
      if (!isTyping) {
        setIsTyping(true);
      }
      if (typedChar === currentChar) {
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.remove("active");
        characters[charIndex].classList.add("correct");
      } else {
        setCharIndex((prevCharIndex) => prevCharIndex + 1);
        setMistakes((prevMistakes) => prevMistakes + 1);
        characters[charIndex].classList.remove("active");
        if (charIndex + 1 < characters.length)
          characters[charIndex + 1].classList.add("active");
        characters[charIndex].classList.add("wrong");
      }

      if (charIndex === characters.length - 1) setIsTyping(false);

      setWPM(calculateWPM(charIndex, mistakes, timeLeft));
      setCPM(calculateCPM(charIndex, mistakes, timeLeft));
    } else {
      setIsTyping(false);
    }
  };

  const resetGame = () => {
    setIsTyping(false);
    setTimeLeft(time);
    setCharIndex(0);
    setMistakes(0);
    setTypingText("");
    setCPM(0);
    setWPM(0);
    const characters = document.querySelectorAll(".char");
    characters.forEach((span) => {
      span.classList.remove("correct");
      span.classList.remove("wrong");
      span.classList.remove("active");
    });
    characters[0].classList.add("active");
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
  }, [isTyping, timeLeft]);

  return (
    <div className="container">
      <input
        type="text"
        className="input-field"
        value={inpFieldValue}
        onChange={initTyping}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {/* Render the TypingArea child component */}
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
      {isOpen === true ? <Popup inputRef={inputRef}/> : <></>}
    </div>
  );
};

export default SpeedTypingGame;
