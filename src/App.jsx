// Updated App.jsx
import { useState, useEffect } from 'react';
import { Tutorial } from './components/Tutorial/Tutorial';
import SpeedTyping from './components/speedTyping';
import { Timeprovider } from './context/timeContext';
import './App.css';

function App() {
  const [gamePaused, setGamePaused] = useState(false);
  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // First visit check
  useEffect(() => {
    if (!localStorage.getItem('hasPlayedBefore')) {
      setGamePaused(true);
    }
  }, []);

  // Keyboard pause handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && localStorage.getItem('hasPlayedBefore')) {
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const togglePause = () => {
    setGamePaused(prev => !prev);
    setShowPauseMenu(prev => !prev);
  };

  return (
    <Timeprovider>
      <div className="game-container">
        {/* Pause Control Button */}
        <button 
          className="pause-button"
          onClick={togglePause}
          aria-label={gamePaused ? "Resume game" : "Pause game"}
        >
          {gamePaused ? '▶' : '⏸'}
        </button>

        {/* Help Button */}
        <button 
  className="help-button"
  onClick={() => setGamePaused(true)}
  aria-label="Open tutorial"
>
  <span role="img" aria-hidden="true">📖</span> Help
</button>
        {/* Main Game */}
        <SpeedTyping paused={gamePaused} />

        {/* Tutorial/Pause Overlay */}
        {gamePaused && (
          <Tutorial 
            isPauseMenu={showPauseMenu}
            onClose={() => {
              setGamePaused(false);
              setShowPauseMenu(false);
              if(!showPauseMenu) localStorage.setItem('hasPlayedBefore', 'true');
            }}
            onRestart={() => window.location.reload()}
          />
        )}
      </div>
    </Timeprovider>
  );
}

export default App;