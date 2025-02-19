import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../../assets/assets';
import { Context } from '../../../context/Context';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  
  // State for handling speech recognition and profile image
  const [isListening, setIsListening] = useState(false);
  const [profileImage, setProfileImage] = useState(null);  // To store the profile image URL

  // Function for handling microphone button click (Speech-to-Text)
  const handleMicClick = () => {
    if (isListening) {
      // Stop listening and send the recognized speech
      setIsListening(false);
      recognition.stop();
    } else {
      // Start listening
      setIsListening(true);
      recognition.start();
    }
  };

  // Speech Recognition Setup
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.continuous = false;

  recognition.onstart = () => {
    console.log('Voice recognition started');
  };

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    setInput(speechToText);  // Update input box with recognized text
  };

  recognition.onend = () => {
    console.log('Voice recognition ended');
    if (input) {
      onSent(input);  // Send the recognized text as a prompt
    }
  };

  // Function to handle card click and send specific prompts
  const handleCardClick = (prompt) => {
    setInput(prompt);  // Set the card text as the input
    onSent(prompt);     // Send the prompt to Gemini API
  };

  // Handle Enter key press to send the message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input) {
      onSent();  // Send the input when Enter is pressed
    }
  };

  // Function to handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];  // Get the file from the input
    if (file) {
      const imageUrl = URL.createObjectURL(file);  // Create an object URL for the selected image
      setProfileImage(imageUrl);  // Update the state with the new image URL
    }
  };

  return (
    <div className="main">
      <div className="nav">
      <p
    style={{
        fontSize: '50px', 
        fontWeight: '600', 
        background: 'linear-gradient(90deg, #9B59B6, #FF3385, #FF00FF)', // Vibrant gradient
        backgroundClip: 'text', 
        WebkitBackgroundClip: 'text', 
        textAlign: 'center', // Centers text horizontally
        textShadow: '0 0 15px rgba(155, 89, 182, 0.7), 0 0 30px rgba(255, 51, 133, 0.7), 0 0 50px rgba(255, 0, 255, 0.7), 0 0 100px rgba(0, 255, 255, 0.6)', // Added extra glow
        display: 'block',  // Ensures the paragraph is treated as a block element
        margin: '0 auto', // Centers the element horizontally
        position: 'relative', // Essential for positioning the animation
        animation: 'pulse 2s ease-in-out infinite alternate, gradientShift 5s ease-in-out infinite, hoverEffect 2s ease-in-out infinite, floatEffect 3s ease-in-out infinite', // More animations with smooth transitions
        transformOrigin: 'center', // Ensures the scaling and rotating is centered
    }}
>
    Dualis
</p>





        
        {/* Profile Picture with click event to change it */}
        <div className="profile-container">
  <img
    src={profileImage || assets.user_icon}  // Show custom image or default
    alt="Profile"
    className="profile-picture"
    onClick={() => document.getElementById('profile-picture-input').click()}
    // Trigger file input on click
  />
  {/* Hidden file input for selecting profile picture */}
  <input
    id="profile-picture-input"
    type="file"
    accept="image/*"
    style={{ display: 'none' }}  // Hide the input element
    onChange={handleProfilePictureChange}  // Handle file change
  />
</div>

      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div 
    className="greet" 
    style={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center', 
        margin: '40px 0', 
        fontSize: '60px', 
        color: '#fff', 
        fontWeight: '600', 
        padding: '20px'
    }}
>
    <p style={{ margin: '5px 0', fontSize: 'inherit' }}>
        <span style={{ background: 'linear-gradient(90deg, #F9D423, #FF4E50)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hello, Buddies.
        </span>
    </p>
    <p style={{ margin: '5px 0', fontSize: 'inherit' }}>How can I help you today?</p>
</div>

            <div className="cards">
              {/* Card for "Most beautiful place in the world" */}
              <div className="card" onClick={() => handleCardClick('What is the most beautiful place in the world?')}>
                <p>Most beautiful place in the world.</p>
                <img src={assets.compass_icon} alt="Compass Icon" />
              </div>

              {/* Card for "Are you replacing the software engineers?" */}
              <div className="card" onClick={() => handleCardClick('Are you replacing software engineers?')}>
                <p>Are you replacing the software engineers?</p>
                <img src={assets.bulb_icon} alt="Bulb Icon" />
              </div>

              {/* Card for "How can I improve my communication?" */}
              <div className="card" onClick={() => handleCardClick('How can I improve my communication?')}>
                <p>How can I improve my communication?</p>
                <img src={assets.message_icon} alt="Message Icon" />
              </div>

              {/* Card for "Suggest the best programming language" */}
              <div className="card" onClick={() => handleCardClick('Suggest the best programming language.')}>
                <p>Suggest the best programming language.</p>
                <img src={assets.code_icon} alt="Code Icon" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              {/* Profile Picture in the result section */}
              <img 
                src={profileImage || assets.user_icon}  // Show custom image or default
                alt="Profile" 
                className="result-profile-picture" 
              />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="Gemini Icon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
              onKeyDown={handleKeyPress}  // Add event listener for key press
            />
            <div>
              {/* Microphone Button - Speech-to-Text */}
              <img
                src={assets.mic_icon}
                alt="Microphone"
                onClick={handleMicClick}
                className={isListening ? 'listening' : ''}  // Optional: to add a class if it's listening
              />

              {/* Send Button */}
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="Send Icon" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            Dualis may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
