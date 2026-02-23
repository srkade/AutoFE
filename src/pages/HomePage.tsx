import React from "react";
import "../Styles/WelcomePage.css";

export default function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <div className="welcome-wrapper">
      <div className="welcome-inner">
        <div className="welcome-text">
          <h1>Welcome to <span>Schematic Designer</span></h1>
          <p>
            Create, visualize, and simulate electrical schematics with precision.
            Our intelligent platform helps engineers and designers bring ideas
            to life through interactive circuit design and smart connectivity.
          </p>

          <div className="features">
            <div>⚙️ Smart component placement</div>
            <div>🔌 Auto wire alignment & snapping</div>
            <div>📈 High-quality export support</div>
            <div>🤝 Team collaboration tools</div>
          </div>

          <button className="start-btn" onClick={onStart}>
            Start Designing →
          </button>
        </div>

        <div className="welcome-image">
          <img
            src="/images/HomePage.png"
            className="home-image"
            alt="Circuit Illustration"
          />
        </div>
      </div>

      <footer>
        <p>© 2025 Schematic Designer | Designed for innovation & precision ⚡</p>
      </footer>
    </div>
  );
}
