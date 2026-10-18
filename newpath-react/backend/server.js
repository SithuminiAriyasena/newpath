import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

app.use(express.json({ limit: "50kb" }));

/* ---------- Safety: crisis detection ---------- */
const CRISIS_PATTERNS = [
  /\bsuicid/i,
  /\bkill (myself|me)\b/i,
  /\bend (my|it all|my life)\b/i,
  /\bwant(ed)? to die\b/i,
  /\bdon'?t want to (live|be alive)\b/i,
  /\boverdos/i,
  /\bod['’]?(ing|ed)\b/i,
  /\btook too (much|many)\b/i,
  /\bhurt(ing)? myself\b/i,
  /\bself[- ]harm/i,
];
const isCrisis = (text) => CRISIS_PATTERNS.some((re) => re.test(text));

/* ---------- AI companion system prompt ---------- */
const SYSTEM_PROMPT = `You are "Sol", a warm, non-judgmental recovery support companion on a website for people who want to stop or reduce drug and alcohol use.

How you behave:
- Be kind, calm, and respectful. Never shame, lecture, or moralize. Relapse is common and is not failure.
- Use motivational-interviewing style: reflect feelings, ask one gentle open question at a time, support the person's own reasons for change.
- Offer practical coping tools when appropriate: urge surfing, deep breathing, grounding (5-4-3-2-1), delaying for 15 minutes, HALT check (hungry, angry, lonely, tired), contacting a trusted person, avoiding triggers, building routines, sleep and nutrition.
- Keep replies short (2-6 sentences) and easy to read. Plain language. No heavy formatting.
- Encourage real-world support: doctors, counsellors, peer groups (e.g. NA, SMART Recovery), family or friends they trust.
- You are NOT a doctor or therapist. Do not diagnose, and do not give medication or dosing instructions. For withdrawal from alcohol, benzodiazepines, or opioids, always say that stopping suddenly can be medically dangerous and encourage speaking with a doctor or a local treatment service before quitting.
- Never give instructions for obtaining, making, or using drugs. If someone says they are going to use anyway, stay non-judgmental, encourage safer choices (don't use alone, don't mix substances, keep naloxone nearby if opioids are involved), and keep the door open.
- If the person mentions suicide, self-harm, overdose, or being in immediate danger: respond with care and calm, urge them to contact local emergency services or a crisis line right now, and encourage them to reach out to someone physically near them. Do not leave the conversation cold.
- Do not ask for or store personal identifying details. Remind people, if relevant, that you are an AI and not a replacement for professional care.`;

/* ---------- Simple in-memory rate limiting ---------- */
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const windowMs = 60_000;
  const max = 20;
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    return res
      .status(429)
      .json({ reply: "You're sending messages quickly. Take a breath, and try again in a minute." });
  }
  recent.push(now);
  hits.set(ip, recent);
  next();
}

/* ---------- Chat endpoint ---------- */
app.post("/api/chat", rateLimit, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }

    const clean = messages
      .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

    if (clean.length === 0 || clean[clean.length - 1].role !== "user") {
      return res.status(400).json({ error: "last message must be from user" });
    }

    const crisis = isCrisis(clean[clean.length - 1].content);

    if (!client) {
      return res.json({
        crisis,
        reply: crisis
          ? "I'm really glad you told me. Please contact your local emergency number or a crisis line right now, and reach out to someone near you. You don't have to carry this alone."
          : "I'm here with you. (The AI service isn't configured yet. Add your ANTHROPIC_API_KEY to server/.env.) In the meantime, try the Craving Toolkit tab: breathe slowly, delay 15 minutes, and reach out to someone you trust.",
      });
    }

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: clean,
    });

    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    res.json({ reply, crisis });
  } catch (err) {
    console.error("Chat error:", err?.message || err);
    res.status(500).json({
      reply: "Sorry, I'm having trouble right now. Please try again in a moment. If you're in danger, contact your local emergency number.",
    });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, aiConfigured: !!client }));

/* ---------- Serve built React app in production ---------- */
const dist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`NewPath API running at http://localhost:${PORT}`));
