// components/Tutorial/Tutorial.jsx
import './Tutorial.css';

export const Tutorial = ({ onClose }) => {
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <h2>Welcome to Zombie Type! 🧟</h2>
        <div className="tutorial-content">
          <p>1. Type the word above a zombie to attack it</p>
          <p>2. Complete words quickly for bonus points! ⚡</p>
          <p>3. Avoid letting zombies reach the red line ❌</p>
        </div>
        <button 
          className="tutorial-button"
          onClick={onClose}
        >
          Start Slaying!
        </button>
      </div>
    </div>
  );
};