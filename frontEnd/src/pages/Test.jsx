import React, { useState } from 'react';
import '../style.css';
function Test() {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="container">
        <button className="settings-btn" onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>Settings</button>
        {showMenu && (
          <div className="menu">
            <button className="sub-btn">Option 1</button>
            <button className="sub-btn">Option 2</button>
          </div>
        )}
      </div>
    );
}

export default Test