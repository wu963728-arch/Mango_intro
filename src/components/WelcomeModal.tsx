"use client";

import { useEffect, useState } from "react";
import { NAME_MAX, WELCOME_OPEN_EVENT, saveName, skipName, useVisitor } from "@/lib/visitor";

export default function WelcomeModal() {
  const { ready, name, skipped } = useVisitor();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // 第一次來（沒填過、也沒略過）就自動打開；按「更改」也會打開
  const open = editing || (ready && !name && !skipped);

  useEffect(() => {
    const onOpen = () => {
      setValue(name);
      setError("");
      setEditing(true);
    };
    window.addEventListener(WELCOME_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(WELCOME_OPEN_EVENT, onOpen);
  }, [name]);

  // 打開時鎖住背景捲動、Esc = 略過/取消
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    if (!name) skipName(); // 第一次就略過：記住，不再打擾
    setEditing(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("請輸入一個稱呼，或按「略過」");
      return;
    }
    saveName(trimmed);
    setEditing(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="glass w-full max-w-sm rounded-[28px] bg-paper/80 p-7 motion-safe:animate-[modal-in_0.35s_ease-out] sm:p-8"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Welcome</p>
        <h2 id="welcome-title" className="mt-2 font-serif text-3xl font-black leading-snug">
          {name ? "想換個稱呼嗎？" : (
            <>
              歡迎來到
              <br />
              夏至果園 🥭
            </>
          )}
        </h2>
        <p className="mt-3 text-sm leading-7 text-ink/75">我們該怎麼稱呼你呢？</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label htmlFor="visitor-name" className="sr-only">
            你的稱呼
          </label>
          <input
            id="visitor-name"
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            maxLength={NAME_MAX}
            placeholder="例如：小芒"
            autoComplete="nickname"
            className="w-full rounded-full border border-ink/20 bg-white/70 px-5 py-3 text-base outline-none transition placeholder:text-muted focus:border-mango focus:bg-white focus:ring-2 focus:ring-mango/20"
          />
          <div className="flex justify-between px-2 text-xs">
            <span className={error ? "text-mango" : "text-transparent"} aria-live="polite">
              {error || "."}
            </span>
            <span className="text-muted">
              {value.length}/{NAME_MAX}
            </span>
          </div>
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition hover:bg-mango"
          >
            {name ? "更新稱呼" : "進入官網"} <span aria-hidden>→</span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full px-6 py-2 text-xs text-muted transition hover:text-ink"
          >
            {name ? "取消" : "略過"}
          </button>
        </form>
      </div>
    </div>
  );
}
