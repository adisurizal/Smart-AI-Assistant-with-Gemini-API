import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll ke bawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;

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
          text: "Terjadi kesalahan saat menghubungi AI",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <h2>Smart AI</h2>
          <p>Gemini AI Assistant</p>
        </div>

        <div className="sidebar-footer">
          Powered by @adisurizal
        </div>
      </div>

      {/* Main Chat */}
      <div className="main-chat">
        <div className="chat-header">
          <h1>Smart AI Assistant</h1>
          <p>AI Chatbot with Gemini API</p>
        </div>

        <div className="chat-box">
          {chat.length === 0 && (
            <div className="welcome-message">
              <h2>👋 Halo!</h2>
              <p>
                Saya adalah Smart AI Assistant berbasis Gemini API yang dibuat oleh adisurizal.
              </p>
            </div>
          )}

          {chat.map((item, index) => (
            <div
              key={index}
              className={`message-row ${item.sender}`}
            >
              <div className="avatar">
                {item.sender === "user" ? "🧑" : "🤖"}
              </div>

              <div
                className={`message ${item.sender}`}
              >
                <ReactMarkdown>
                  {item.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="avatar">🤖</div>

              <div className="message bot typing">
                AI sedang mengetik...
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ketik pesan Anda..."
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

        {/* <div className="footer-signature">
          Created by @adisurizal
        </div> */}
      </div>
    </div>
  );
}

export default App;