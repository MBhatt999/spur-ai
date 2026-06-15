import { useEffect, useRef, useState } from "react";
import "./App.css";

type Message = {
  sender: "USER" | "AI";
  text: string;
};

function App() {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] =
    useState("");

  const [messages, setMessages] = useState<
    Message[]
  >([]);

  const [chatTitle, setChatTitle] =
    useState("New Chat");
  
  const [conversations, setConversations] =
  useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  const chatEndRef =
    useRef<HTMLDivElement>(null);

  //useEffect(() => {
   // chatEndRef.current?.scrollIntoView({
   //   behavior: "smooth",
    //});
  //}, [messages]);

  const loadConversations = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/chat/conversations"
    );

    const conversations =
      await response.json();

    const conversationsWithTitles =
      await Promise.all(
        conversations.map(
          async (conversation: any) => {
            try {
              const historyResponse =
                await fetch(
                  `http://localhost:5000/chat/history/${conversation.id}`
                );

              const history =
                await historyResponse.json();

              const firstUserMessage =
                history.find(
                  (msg: any) =>
                    msg.sender === "USER"
                );

              return {
                id: conversation.id,
                title:
                  firstUserMessage?.text ||
                  "Untitled Chat",
              };
            } catch {
              return {
                id: conversation.id,
                title: "Untitled Chat",
              };
            }
          }
        )
      );

    setConversations(
      conversationsWithTitles
    );
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
  loadConversations();
}, []);

const startNewChat = () => {
  setMessages([]);
  setConversationId("");
  setChatTitle("New Chat");
};

const openConversation = async (
  id: string
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/chat/history/${id}`
    );

    const history =
  await response.json();

console.log(
  "History loaded:",
  history
);

setConversationId(id);

   setMessages(
  history.map((msg: any) => ({
    sender: msg.sender,
    text: msg.text,
  }))
);
  } catch (error) {
    console.error(error);
  }
};

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    if (
      chatTitle === "New Chat"
    ) {
      setChatTitle(message);
    }

    const userMessage = {
      sender: "USER" as const,
      text: message,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentMessage = message;

    setMessage("");
    setLoading(true);

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
            message: currentMessage,
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

await loadConversations();

setMessages((prev) => [
  ...prev,
  {
    sender: "AI",
    text: data.reply,
  },
]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text:
            "⚠️ Unable to connect to server.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>🤖 Spur AI</h2>

        <button
          className="new-chat-btn"
          onClick={startNewChat}
        >
          + New Chat
        </button>

        <div className="conversation-info">
  <p>Previous Chats</p>

  {conversations.map((chat) => (
    <div
  key={chat.id}
  className="chat-item"
  onClick={() =>
    openConversation(chat.id)
  }
>
      {chat.title.length > 25
          ? chat.title.slice(0, 25) + "..."
          : chat.title}
    </div>
  ))}
</div>
      </aside>

      <main className="chat-area">
        <div className="chat-header">
          <div>
            <h2>Spur AI Assistant</h2>
            <p>
              Customer Support Copilot
            </p>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <h2>
                Welcome to Spur AI
              </h2>

              <p>
                Ask me anything about:
              </p>

              <ul>
                <li>📦 Shipping</li>
                <li>↩️ Returns</li>
                <li>🕒 Support Hours</li>
              </ul>
            </div>
          )}

          {messages.map(
            (msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.sender === "USER"
                    ? "user-message"
                    : "ai-message"
                }`}
              >
                {msg.text}
              </div>
            )
          )}

          {loading && (
            <div className="message ai-message typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="input-section">
          <input
            type="text"
            placeholder="Message Spur AI..."
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            disabled={loading}
            onClick={sendMessage}
          >
            {loading
              ? "..."
              : "Send"}
          </button>
        </div>
      </main>
    </div>
  );
}


export default App;