"use client";

import { useState } from "react";

// 基本 email 格式：有 @、@ 後面有網域和「.」
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const interests =["愛文經典箱", "愛文禮盒", "金煌大果箱", "都有興趣"];

// 目前只顯示感謝訊息，不會把 email 存起來
export default function WaitlistForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (done) {
    return (
      <div className="rounded-2xl bg-white/60 p-5 text-center motion-safe:animate-[pop-in_0.4s_ease-out]">
        <p className="font-serif text-2xl font-bold">🥭 謝謝你！</p>
        <p className="mt-2 text-sm text-ink/75">請等待好消息，產季一到我們會第一時間通知你。</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
        if (!email) return setError("請輸入 email。");
        if (!EMAIL_RE.test(email)) return setError("email 格式不太對，例如：you@example.com");
        setError("");
        setDone(true);
      }}
      noValidate
      className="flex flex-col gap-3"
    >
      <label htmlFor="waitlist-email" className="sr-only">
        Email
      </label>
      <input
        id="waitlist-email"
        type="email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        aria-invalid={error ? true : undefined}
        aria-describedby="waitlist-hint"
        onChange={() => error && setError("")}
        className={`w-full rounded-full border bg-white/70 ${error ? "border-mango" : "border-ink/20"} px-5 py-3 text-sm outline-none transition placeholder:text-muted focus:border-mango focus:bg-white focus:ring-2 focus:ring-mango/20`}
      />

      <fieldset>
        <legend className="mb-2 text-xs text-ink/70">對哪個品項有興趣？（選填）</legend>
        <div className="flex flex-wrap gap-2">
          {interests.map((it) => (
            <label key={it} className="cursor-pointer">
              <input type="radio" name="interest" value={it} className="peer sr-only" />
              <span className="inline-block rounded-full border border-ink/15 bg-white/40 px-3 py-1.5 text-xs transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-mango">
                {it}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-mango"
      >
        加入搶先名單 <span aria-hidden>→</span>
      </button>

      <p id="waitlist-hint" aria-live="polite" className={`min-h-5 text-xs ${error ? "font-medium text-mango" : "text-ink/70"}`}>
        {error || "只會在開賣與產季消息時寄信，不會亂發廣告。"}
      </p>
    </form>
  );
}
