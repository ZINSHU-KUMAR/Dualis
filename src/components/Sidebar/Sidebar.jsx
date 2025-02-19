import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
  const [extended, setExtended] = useState(false); // For expanding/collapsing sidebar
  const { onSent, prevPrompts, setRecentPrompt, newChat, setPrevPrompts } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);  // Set the recent prompt in context
    await onSent(prompt);      // Send the prompt to Gemini API
  };

  // Remove a prompt from the history
  const handleDelete = (index) => {
    const updatedPrompts = prevPrompts.filter((_, i) => i !== index); // Remove prompt at index
    setPrevPrompts(updatedPrompts); // Update the prompt history
  };

  // Handle clicks on "Help"
  const handleHelpClick = () => {
    alert("Help section: Here you can find tips and instructions on using the chatbot.");
    // You can replace this with opening a modal or navigating to a help page
  };

  // Handle clicks on "Activity"
  const handleActivityClick = () => {
    alert("Activity section: Shows your recent chat history and interactions.");
    // You can replace this with a list of user activities or navigate to an activity page
  };

  // Handle clicks on "Settings"
  const handleSettingsClick = () => {
    alert("Settings section: Here you can modify preferences and settings.");
    // You can replace this with navigating to a settings page or showing a settings modal
  };

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)} // Toggle expand/collapse
          className="menu"
          src={assets.menu_icon}
          alt="Menu"
        />
        <div
          onClick={() => {
            newChat();  // Trigger new chat
          }}
          className="new-chat"
        >
          <img src={assets.plus_icon} alt="New Chat" />
          {extended && <p>New Chat</p>}  {/* Show New Chat text when expanded */}
        </div>
        
        {extended && (  // Show Recent prompts when sidebar is expanded
          <div className="recent">
            <p className="recent-title">Recent</p>
            {prevPrompts.map((item, index) => {
              return (
                <div
                  key={index}
                  className="recent-entry"
                >
                  <div onClick={() => loadPrompt(item)} className="recent-item">
                    {/* <img src={assets.message_icon} alt="Message Icon" /> */}
                    <p>{item.slice(0, 20)}...</p> {/* Display only first 20 characters of the prompt */}
                  </div>
                  {/* Delete button next to each prompt */}
                  <button 
                    onClick={() => handleDelete(index)} 
                    className="delete-btn"
                    aria-label="Delete chat history"
                  >
                    <img src={assets.message_icon} alt="Message Icon" />
                    </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="bottom">
        {/* Help Item */}
        <div className="bottom-item recent-entry" onClick={handleHelpClick}>
          {/* <img src={assets.question_icon} alt="Help Icon" /> */}
          {extended && <p>Help</p>}
        </div>
        
        {/* Activity Item */}
        <div className="bottom-item recent-entry" onClick={handleActivityClick}>
          {/* <img src={assets.history_icon} alt="Activity Icon" /> */}
          {extended && <p>Activity</p>}
        </div>
        
        {/* Settings Item */}
        <div className="bottom-item recent-entry" onClick={handleSettingsClick}>
          {/* <img src={assets.setting_icon} alt="Settings Icon" /> */}
          {extended && <p>Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
