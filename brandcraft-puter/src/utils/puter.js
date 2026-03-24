// ─── Puter.js Utilities for BrandCraft ────────────────────────────────────────
// Wraps window.puter for React usage

const getPuter = () => window.puter;

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function puterSignIn() {
  const p = getPuter();
  if (!p) throw new Error("Puter.js not loaded");
  await p.auth.signIn();
  return p.auth.getUser();
}

export async function puterSignOut() {
  const p = getPuter();
  if (!p) return;
  await p.auth.signOut();
}

export function puterGetUser() {
  const p = getPuter();
  if (!p) return null;
  try { return p.auth.getUser(); } catch { return null; }
}

export function puterIsSignedIn() {
  const p = getPuter();
  if (!p) return false;
  try { return p.auth.isSignedIn(); } catch { return false; }
}

// ─── KV Storage ───────────────────────────────────────────────────────────────
export async function puterKVSet(key, value) {
  const p = getPuter();
  if (!p) return;
  await p.kv.set(`brandcraft:${key}`, JSON.stringify(value));
}

export async function puterKVGet(key) {
  const p = getPuter();
  if (!p) return null;
  try {
    const raw = await p.kv.get(`brandcraft:${key}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

export async function puterKVDelete(key) {
  const p = getPuter();
  if (!p) return;
  await p.kv.del(`brandcraft:${key}`);
}

// ─── AI ───────────────────────────────────────────────────────────────────────
/**
 * Call Puter.js AI and return a text string.
 * Optionally stream via onStream callback.
 */
export async function puterAI(systemPrompt, userPrompt, onStream) {
  const p = getPuter();
  if (!p) throw new Error("Puter.js not loaded");

  const prompt = systemPrompt
    ? `${systemPrompt}\n\nUser: ${userPrompt}`
    : userPrompt;

  if (onStream) {
    const response = await p.ai.chat(prompt, { stream: true });
    let full = "";
    for await (const part of response) {
      const text = part?.text ?? part?.delta?.text ?? "";
      if (text) { full += text; onStream(full); }
    }
    return full;
  } else {
    const response = await p.ai.chat(prompt);
    return response?.message?.content?.[0]?.text
      ?? response?.message?.content
      ?? response?.text
      ?? String(response);
  }
}

/**
 * Call Puter.js AI and return parsed JSON.
 */
export async function puterAIJSON(systemPrompt, userPrompt) {
  const text = await puterAI(
    systemPrompt + "\n\nRespond with valid JSON only. No markdown, no backticks, no explanation.",
    userPrompt
  );
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return { error: text };
  }
}

// ─── File System ──────────────────────────────────────────────────────────────
export async function puterFSWrite(filename, content) {
  const p = getPuter();
  if (!p) return null;
  return await p.fs.write(`brandcraft/${filename}`, content, { createMissingParents: true });
}

export async function puterFSRead(filename) {
  const p = getPuter();
  if (!p) return null;
  try {
    const file = await p.fs.read(`brandcraft/${filename}`);
    return await file.text();
  } catch { return null; }
}

export function isPuterReady() {
  return typeof window !== "undefined" && !!window.puter;
}
