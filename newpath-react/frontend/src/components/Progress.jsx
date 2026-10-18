import { useState } from "react";
import useLocalStorage from "../useLocalStorage.js";
import Card, { Button } from "./Card.jsx";

const today = () => new Date().toISOString().slice(0, 10);

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return Math.max(0, diff);
}

export default function Progress() {
  const [startDate, setStartDate] = useLocalStorage("np_startDate", "");
  const [checkins, setCheckins] = useLocalStorage("np_checkins", []);
  const [reasons, setReasons] = useLocalStorage("np_reasons", "");
  const [mood, setMood] = useState(3);
  const [crave, setCrave] = useState(3);
  const [note, setNote] = useState("");
  const [setback, setSetback] = useState(false);

  const saveCheckin = () => {
    setCheckins([...checkins, { date: today(), mood, crave, note: note.trim() }]);
    setNote("");
  };

  return (
    <section>
      <h2 className="mt-1 text-xl font-semibold">My progress</h2>

      <Card className="text-center">
        <div className="text-5xl font-bold text-leaf-700">{daysSince(startDate)}</div>
        <div>days since my last use</div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <input
            type="date"
            value={startDate}
            max={today()}
            onChange={(e) => {
              setStartDate(e.target.value);
              setSetback(false);
            }}
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            aria-label="Start date"
          />
          <Button
            variant="ghost"
            onClick={() => {
              setStartDate(today());
              setSetback(true);
            }}
          >
            I had a setback
          </Button>
        </div>
        {setback && (
          <p className="mt-3 text-sm text-slate-500">
            A setback isn't the end of your journey. Every day you try again counts. Consider talking to
            Sol or someone you trust.
          </p>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold">Today's check-in</h3>
        <label className="mt-3 block text-sm">
          Mood: {mood}/5
          <input
            type="range"
            min="1"
            max="5"
            value={mood}
            onChange={(e) => setMood(+e.target.value)}
            className="mt-1 block w-full accent-leaf-500"
          />
        </label>
        <label className="mt-3 block text-sm">
          Craving strength: {crave}/10
          <input
            type="range"
            min="0"
            max="10"
            value={crave}
            onChange={(e) => setCrave(+e.target.value)}
            className="mt-1 block w-full accent-leaf-500"
          />
        </label>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="One thing I'm proud of today…"
          className="my-3 w-full rounded-xl border border-slate-300 p-2.5 outline-none focus:border-leaf-500"
        />
        <Button onClick={saveCheckin}>Save check-in</Button>

        <ul className="mt-3 text-sm text-slate-500">
          {[...checkins].slice(-7).reverse().map((c, i) => (
            <li key={i} className="border-t border-slate-100 py-1.5">
              {c.date} – mood {c.mood}/5, craving {c.crave}/10{c.note ? ` – ${c.note}` : ""}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="font-semibold">My reasons for change</h3>
        <textarea
          rows={3}
          value={reasons}
          onChange={(e) => setReasons(e.target.value)}
          placeholder="Why do I want this? (family, health, freedom…)"
          className="mt-2 w-full rounded-xl border border-slate-300 p-2.5 outline-none focus:border-leaf-500"
        />
        <p className="text-xs text-slate-500">Saved automatically.</p>
      </Card>

      <p className="text-xs text-slate-500">This data is stored only in your browser.</p>
    </section>
  );
}
