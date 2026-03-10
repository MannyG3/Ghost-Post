import type { GenerateContentResponse } from "../types/content";

const STORAGE_TOKEN_KEY = "ghostpost_token";
const DEMO_EMAIL_KEY = "ghostpost_demo_email";
const DEMO_PASSWORD = "GhostPost!123";
const DEMO_NAME = "Ghost Founder";

function getDemoEmail() {
  const existing = window.localStorage.getItem(DEMO_EMAIL_KEY);
  if (existing) return existing;

  const generated = `founder+${Math.random().toString(36).slice(2, 10)}@ghostpost.dev`;
  window.localStorage.setItem(DEMO_EMAIL_KEY, generated);
  return generated;
}

export function getAuthToken() {
  return window.localStorage.getItem(STORAGE_TOKEN_KEY) || "";
}

function setAuthToken(token: string) {
  window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
}

async function loginDemoUser() {
  const email = getDemoEmail();
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: DEMO_PASSWORD }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Demo login failed.");
  }

  const payload = await response.json();
  return payload.token as string;
}

async function registerDemoUser() {
  const email = getDemoEmail();
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: DEMO_NAME,
      email,
      password: DEMO_PASSWORD,
    }),
  });

  if (response.status === 409) {
    // Account already exists for this browser identity; fallback to login.
    return loginDemoUser();
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Demo registration failed.");
  }

  const payload = await response.json();
  return payload.token as string;
}

async function ensureAuthToken() {
  const current = getAuthToken();
  if (current) return current;

  try {
    const token = await loginDemoUser();
    setAuthToken(token);
    return token;
  } catch (_loginError) {
    const token = await registerDemoUser();
    setAuthToken(token);
    return token;
  }
}

export async function apiGenerateContent(githubUrl: string): Promise<GenerateContentResponse> {
  let token = await ensureAuthToken();

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch("/api/generate-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ githubUrl }),
    });

    if (response.ok) {
      return response.json();
    }

    if (response.status === 401 && attempt === 0) {
      window.localStorage.removeItem(STORAGE_TOKEN_KEY);
      token = await ensureAuthToken();
      continue;
    }

    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Unable to generate content.");
  }

  throw new Error("Unable to generate content.");
}
