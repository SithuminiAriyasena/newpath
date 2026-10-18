import { useEffect, useRef, useState } from "react";
import { Button } from "./Card.jsx";

const QUICK = [
  { label: "I'm craving", text: "I'm having a strong craving right now." },
  { label: "I relapsed", text: "I relapsed and I feel terrible." },
  { label: "Where do I start?", text: "I want to quit but I don't know where to start." },
  { label: "I feel low", text: "I'm feeling lonely and stressed." },
];

export default function Chat({ onNavigate }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Sol. I'm here to listen, no judgment. How are you feeling right now?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function send(text) {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      // Skip the local greeting: the API needs the conversation to start with a user turn
      const payload = next.slice(1).map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "Sorry, something went wrong." },
      ]);
      if (data.crisis) setCrisis(true);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I couldn't connect. Please check your connection and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 className="mt-2 text-2xl font-semibold">You took a step by being here.</h1>
      <p className="mb-3 text-slate-500">
        Sol is an AI companion who listens without judgment. It's not a doctor or a replacement for
        professional care.
      </p>

      {crisis && (
        <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-red-800">
          <strong>If you're in danger or thinking of harming yourself,</strong> please call your local
          emergency number or a crisis line now and tell someone near you.{" "}
          <button className="underline" onClick={() => onNavigate("help")}>
            See help options
          </button>
        </div>
      )}

      <div
        className="flex h-[52vh] flex-col gap-2.5 overflow-y-auto rounded-2xl bg-white p-3"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 ${
              m.role === "user"
                ? "self-end rounded-br-sm bg-leaf-500 text-white"
                : "self-start rounded-bl-sm bg-leaf-100"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="self-start rounded-2xl bg-leaf-100 px-3.5 py-2.5 italic text-slate-500">
            Sol is typing…
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="my-3 flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => send(q.text)}
            className="rounded-full bg-leaf-100 px-3 py-1.5 text-sm text-leaf-700 hover:bg-emerald-100"
          >
            {q.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder="Type what's on your mind…"
          autoComplete="off"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-3 outline-none focus:border-leaf-500"
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
      <p className="mt-2 text-xs text-slate-500">
        Chats are not saved on a server by this app. Don't share personal identifying details.
      </p>
    </section>
  );
}
