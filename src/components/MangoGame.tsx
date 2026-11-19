"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useVisitor } from "@/lib/visitor";

// 接芒果小遊戲：15 秒內用籃子接住掉下來的芒果
// 🥭 +1、金芒果 +3、🐛 −2；最佳紀錄存在 localStorage

const DURATION = 15;
const BEST_KEY = "geshi-game-best";
const BEST_CHANGE = "geshi-game-best-change";
const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

type Kind = "mango" | "gold" | "bug";
type Phase = "ready" | "playing" | "over";
type Stats = Record<Kind, number>;

const POINTS: Record<Kind, number> = { mango: 1, gold: 3, bug: -2 };

type Item = { x: number; y: number; vy: number; r: number; rot: number; vr: number; kind: Kind };
type Pop = { x: number; y: number; text: string; color: string; life: number };

// ---- 最佳紀錄（localStorage）----
function subscribeBest(cb: () => void) {
  window.addEventListener(BEST_CHANGE, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(BEST_CHANGE, cb);
    window.removeEventListener("storage", cb);
  };
}
function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}
function saveBest(n: number) {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    /* 存不了就算了 */
  }
  window.dispatchEvent(new Event(BEST_CHANGE));
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function verdict(score: number) {
  if (score >= 30) return "芒果大師！果園請你來幫忙採收 🏆";
  if (score >= 20) return "手腳俐落，籃子都快裝滿了！";
  if (score >= 10) return "不錯喔，再來一次會更好。";
  return "芒果還在樹上等你，再試一次？";
}

export default function MangoGame() {
  const { name } = useVisitor();
  const best = useSyncExternalStore(subscribeBest, readBest, () => null);

  const [phase, setPhase] = useState<Phase>("ready");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [stats, setStats] = useState<Stats>({ mango: 0, gold: 0, bug: 0 });
  const [newBest, setNewBest] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 遊戲進行中的資料放 ref，避免每一幀都重新渲染
  const game = useRef({
    w: 0,
    h: 0,
    items: [] as Item[],
    pops: [] as Pop[],
    basketX: 0,
    targetX: 0,
    keys: { left: false, right: false },
    score: 0,
    elapsed: 0,
    spawnIn: 0,
    shownSec: DURATION,
    stats: { mango: 0, gold: 0, bug: 0 } as Stats,
    running: false,
  });

  // 畫布跟著容器大小調整（支援手機、平板、電腦）
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ro = new ResizeObserver(() => {
      const g = game.current;
      const { width, height } = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ratio = g.w ? g.basketX / g.w : 0.5;
      g.w = width;
      g.h = height;
      g.basketX = g.targetX = width * ratio;
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  // 鍵盤：← → 或 A D
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const g = game.current;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") g.keys.left = down;
      else if (k === "arrowright" || k === "d") g.keys.right = down;
      else return;
      if (g.running) e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => set(e, true);
    const onUp = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  // 主迴圈：更新 + 繪製
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const basketSize = (w: number) => {
      const bw = clamp(w * 0.2, 80, 150);
      return { bw, bh: bw * 0.42 };
    };

    const spawn = () => {
      const g = game.current;
      const progress = g.elapsed / DURATION;
      const roll = Math.random();
      const kind: Kind = roll < 0.1 ? "gold" : roll < 0.3 ? "bug" : "mango";
      const r = clamp(g.w * 0.045, 18, 30);
      const speed = g.h * (0.45 + progress * 0.5 + Math.random() * 0.2) * (kind === "gold" ? 1.25 : 1);
      g.items.push({
        x: r + Math.random() * (g.w - r * 2),
        y: -r,
        vy: speed,
        r,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 4,
        kind,
      });
    };

    const finish = () => {
      const g = game.current;
      g.running = false;
      g.items = [];
      const isBest = g.score > 0 && g.score > readBest();
      if (isBest) saveBest(g.score);
      setNewBest(isBest);
      setStats({ ...g.stats });
      setTimeLeft(0);
      setPhase("over");
    };

    const update = (dt: number) => {
      const g = game.current;
      g.elapsed += dt;
      const remain = Math.max(0, DURATION - g.elapsed);
      const sec = Math.ceil(remain);
      if (sec !== g.shownSec) {
        g.shownSec = sec;
        setTimeLeft(sec);
      }

      // 籃子移動
      const { bw, bh } = basketSize(g.w);
      if (g.keys.left) g.targetX -= g.w * 1.4 * dt;
      if (g.keys.right) g.targetX += g.w * 1.4 * dt;
      g.targetX = clamp(g.targetX, bw / 2, g.w - bw / 2);
      g.basketX += (g.targetX - g.basketX) * Math.min(1, dt * 18);

      // 產生新的掉落物：越後面越密
      g.spawnIn -= dt;
      if (g.spawnIn <= 0) {
        g.spawnIn = 0.7 - (g.elapsed / DURATION) * 0.35 + Math.random() * 0.2;
        spawn();
      }

      // 掉落 + 判斷有沒有接到
      const top = g.h - bh - 12;
      g.items = g.items.filter((it) => {
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        const inBasket =
          it.y + it.r * 0.5 >= top && it.y - it.r * 0.5 <= top + bh * 0.5 && Math.abs(it.x - g.basketX) < bw / 2;
        if (inBasket) {
          const pts = POINTS[it.kind];
          g.score = Math.max(0, g.score + pts);
          g.stats[it.kind] += 1;
          setScore(g.score);
          g.pops.push({
            x: it.x,
            y: top - 10,
            text: pts > 0 ? `+${pts}` : `${pts}`,
            color: it.kind === "bug" ? "#b42318" : it.kind === "gold" ? "#c98a12" : "#d9581f",
            life: 1,
          });
          return false;
        }
        return it.y - it.r < g.h;
      });

      if (remain <= 0) finish();
    };

    const drawBasket = (x: number, w: number, h: number, bw: number, bh: number) => {
      const top = h - bh - 12;
      const left = x - bw / 2;
      const inset = bw * 0.11;
      // 籃身
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left + bw, top);
      ctx.lineTo(left + bw - inset, top + bh);
      ctx.lineTo(left + inset, top + bh);
      ctx.closePath();
      ctx.fillStyle = "#2f5d46";
      ctx.fill();
      // 編織紋路
      ctx.save();
      ctx.clip();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      for (let i = 1; i < 4; i++) {
        const y = top + (bh / 4) * i;
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(left + bw, y);
        ctx.stroke();
      }
      for (let i = -bw; i < bw * 2; i += 14) {
        ctx.beginPath();
        ctx.moveTo(left + i, top);
        ctx.lineTo(left + i + bh * 0.6, top + bh);
        ctx.stroke();
      }
      ctx.restore();
      // 籃口
      ctx.fillStyle = "#1c2620";
      ctx.beginPath();
      ctx.roundRect(left - 4, top - 5, bw + 8, 9, 4.5);
      ctx.fill();
    };

    const draw = () => {
      const g = game.current;
      const { w, h } = g;
      ctx.clearRect(0, 0, w, h);

      // 地面
      const ground = ctx.createLinearGradient(0, h - 40, 0, h);
      ground.addColorStop(0, "rgba(47,93,70,0)");
      ground.addColorStop(1, "rgba(47,93,70,0.22)");
      ctx.fillStyle = ground;
      ctx.fillRect(0, h - 40, w, 40);

      // 掉落物
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const it of g.items) {
        ctx.save();
        ctx.translate(it.x, it.y);
        if (it.kind === "gold") {
          ctx.beginPath();
          ctx.arc(0, 0, it.r * 1.15, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(247,195,106,0.45)";
          ctx.fill();
          ctx.shadowColor = "#f7c36a";
          ctx.shadowBlur = 18;
        }
        ctx.rotate(it.rot);
        ctx.font = `${it.r * 1.8}px ${EMOJI_FONT}`;
        ctx.fillText(it.kind === "bug" ? "🐛" : "🥭", 0, 2);
        ctx.restore();
      }

      const { bw, bh } = basketSize(w);
      drawBasket(g.basketX || w / 2, w, h, bw, bh);

      // 得分飄字
      ctx.font = "700 22px ui-sans-serif, system-ui, sans-serif";
      g.pops = g.pops.filter((p) => {
        p.life -= 1 / 50;
        p.y -= 0.8;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
        ctx.globalAlpha = 1;
        return p.life > 0;
      });
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (game.current.running) update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const start = () => {
    const g = game.current;
    g.items = [];
    g.pops = [];
    g.score = 0;
    g.elapsed = 0;
    g.spawnIn = 0.3;
    g.shownSec = DURATION;
    g.stats = { mango: 0, gold: 0, bug: 0 };
    g.basketX = g.targetX = g.w / 2;
    g.running = true;
    setScore(0);
    setTimeLeft(DURATION);
    setPhase("playing");
  };

  // 滑鼠 / 手指拖曳控制籃子
  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    game.current.targetX = e.clientX - rect.left;
  };

  return (
    <div className="glass overflow-hidden rounded-[24px] md:rounded-[32px]">
      {/* 計分列 */}
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Score</p>
          <p className="font-serif text-3xl font-black tabular-nums text-mango">{score}</p>
        </div>
        <div className="flex-1 sm:px-6">
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-mango transition-[width] duration-1000 ease-linear"
              style={{ width: `${(timeLeft / DURATION) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Time</p>
          <p className={`font-mono text-3xl tabular-nums ${timeLeft <= 5 && phase === "playing" ? "text-[#b42318]" : ""}`}>
            {String(timeLeft).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* 遊戲畫面 */}
      <div ref={wrapRef} className="relative aspect-[3/4] w-full sm:aspect-[4/3] lg:aspect-[16/9]">
        <canvas
          ref={canvasRef}
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          className="absolute inset-0 h-full w-full touch-none select-none"
        />

        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/60 p-5 backdrop-blur-sm">
            <div className="w-full max-w-sm text-center motion-safe:animate-[pop-in_0.4s_ease-out]">
              {phase === "ready" ? (
                <>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-muted">15 秒挑戰</p>
                  <h2 className="font-serif text-3xl font-black sm:text-4xl">
                    {name ? `${name}，準備好了嗎？` : "準備好了嗎？"}
                  </h2>
                  <ul className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2 text-sm">
                    <li className="rounded-xl bg-white/60 py-3">
                      <span className="block text-2xl">🥭</span>+1
                    </li>
                    <li className="rounded-xl bg-white/60 py-3">
                      <span className="block text-2xl drop-shadow-[0_0_6px_#f7c36a]">🥭</span>
                      <span className="font-medium text-[#c98a12]">金芒果 +3</span>
                    </li>
                    <li className="rounded-xl bg-white/60 py-3">
                      <span className="block text-2xl">🐛</span>
                      <span className="text-[#b42318]">−2</span>
                    </li>
                  </ul>
                  <p className="mt-5 text-xs leading-6 text-ink/60">
                    電腦：移動滑鼠或按 ← → 鍵
                    <br />
                    手機：手指在畫面上左右滑動
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-muted">
                    {newBest ? "🎉 新紀錄！" : "時間到"}
                  </p>
                  <p className="font-serif text-6xl font-black tabular-nums text-mango sm:text-7xl">{score}</p>
                  <p className="mt-1 text-sm text-ink/60">{name ? `${name} 的得分` : "你的得分"}</p>
                  <p className="mt-4 font-serif text-lg font-bold">{verdict(score)}</p>
                  <p className="mt-3 text-sm text-ink/70">
                    🥭 × {stats.mango}　✨ × {stats.gold}　🐛 × {stats.bug}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={start}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mango px-7 py-3 text-sm font-medium tracking-wider text-white transition hover:bg-ink"
              >
                {phase === "ready" ? "開始遊戲" : "再玩一次"}
                <span aria-hidden>→</span>
              </button>
              <p className="mt-4 text-xs text-muted">最佳紀錄：{best === null ? "—" : `${best} 分`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
