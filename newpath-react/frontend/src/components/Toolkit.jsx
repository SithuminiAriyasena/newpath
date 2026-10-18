import { useEffect, useState } from "react";
import Card, { Button } from "./Card.jsx";

const PHASES = [
  { label: "Breathe in", secs: 4, scale: 1.4 },
  { label: "Hold", secs: 4, scale: 1.4 },
  { label: "Breathe out", secs: 6, scale: 1 },
];

function Breathing() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % PHASES.length), PHASES[phase].secs * 1000);
    return () => clearTimeout(t);
  }, [running, phase]);

  const current = running ? PHASES[phase] : null;

  return (
    <Card className="text-center">
      <h3 className="font-semibold">Guided breathing</h3>
      <div
        className="mx-auto my-6 flex h-36 w-36 items-center justify-center rounded-full bg-leaf-100 font-semibold text-leaf-700 ease-in-out"
        style={{
          transform: `scale(${current ? current.scale : 1})`,
          transition: `transform ${current ? current.secs : 1}s`,
        }}
      >
        {current ? current.label : "Ready"}
      </div>
      <Button
        onClick={() => {
          setPhase(0);
          setRunning((r) => !r);
        }}
      >
        {running ? "Stop" : "Start (4 in · 4 hold · 6 out)"}
      </Button>
    </Card>
  );
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function UrgeTimer() {
  const TOTAL = 15 * 60;
  const [remaining, setRemaining] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          setDone(true);
          return TOTAL;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  return (
    <Card className="text-center">
      <h3 className="font-semibold">15-minute urge timer</h3>
      <div className="my-3 text-5xl font-bold text-leaf-700">{fmt(remaining)}</div>
      {done && (
        <p className="mb-3 text-sm text-leaf-700">
          🎉 You rode the wave. The urge usually fades. Well done!
        </p>
      )}
      <Button
        onClick={() => {
          setDone(false);
          if (running) {
            setRunning(false);
            setRemaining(TOTAL);
          } else {
            setRunning(true);
          }
        }}
      >
        {running ? "Reset" : "Start timer"}
      </Button>
    </Card>
  );
}

export default function Toolkit() {
  return (
    <section>
      <h2 className="mt-1 text-xl font-semibold">Craving toolkit</h2>
      <p className="text-slate-600">
        Cravings rise, peak, and pass, usually within 15–30 minutes. You don't have to fight it
        forever, just ride this wave.
      </p>
      <Breathing />
      <UrgeTimer />
      <Card>
        <h3 className="font-semibold">Quick actions</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li><b>H.A.L.T.</b> – Am I Hungry, Angry, Lonely, or Tired? Fix that first.</li>
          <li><b>5-4-3-2-1</b> – Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste.</li>
          <li><b>Move</b> – Walk, stretch, or do 20 push-ups. Change your surroundings.</li>
          <li><b>Reach out</b> – Text or call one person you trust.</li>
          <li><b>Drink water &amp; eat something.</b></li>
          <li><b>Delay</b> – Tell yourself: "Not now. Ask me again in 15 minutes."</li>
        </ul>
      </Card>
    </section>
  );
}
