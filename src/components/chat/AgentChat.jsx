import { useState, useRef, useEffect, useCallback } from "react";
import { sendChat, getTTS } from "../../utils/api";

// ── Animated typing text for agent responses ──────────────────────────────────
function AnimatedText({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;
    // const speed = Math.max(12, Math.min(30, 2000 / text.length));
    const speed = 50;

    const timer = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) {
        clearInterval(timer);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="typing-cursor" />}
    </span>
  );
}

// ── Sound wave animation (when speaking) ──────────────────────────────────────
function SoundWave({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, height: 18 }}>
      {[0, 0.1, 0.2, 0.05, 0.15, 0.25, 0.05].map((delay, i) => (
        <div
          key={i}
          style={{
            width: 2,
            borderRadius: 1,
            background: "var(--accent-cyan)",
            height: active ? `${8 + (i % 3) * 4}px` : "4px",
            animation: active
              ? `wave ${0.6 + i * 0.1}s ${delay}s ease-in-out infinite alternate`
              : "none",
            transition: "height 0.3s",
          }}
        />
      ))}
    </div>
  );
}

// ── Voice recorder hook using Web Speech API (free, browser-native) ───────────
function useVoiceRecording(onTranscript) {
  // const [isListening, setIsListening] = useState(false);
  // const [supported, setSupported] = useState(false);
  // const recognitionRef = useRef(null);

  // useEffect(() => {
  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   if (SpeechRecognition) {
  //     setSupported(true);
  //     const rec = new SpeechRecognition();
  //     rec.continuous = false;
  //     rec.interimResults = false;
  //     rec.lang = 'en-US';
  //     rec.onresult = (e) => {
  //       const transcript = e.results[0][0].transcript;
  //       onTranscript(transcript);
  //     };
  //     rec.onend = () => setIsListening(false);
  //     rec.onerror = () => setIsListening(false);
  //     recognitionRef.current = rec;
  //   }
  // }, [onTranscript]);

  // const startListening = useCallback(() => {
  //   if (recognitionRef.current && !isListening) {
  //     recognitionRef.current.start();
  //     setIsListening(true);
  //   }
  // }, [isListening]);

  // const stopListening = useCallback(() => {
  //   if (recognitionRef.current && isListening) {
  //     recognitionRef.current.stop();
  //   }
  // }, [isListening]);

  // return { isListening, supported, startListening, stopListening };
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const onTranscriptRef = useRef(onTranscript);

  // Keep the ref current without re-creating the recognition object
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setSupported(true);
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      const transcript = Array.from(e.results)
        .filter((r) => r.isFinal)
        .map((r) => r[0].transcript)
        .join(" ")
        .trim();
      if (transcript) onTranscriptRef.current(transcript);
    };

    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;

    // Cleanup on unmount only
    return () => {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      try {
        rec.stop();
      } catch {}
    };
  }, []); // empty deps — only runs once

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, supported, startListening, stopListening };
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isLatestAgent }) {
  const isAgent = msg.role === "agent";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isAgent ? "flex-start" : "flex-end",
        marginBottom: 16,
        animation: "fadeUp 0.3s ease",
      }}
    >
      {isAgent && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background:
              "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            marginRight: 10,
            alignSelf: "flex-end",
            marginBottom: 2,
          }}
        >
          🤖
        </div>
      )}
      <div
        style={{
          maxWidth: "72%",
          padding: "12px 16px",
          borderRadius: isAgent ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
          background: isAgent
            ? "var(--bg-card)"
            : "linear-gradient(135deg, var(--accent-violet), var(--accent-violet-light))",
          border: isAgent ? "1px solid var(--border)" : "none",
          color: isAgent ? "var(--text-primary)" : "white",
          fontSize: 14,
          lineHeight: 1.7,
          boxShadow: isAgent ? "none" : "0 4px 16px rgba(124,58,237,0.3)",
        }}
      >
        {isAgent && isLatestAgent && msg.isNew ? (
          <AnimatedText text={msg.content} />
        ) : (
          msg.content
        )}
        {msg.isVoice && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 10,
              opacity: 0.6,
              fontFamily: "var(--font-mono)",
              verticalAlign: "middle",
            }}
          >
            🎙️
          </span>
        )}
      </div>
      {!isAgent && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            flexShrink: 0,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            marginLeft: 10,
            alignSelf: "flex-end",
            marginBottom: 2,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}

// ── Thinking indicator ────────────────────────────────────────────────────────
function ThinkingBubble() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        🤖
      </div>
      <div
        style={{
          padding: "12px 18px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "18px 18px 18px 4px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {[0, 0.15, 0.3].map((d) => (
          <div
            key={d}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-cyan)",
              opacity: 0.6,
              animation: `wave 0.8s ${d}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── MAIN AGENT CHAT COMPONENT ─────────────────────────────────────────────────
export default function AgentChat() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "agent",
      isNew: true,
      content:
        "Hey there! 👋 I'm Khizar's AI assistant. Ask me anything about his experience, projects, skills, or career — or try asking via voice using the mic button. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleTranscript = useCallback((transcript) => {
    if (!transcript.trim()) return;
    submitMessage(transcript, true);
  }, []);

  const { isListening, supported, startListening, stopListening } =
    useVoiceRecording(handleTranscript);

  const playTTS = async (text) => {
    if (!ttsEnabled) return;
    setSpeaking(true);
    try {
      const audioUrl = await getTTS(text);
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audio.playbackRate = 1.4;
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  const submitMessage = async (text, isVoice = false) => {
    if (!text.trim() || loading) return;
    const userMsg = {
      id: Date.now() + "u",
      role: "user",
      content: text.trim(),
      isVoice,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChat(text.trim());
      const answer = res.data.answer;
      const agentMsg = {
        id: Date.now() + "a",
        role: "agent",
        content: answer,
        isNew: true,
      };
      // setMessages((prev) => [...prev, agentMsg]);
      // Speak response
      await playTTS(answer);
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      const errMsg = {
        id: Date.now() + "e",
        role: "agent",
        content:
          "Sorry, I couldn't connect to the server right now. Make sure the backend is running!",
        isNew: true,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage(input);
    }
  };

  const suggestions = [
    "What projects has Khizar built?",
    "Tell me about his WebRTC work",
    "What's his tech stack?",
    "Where has he worked?",
  ];

  return (
    <section id="chat" className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <div className="section-eyebrow">AI Agent</div>
          <h2 className="section-title">Ask About Khizar</h2>
          <p className="section-subtitle">
            Chat with an AI agent trained on Khizar's profile. Ask anything —
            via text or voice.
          </p>
        </div>

        <div
          className="card"
          style={{
            maxWidth: 860,
            margin: "0 auto",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: 580,
            background: "var(--bg-card)",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: speaking ? "var(--accent-cyan)" : "#22c55e",
                    border: "2px solid var(--bg-card)",
                    boxShadow: `0 0 6px ${speaking ? "var(--accent-cyan)" : "#22c55e"}`,
                  }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  Khizar's Agent
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {speaking ? (
                    <>
                      <SoundWave active={true} /> Speaking...
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#22c55e" }}>●</span> Online
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* TTS toggle */}
            <button
              onClick={() => {
                setTtsEnabled((v) => !v);
                if (audioRef.current) audioRef.current.pause();
                setSpeaking(false);
              }}
              style={{
                background: ttsEnabled
                  ? "var(--accent-cyan-dim)"
                  : "var(--bg-secondary)",
                border: `1px solid ${ttsEnabled ? "var(--border-accent)" : "var(--border)"}`,
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                color: ttsEnabled ? "var(--accent-cyan)" : "var(--text-muted)",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {ttsEnabled ? "🔊" : "🔇"} {ttsEnabled ? "Voice On" : "Voice Off"}
            </button>
          </div>

          {/* Messages */}
          <div
            className="chat-scroll"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((msg, i) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isLatestAgent={
                  msg.role === "agent" && i === messages.length - 1
                }
              />
            ))}
            {loading && <ThinkingBubble />}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestion chips */}
          {messages.length <= 1 && (
            <div
              style={{
                padding: "0 20px 12px",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submitMessage(s)}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-accent)";
                    e.currentTarget.style.color = "var(--accent-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg-secondary)",
            }}
          >
            {isListening && (
              <div
                style={{
                  textAlign: "center",
                  padding: "8px 0",
                  marginBottom: 10,
                  color: "var(--accent-cyan)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <SoundWave active={true} />
                Listening... speak now
              </div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about experience, projects, skills..."
                className="input"
                rows={1}
                style={{
                  flex: 1,
                  minHeight: 42,
                  maxHeight: 120,
                  resize: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  padding: "10px 14px",
                }}
              />

              {/* Voice button */}
              {supported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={loading}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background: isListening
                      ? "var(--accent-cyan)"
                      : "var(--bg-card)",
                    color: isListening
                      ? "var(--bg-primary)"
                      : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    transition: "all 0.2s",
                    flexShrink: 0,
                    border: `1px solid ${isListening ? "var(--accent-cyan)" : "var(--border)"}`,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isListening && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: "2px solid var(--accent-cyan)",
                        animation: "pulse-ring 1s ease-out infinite",
                      }}
                    />
                  )}
                  🎙️
                </button>
              )}

              {/* Send button */}
              <button
                onClick={() => submitMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  background:
                    input.trim() && !loading
                      ? "linear-gradient(135deg, var(--accent-violet), var(--accent-violet-light))"
                      : "var(--bg-card)",
                  color:
                    input.trim() && !loading ? "white" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  transition: "all 0.2s",
                  flexShrink: 0,
                  border: "1px solid var(--border)",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid var(--text-muted)",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                ) : (
                  "→"
                )}
              </button>
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Press Enter to send · {supported ? "🎙️ Click mic to speak" : ""}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
