// In App.jsx
import { useState, useEffect } from 'react';
import { Tutorial } from './components/Tutorial/Tutorial';
import SpeedTyping from './components/speedTyping';
import { Timeprovider } from './context/timeContext';
import './App.css';

function App() {
  const [gamePaused, setGamePaused] = useState(false);

  // First visit check
  useEffect(() => {
    if (!localStorage.getItem('hasPlayedBefore')) {
      setGamePaused(true);
    }
  }, []);

  return (
    <Timeprovider>
      <div className="game-container">
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

        {/* Tutorial Overlay */}
        {gamePaused && (
          <Tutorial 
            onClose={() => {
              setGamePaused(false);
              localStorage.setItem('hasPlayedBefore', 'true');
            }}
          />
        )}
      </div>
    </Timeprovider>
  );
}

export default App;