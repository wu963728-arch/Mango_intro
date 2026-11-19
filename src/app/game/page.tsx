import type { Metadata } from "next";
import MangoGame from "@/components/MangoGame";

export const metadata: Metadata = {
  title: "接芒果小遊戲｜夏至果園",
  description: "15 秒內用籃子接住掉下來的芒果，看看你能拿幾分。",
};

export default function GamePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 md:pt-14 lg:pt-20">
      <header className="mb-8 grid gap-5 border-b border-ink/20 pb-8 md:mb-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted">
            <span className="h-px w-10 bg-ink/40" />
            Mini Game
          </p>
          <h1 className="font-serif text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">接芒果</h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-ink/70 md:col-span-4 md:self-end">
          產季還沒到，先來果園暖身一下。15 秒內接住越多芒果越好，小心別接到蟲。
        </p>
      </header>

      <MangoGame />

      <p className="mt-6 text-center text-xs text-muted">純屬娛樂，分數不會兌換任何獎品。</p>
    </div>
  );
}
