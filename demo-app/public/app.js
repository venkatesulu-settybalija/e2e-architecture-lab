(function () {
  const base = "";
  let token = sessionStorage.getItem("lab_token");

  const loginSection = document.querySelector('[data-testid="login-section"]');
  const appSection = document.querySelector('[data-testid="app-section"]');
  const loginError = document.querySelector('[data-testid="login-error"]');

  function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.hidden = !msg;
  }

  async function api(path, opts = {}) {
    const headers = { "Content-Type": "application/json", ...opts.headers };
    if (token) headers.Authorization = "Bearer " + token;
    const r = await fetch(base + path, { ...opts, headers });
    const text = await r.text();
    let body = null;
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      body = text;
    }
    if (!r.ok) {
      const err = new Error((body && body.message) || r.statusText);
      err.status = r.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  async function refreshList() {
    const data = await api("/api/todos");
    const list = document.querySelector('[data-testid="todo-list"]');
    const empty = document.querySelector('[data-testid="empty-state"]');
    list.innerHTML = "";
    const items = data.items || [];
    empty.hidden = items.length > 0;
    for (const t of items) {
      const li = document.createElement("li");
      li.dataset.testid = "todo-item";
      li.dataset.todoId = t.id;
      li.textContent = t.completed ? "✓ " + t.title : t.title;
      list.appendChild(li);
    }
  }

  document.querySelector('[data-testid="login-button"]').addEventListener("click", async () => {
    showLoginError("");
    const username = document.querySelector('[data-testid="username"]').value;
    const password = document.querySelector('[data-testid="password"]').value;
    try {
      const res = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      token = res.token;
      sessionStorage.setItem("lab_token", token);
      loginSection.hidden = true;
      appSection.hidden = false;
      await refreshList();
    } catch (e) {
      showLoginError(e.message || "Login failed");
    }
  });

  document.querySelector('[data-testid="todo-form"]').addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const input = document.querySelector('[data-testid="todo-title"]');
    const title = input.value.trim();
    if (!title) return;
    try {
      await api("/api/todos", { method: "POST", body: JSON.stringify({ title }) });
      input.value = "";
      await refreshList();
    } catch (e) {
      alert(e.message);
    }
  });

  if (token) {
    loginSection.hidden = true;
    appSection.hidden = false;
    refreshList().catch(() => {
      sessionStorage.removeItem("lab_token");
      token = null;
      loginSection.hidden = false;
      appSection.hidden = true;
    });
  }
})();
