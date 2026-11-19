"use client";

import { openWelcome, useVisitor } from "@/lib/visitor";

/** 首頁主視覺上方的歡迎小卡；還沒填稱呼時不顯示 */
export default function WelcomeGreeting() {
  const { name } = useVisitor();
  if (!name) return null;

  return (
    <div className="glass mb-6 inline-flex max-w-full items-center gap-3 rounded-full py-1.5 pl-1.5 pr-4 text-sm motion-safe:animate-[pop-in_0.5s_ease-out] md:mb-8">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mango text-white">👋</span>
      <span className="truncate">
        嗨，<strong className="font-serif text-base">{name}</strong>！歡迎來到夏至果園
      </span>
      <button
        type="button"
        onClick={openWelcome}
        className="shrink-0 text-xs text-muted underline-offset-2 hover:text-mango hover:underline"
      >
        更改
      </button>
    </div>
  );
}
