import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Simpan pesan user
    const userMessage = {
      sender: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/chat",
        {
          message: currentMessage,
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Terjadi error saat menghubungi AI",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h1>Smart AI Assistant</h1>

        <div className="chat-box">
          {chat.map((item, index) => (
            <div
              key={index}
              className={
                item.sender === "user"
                  ? "message user"
                  : "message bot"
              }
            >
              {item.text}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              AI sedang mengetik...
            </div>
          )}
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Tulis pesan..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;