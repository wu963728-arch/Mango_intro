"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawLottery } from "@/app/actions";

type Phase = "idle" | "drawing" | "win" | "lose" | "done";
type Saved = { date: string; win: boolean; code?: string };

const STORAGE_KEY = "geshi-lucky-draw";
const MIN_SPIN_MS = 1800; // 讓動畫至少轉這麼久，比較有期待感

const today = () => new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD

function loadSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Saved;
    return s.date === today() ? s : null;
  } catch {
    return null;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* 無痕模式等情況存不了，就算了 */
  }
}

export default function LuckyDraw() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  // 打開時：檢查今天是否抽過
  const openModal = () => {
    const saved = loadSaved();
    if (saved) {
      setPhase(saved.win ? "win" : "done");
      setCode(saved.code ?? "");
    } else {
      setPhase("idle");
      setCode("");
    }
    setError("");
    setCopied(false);
    setOpen(true);
  };

  const close = useCallback(() => {
    if (phase !== "drawing") setOpen(false);
  }, [phase]);

  // Esc 關閉、鎖住背景捲動、焦點移到關閉鈕
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const draw = async () => {
    setPhase("drawing");
    setError("");
    try {
      const [result] = await Promise.all([
        drawLottery(),
        new Promise((r) => setTimeout(r, MIN_SPIN_MS)),
      ]);
      if (result.win) {
        setCode(result.code);
        setPhase("win");
        save({ date: today(), win: true, code: result.code });
      } else {
        setPhase("lose");
        save({ date: today(), win: false });
      }
    } catch {
      setPhase("idle");
      setError("連線好像有點問題，請再試一次。");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 不支援就讓使用者手動選取 */
    }
  };

  // 中間那顆球的樣子
  const orb = {
    idle: { bg: "#ef9a2e", label: "?", anim: "" },
    drawing: { bg: "#ef9a2e", label: "?", anim: "animate-[draw-spin_0.5s_linear_infinite]" },
    win: { bg: "#d9581f", label: "9折", anim: "animate-[pop-in_0.6s_ease-out]" },
    lose: { bg: "#8fa77a", label: "🍃", anim: "animate-[pop-in_0.6s_ease-out]" },
    done: { bg: "#8fa77a", label: "🍃", anim: "" },
  }[phase];

  return (
    <>
      {/* 浮動按鈕：每一頁的右下角 */}
      <button
        type="button"
        onClick={openModal}
        className="glass fixed bottom-4 right-4 z-[60] flex items-center gap-2.5 rounded-full py-2 pl-2 pr-5 text-sm font-medium transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-mango text-base text-white shadow-md">
          🎁
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-[#e2b93b] motion-safe:animate-pulse" />
        </span>
        抽芒果優惠
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lucky-title"
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-sm rounded-[28px] bg-paper/80 p-7 text-center motion-safe:animate-[modal-in_0.3s_ease-out] sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              disabled={phase === "drawing"}
              aria-label="關閉"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-lg text-muted transition hover:bg-white/60 hover:text-ink disabled:opacity-30"
            >
              ✕
            </button>

            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Lucky Draw</p>
            <h2 id="lucky-title" className="mt-2 font-serif text-3xl font-black">
              芒果好運籤
            </h2>

            {/* 亮面球 */}
            <div className="my-8 flex justify-center">
              <div
                key={phase}
                className={`flex h-36 w-36 items-center justify-center rounded-full font-serif text-4xl font-black text-white motion-reduce:animate-none ${orb.anim}`}
                style={{
                  background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 70% 85%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 55%), ${orb.bg}`,
                  boxShadow: `inset 0 -8px 18px rgba(0,0,0,0.15), 0 18px 40px -14px ${orb.bg}`,
                }}
              >
                <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">{orb.label}</span>
              </div>
            </div>

            <div aria-live="polite">
              {(phase === "idle" || phase === "drawing") && (
                <>
                  <p className="text-sm leading-7 text-ink/75">
                    每天一次機會，有 <strong className="text-mango">10%</strong> 機率
                    <br />
                    抽中芒果 <strong>9 折優惠券</strong>！
                  </p>
                  <button
                    type="button"
                    onClick={draw}
                    disabled={phase === "drawing"}
                    className="mt-6 w-full rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition hover:bg-mango disabled:opacity-70"
                  >
                    {phase === "drawing" ? "抽獎中…" : "開始抽獎"}
                  </button>
                  {error && <p className="mt-3 text-xs text-mango">{error}</p>}
                </>
              )}

              {phase === "win" && (
                <>
                  <p className="font-serif text-xl font-bold">🎉 恭喜中獎！</p>
                  <p className="mt-1 text-sm text-ink/75">你抽中了芒果 9 折優惠券</p>
                  {/* 票券造型 */}
                  <div className="mt-5 rounded-2xl border-2 border-dashed border-mango/60 bg-white/70 px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Coupon Code</p>
                    <p className="mt-1 select-all font-mono text-2xl font-bold tracking-wider text-mango">{code}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copy}
                    className="mt-4 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-mango"
                  >
                    {copied ? "✓ 已複製" : "複製優惠碼"}
                  </button>
                  <p className="mt-3 text-xs leading-5 text-muted">開賣後結帳時輸入即可使用，請截圖保存。</p>
                </>
              )}

              {phase === "lose" && (
                <>
                  <p className="font-serif text-xl font-bold">差一點點！</p>
                  <p className="mt-2 text-sm leading-7 text-ink/75">這次沒有中獎，明天再來試試手氣吧。</p>
                  <Link
                    href="/#order"
                    onClick={() => setOpen(false)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/30 bg-white/50 px-6 py-3 text-sm font-medium transition hover:bg-white/80"
                  >
                    先加入搶先名單 <span aria-hidden>→</span>
                  </Link>
                </>
              )}

              {phase === "done" && (
                <>
                  <p className="font-serif text-xl font-bold">今天已經抽過囉</p>
                  <p className="mt-2 text-sm leading-7 text-ink/75">每天都有一次機會，明天再來吧！</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
