import { useState } from "react";
import Chat from "./components/Chat.jsx";
import Progress from "./components/Progress.jsx";
import Toolkit from "./components/Toolkit.jsx";
import Help from "./components/Help.jsx";

const TABS = [
  { id: "chat", label: "Talk to Sol" },
  { id: "progress", label: "My Progress" },
  { id: "toolkit", label: "Craving Toolkit" },
  { id: "help", label: "Get Help Now" },
];

export default function App() {
  const [tab, setTab] = useState("chat");

  const go = (id) => {
    setTab(id);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-leaf-100 bg-white px-4 pt-3">
        <div className="mx-auto max-w-3xl">
          <div className="text-xl font-bold text-leaf-700">🌱 NewPath</div>
          <nav className="mt-2 flex gap-1 overflow-x-auto" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => go(t.id)}
                className={`whitespace-nowrap border-b-4 px-3.5 py-2.5 text-sm transition ${
                  tab === t.id
                    ? "border-leaf-500 font-semibold text-leaf-700"
                    : "border-transparent text-slate-500 hover:text-leaf-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        {tab === "chat" && <Chat onNavigate={go} />}
        {tab === "progress" && <Progress />}
        {tab === "toolkit" && <Toolkit />}
        {tab === "help" && <Help />}
      </main>
    </div>
  );
}
