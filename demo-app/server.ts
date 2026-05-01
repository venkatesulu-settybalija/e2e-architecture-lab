/**
 * Minimal demo application: JSON API + static UI for portfolio / interview demos.
 * In-memory store only — resets on restart (ideal for isolated tests).
 */
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type Todo = { id: string; title: string; completed: boolean; createdAt: string };

const todos = new Map<string, Todo>();
let idSeq = 1;

const app = express();
app.use(express.json());

const PORT = Number(process.env.DEMO_PORT ?? 3000);
const DEMO_USER = process.env.DEMO_USER ?? "demo";
const DEMO_PASS = process.env.DEMO_PASS ?? "demo123";
const TOKEN = "portfolio-demo-token";

app.post("/api/auth/login", (req, res) => {
  const body = req.body as { username?: string; password?: string };
  if (body.username === DEMO_USER && body.password === DEMO_PASS) {
    res.json({ token: TOKEN, expiresIn: 3600 });
    return;
  }
  res.status(401).json({ error: "invalid_credentials", message: "Invalid username or password" });
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    res.status(401).json({ error: "unauthorized", message: "Bearer token required" });
    return;
  }
  const t = h.slice(7);
  if (t !== TOKEN) {
    res.status(403).json({ error: "forbidden", message: "Invalid token" });
    return;
  }
  next();
}

app.get("/api/todos", requireAuth, (_req, res) => {
  res.json({ items: [...todos.values()] });
});

app.post("/api/todos", requireAuth, (req, res) => {
  const title = (req.body as { title?: string }).title?.trim();
  if (!title) {
    res.status(400).json({ error: "validation_error", message: "title is required" });
    return;
  }
  const id = String(idSeq++);
  const todo: Todo = {
    id,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  todos.set(id, todo);
  res.status(201).json(todo);
});

app.get("/api/todos/:id", requireAuth, (req, res) => {
  const t = todos.get(req.params.id);
  if (!t) {
    res.status(404).json({ error: "not_found", message: "Todo not found" });
    return;
  }
  res.json(t);
});

app.patch("/api/todos/:id", requireAuth, (req, res) => {
  const t = todos.get(req.params.id);
  if (!t) {
    res.status(404).json({ error: "not_found", message: "Todo not found" });
    return;
  }
  const body = req.body as { title?: string; completed?: boolean };
  if (body.title !== undefined) t.title = body.title.trim() || t.title;
  if (body.completed !== undefined) t.completed = body.completed;
  res.json(t);
});

app.delete("/api/todos/:id", requireAuth, (req, res) => {
  const ok = todos.delete(req.params.id);
  if (!ok) {
    res.status(404).json({ error: "not_found", message: "Todo not found" });
    return;
  }
  res.status(204).send();
});

/** Test-only: clear store when DEMO_ENABLE_RESET=true (set by Playwright webServer). */
if (process.env.DEMO_ENABLE_RESET === "true") {
  app.post("/api/__reset", (_req, res) => {
    todos.clear();
    idSeq = 1;
    res.status(204).send();
  });
}

app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Demo app listening on http://127.0.0.1:${PORT}`);
});
