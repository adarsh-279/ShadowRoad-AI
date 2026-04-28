import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// ✅ ENV for deployment
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const DriveLegal = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Namaste! I'm your DriveLegal AI assistant. Ask me anything about Indian road laws, challans, or your rights as a driver.",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const certScoreRef = useRef(null);
  const [score, setScore] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ✅ Score Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const target = 782;
            const duration = 1500;
            const startTime = performance.now();

            const update = (now) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setScore(Math.round(start + (target - start) * ease));
              if (progress < 1) requestAnimationFrame(update);
            };

            requestAnimationFrame(update);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    if (certScoreRef.current) observer.observe(certScoreRef.current);
    return () => observer.disconnect();
  }, []);

  // ✅ Chat Send Function (FIXED API + ERROR HANDLING)
  const handleSend = async (text) => {
  if (!text.trim()) return;

  setMessages((prev) => [...prev, { type: "user", text }]);
  setInputValue("");
  setIsTyping(true);

  try {
    const res = await axios.post(`${API}/api/chatbot`, {
      message: text,
    });

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: res.data?.text || "⚖️ No response from AI",
      },
    ]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text:
          err.response?.data?.message ||
          "⚠️ Server not reachable. Please try again.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  const quickQuestions = [
    {
      label: "No license fine?",
      q: "What is the fine for driving without license?",
    },
    {
      label: "Fight challan?",
      q: "Can I fight a wrong challan?",
    },
    {
      label: "School zone speed?",
      q: "What is the speed limit in school zones?",
    },
    {
      label: "Helmet law?",
      q: "Do I need a helmet on a bike in India?",
    },
  ];

  return (
    <section className="section" id="drivelegal">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">AI Legal Assistant for Drivers</h2>
          <p className="section-desc">
            Know your rights. Earn your score. Fight unfair challans. All in one
            app.
          </p>
        </div>

        <div className="legal-grid">
          <div className="legal-card" style={{ opacity: 1 }}>
            <div className="legal-card-header">
              <div className="legal-icon">⚖️</div>
              <h3>Virtual Legal Assistant</h3>
            </div>

            <ul className="legal-features">
              <li>✅ Ask — "Can I get a challan here?"</li>
              <li>✅ Know about your violations</li>
              <li>✅ Knows every road rule by heart</li>
              <li>✅ Highly effective chatbot</li>
            </ul>

            <button className="legal-try-btn" onClick={() => setChatOpen(true)}>
              💬 Ask AI Legal Assistant
            </button>
          </div>

          <div className="legal-card" style={{ opacity: 1 }}>
            <div className="legal-card-header">
              <div className="legal-icon">🏆</div>
              <h3>Legal Driving Certification</h3>
            </div>

            <ul className="legal-features">
              <li>🎓 Earn points for safe driving</li>
              <li>📉 Lose points for violations</li>
              <li>🏅 Works like a credit score</li>
              <li>💰 Insurance discounts</li>
            </ul>

            <div className="cert-score-preview" ref={certScoreRef}>
              <div className="cert-score-label">Your Score</div>
              <div className="cert-score">{score}</div>
              <div className="cert-tier gold-tier">🥇 GOLD Driver</div>
            </div>
          </div>
        </div>

        {/* ✅ CHAT MODAL */}
        {chatOpen && (
          <div
            className="modal-overlay active"
            onClick={(e) => {
              if (e.target.className === "modal-overlay active")
                setChatOpen(false);
            }}
          >
            <div className="modal-box">
              <div className="modal-header">
                <div className="modal-title">⚖️ AI Legal Assistant</div>
                <button
                  className="modal-close"
                  onClick={() => setChatOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`chat-msg ${
                      msg.type === "bot" ? "bot-msg" : "user-msg"
                    }`}
                  >
                    <div className="chat-avatar">
                      {msg.type === "bot" ? "⚖️" : "👤"}
                    </div>
                    <div className="chat-bubble">{msg.text}</div>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-msg bot-msg">
                    <div className="chat-avatar">⚖️</div>
                    <div className="chat-bubble">⏳ Checking road laws…</div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="chat-quick-btns">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="quick-btn"
                    onClick={() => handleSend(q.q)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              <div className="chat-input-row">
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Ask about any road law…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                />

                <button
                  className="chat-send"
                  onClick={() => handleSend(inputValue)}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DriveLegal;
