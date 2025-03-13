import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error,setError]=useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const [messages, setMessages] = useState([]); // Chatbot messages
  const unit = isCelsius ? "°C" : "°F";  
  const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeather = async () => {
    setMessages([]);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      setError(false);
      
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError(true);
      setWeather(null);
    }
  };
  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const handleUserQuestion = (question) => {
    if (!weather) {
      setMessages([
        ...messages,
        { sender: "user", text: question },
        { sender: "bot", text: "❗ Please check the weather first!" },
      ]);
      return;
    }

    let reply = "I don't understand that. Try asking about temperature, rain, or advice!";

    if (question.includes("weather alert")) {
      reply = weather.alerts
        ? "⚠️ There is a weather alert! Stay updated on local advisories."
        : "✅ No weather alerts at the moment.";
    } else if (question.includes("rain")) {
      reply = weather.weather[0].description.includes("rain")
        ? "☔ Yes, it's likely to rain today."
        : "🌞 No rain expected. Enjoy your day!";
    } else if (question.includes("umbrella")) {
      reply = weather.weather[0].description.includes("rain")
        ? "☂️ Yes, take an umbrella!"
        : "🌤️ No need for an umbrella today.";
    } else if (question.includes("cold") || question.includes("hot")) {
      reply =
        weather.main.temp < 15
          ? "❄️ It's cold outside! Wear warm clothes."
          : weather.main.temp > 30
          ? "🔥 It's hot outside! Stay hydrated."
          : "🌤️ The weather is mild and comfortable.";
    } else if (question.includes("safe to drive")) {
      reply = weather.weather[0].description.includes("snow") || weather.weather[0].description.includes("rain")
        ? "🚗 Drive carefully! The roads might be slippery."
        : "✅ The weather conditions are good for driving.";
    } else if (question.includes("snow")) {
      reply = weather.weather[0].description.includes("snow")
        ? "❄️ Yes, it will snow today!"
        : "🌤️ No snow expected today.";
    } else if (question.includes("wind speed")) {
      reply = `💨 The wind speed is ${weather.wind.speed} m/s.`;
    } else if (question.includes("wear today")) {
      reply =
        weather.main.temp < 10
          ? "🧥 Wear a warm coat, it's cold outside!"
          : weather.main.temp > 25
          ? "🩳 Light clothing is best, it's warm!"
          : "👕 A comfortable outfit should be fine.";
    }

    setMessages([...messages, { sender: "user", text: question }, { sender: "bot", text: reply }]);
  };

  const predefinedQuestions = [
  "Is there a weather alert?",
  "Is it going to rain?",
  "Should I carry an umbrella?",
  "Is it cold or hot outside?",
  "Is it safe to drive?",
  "Will it snow today?",
  "What is the wind speed?",
  "What should I wear today?",
];
  
  return (
    <>
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Weather App</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        className="weather-input"
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && city.trim() !== "") {
            fetchWeather(); // Fetch weather only when Enter is pressed
          }
        }}
      />
      <button className="weather-button" onClick={fetchWeather}>Get Weather</button>
      {error &&(
        <div className="error">
          Oops,City Not Found
        </div>
      )}

      {weather && (
        <div className="weather-details">
          <h3>{weather.name}, {weather.sys.country}</h3>
          <button onClick={toggleTemperature} className="glass-toggle">
  Switch to {isCelsius ? "°F" : "°C"}
</button>

<p className="temperature-text">
  {isCelsius ? weather.main.temp : (weather.main.temp * 9/5) + 32} {unit}
</p>




          <p>Humidity: {weather.main.humidity}%</p>
          <p>Condition: {weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="weather-icon"
          />
        </div>
      )}
     {/* AI Chatbot */}
     <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {/* Predefined Questions */}
        <div className="predefined-questions">
          {predefinedQuestions.map((q, index) => (
            <button key={index} className="question-btn" onClick={() => handleUserQuestion(q)}>
              {q}
            </button>
          ))}
        </div>

        {/* <input
          type="text"
          placeholder="Ask me about the weather..."
          className="chat-input"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              handleUserQuestion(e.target.value.trim());
              e.target.value = ""; // Clear input after asking
            }
          }}
        /> */}
      </div>
    </div>
    </>
  );
};

export default Weather;
