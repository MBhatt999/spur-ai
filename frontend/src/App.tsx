import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] =
    useState<string>("");

  const [messages, setMessages] = useState<
    { sender: string; text: string }[]
  >([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "USER",
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {
      const response = await fetch(
        "http://localhost:5000/chat/message",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message,
            conversationId:
              conversationId || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!conversationId) {
        setConversationId(
          data.conversationId
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text: "Failed to connect to server.",
        },
      ]);
    }

    setMessage("");
  };

  return (
    <div className="chat-container">
      <h1>Spur AI Chatbot</h1>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === "USER"
                ? "user"
                : "ai"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;