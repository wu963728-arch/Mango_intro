import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/Parallax";
import WaitlistForm from "@/components/WaitlistForm";
import WelcomeGreeting from "@/components/WelcomeGreeting";

type Product = {
  name: string;
  en: string;
  spec: string;
  price: number;
  img: string;
  alt: string;
  notes: string[];
  tag?: string;
};

const products: Product[] = [
  {
    name: "愛文芒果・經典箱",
    en: "Irwin Mango — Classic",
    spec: "5 台斤 ／ 約 8–10 顆",
    price: 1280,
    img: "/images/mango-pile.jpg",
    alt: "一堆紅黃相間的愛文芒果",
    notes: ["樹上自然熟", "單顆 300g 以上"],
  },
  {
    name: "愛文芒果・禮盒",
    en: "Irwin Mango — Gift Box",
    spec: "10 台斤 ／ 約 16–18 顆",
    price: 2380,
    img: "/images/mango-cut.jpg",
    alt: "切成花狀的芒果果肉",
    notes: ["精選大果", "附手寫卡片"],
    tag: "人氣首選",
  },
  {
    name: "金煌芒果・大果箱",
    en: "Jinhwang Mango",
    spec: "10 台斤 ／ 約 6–8 顆",
    price: 1980,
    img: "/images/mango-market.jpg",
    alt: "市場竹籃上的成熟芒果",
    notes: ["果大肉厚", "纖維細少"],
  },
];

const varieties = [
  { name: "愛文", months: [5, 6, 7, 8], color: "#d9581f" },
  { name: "金煌", months: [6, 7, 8], color: "#e2a62b" },
];

const perks = [
  ["開賣通知", "正式開放訂購的那一刻，第一時間寄信給你。"],
  ["優先訂購", "名單上的朋友比公開販售早 3 天下單。"],
  ["產季日誌", "從開花、結果到採收，偶爾分享果園的近況。"],
];

const faqs = [
  ["什麼時候開賣？", "預計 2027 年 5 月開放訂購、6 月中開始出貨，確切日期會先寄信通知名單上的朋友。"],
  ["加入名單要付錢嗎？", "完全免費，也不代表一定要購買。只是讓我們開賣時能第一個通知你。"],
  ["可以取消訂閱嗎？", "可以，每封信的最下方都有取消訂閱連結，點一下就不會再收到。"],
];

/** 有視差效果的照片：照片比外框大一點，捲動時在框內慢慢移動 */
function ParallaxImage({
  src,
  alt,
  sizes,
  amount = 0.1,
  eager = false,
  imgClassName = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  amount?: number;
  eager?: boolean;
  imgClassName?: string;
}) {
  return (
    <Parallax relative offset={amount} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-cover ${imgClassName}`}
        {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      />
    </Parallax>
  );
}

function MonthBar({ months, color }: { months: number[]; color: string }) {
  return (
    <div className="grid grid-cols-12 gap-[2px] sm:gap-[3px]">
      {Array.from({ length: 12 }, (_, i) => {
        const on = months.includes(i + 1);
        return (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className="h-6 w-full rounded-[3px] sm:h-8 sm:rounded-[4px]"
              style={{ background: on ? color : "rgba(28,38,32,0.08)" }}
            />
            <span className={`font-mono text-[9px] sm:text-[10px] ${on ? "text-ink" : "text-muted/60"}`}>
              {i + 1}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SectionHead({ no, title, en, children }: { no: string; title: string; en: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 grid gap-5 border-t border-ink/20 pt-6 md:mb-12 md:grid-cols-12 md:gap-6">
      <Parallax offset={-24} className="flex flex-wrap items-baseline gap-x-4 gap-y-2 md:col-span-7">
        <span className="font-mono text-sm text-muted">{no}</span>
        <h2 className="font-serif text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{title}</h2>
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">{en}</span>
      </Parallax>
      <p className="max-w-md text-sm leading-7 text-ink/70 md:col-span-5 md:col-start-8 md:self-end lg:col-span-4 lg:col-start-9">
        {children}
      </p>
    </div>
  );
}

const nt = (n: number) => n.toLocaleString("en-US");

// 區塊共用的外距：手機較緊、電腦較寬
const section = "mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6 md:pt-24 lg:scroll-mt-28 lg:pt-32";

export default function Home() {
  return (
    <>
      {/* ── 主視覺 ── */}
      <section className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-4 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14 lg:gap-6 lg:pt-20">
        <div className="col-span-12 flex flex-col justify-center lg:col-span-6">
          <Parallax offset={30}>
            <WelcomeGreeting />
            <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted md:mb-10">
              <span className="h-px w-10 bg-ink/40" />
              台南玉井 · 產地直送
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,10vw,6.5rem)] font-black leading-[1.08] tracking-tight lg:text-[clamp(3rem,6.4vw,6.5rem)]">
              一顆愛文，
              <br />
              等了<span className="text-mango">一整年</span>。
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-8 text-ink/75 md:mt-10">
              我們只在果實於樹上自然轉紅時採收，
              當天挑選、當天裝箱。
              2027 夏季的第一批芒果，即將開放訂購。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 md:mt-12 md:gap-8">
              <Link
                href="#order"
                className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-mango"
              >
                加入搶先名單 <span aria-hidden>→</span>
              </Link>
              <Link href="#story" className="border-b border-ink pb-1 text-sm font-medium hover:border-mango hover:text-mango">
                認識我們的果園
              </Link>
            </div>
          </Parallax>
        </div>

        <div className="relative col-span-12 lg:col-span-6">
          {/* 手機直式、平板橫式、電腦直式 */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[4/3] md:aspect-[16/10] md:rounded-[32px] lg:aspect-[5/6]">
            <ParallaxImage
              src="/images/mango-tree.jpg"
              alt="掛在枝頭、帶著水珠的芒果"
              sizes="(min-width: 1024px) 50vw, 100vw"
              amount={0.08}
              eager
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          {/* 浮在照片上的玻璃卡：捲動時比照片快，像浮起來 */}
          <Parallax
            offset={-50}
            className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-72 lg:-left-10 lg:bottom-12 lg:right-auto"
          >
            <div className="glass rounded-3xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink/70">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mango opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-mango" />
                </span>
                2027 產季 · 搶先登記中
              </div>
              <p className="font-serif text-2xl font-bold">預計 5 月開賣</p>
              <p className="mt-1 text-xs text-ink/70">留下 Email，開賣第一個通知你</p>
            </div>
          </Parallax>
        </div>
      </section>

      {/* ── 特色列 ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 border-y border-ink/20 md:grid-cols-4">
          {[
            ["樹上熟", "不催熟、不提早採"],
            ["當日採", "採收當天挑選裝箱"],
            ["低溫配", "冷藏宅配到府"],
            ["壞果賠", "到貨損傷補寄"],
          ].map(([n, l], i) => (
            <div
              key={n}
              className={
                "border-ink/20 py-6 md:py-8 " +
                ["", "border-l pl-5 md:pl-6", "border-t md:border-t-0 md:border-l md:pl-6", "border-l border-t pl-5 md:border-t-0 md:pl-6"][i]
              }
            >
              <p className="font-serif text-2xl font-black md:text-3xl">{n}</p>
              <p className="mt-2 text-xs text-muted">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 01 果園 ── */}
      <section id="story" className={section}>
        <SectionHead no="01" title="果園" en="Our Orchard">
          玉井位在台南東邊的丘陵，日夜溫差大、日照充足，是台灣愛文芒果最知名的產區。
        </SectionHead>

        <div className="grid gap-5 md:gap-6 lg:grid-cols-12">
          {/* 手機直式、平板寬版、電腦直式 */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[16/10] md:rounded-[28px] lg:col-span-5 lg:aspect-auto lg:min-h-[560px]">
            <ParallaxImage src="/images/mango-pile.jpg" alt="剛採收的芒果" sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>

          <div className="flex flex-col gap-5 md:gap-6 lg:col-span-7">
            <blockquote className="glass rounded-[24px] p-7 sm:p-10 md:rounded-[28px]">
              <p className="font-serif text-[1.65rem] font-bold leading-[1.5] sm:text-4xl">
                「我們不趕時間，
                <br />
                讓芒果自己決定
                <br />
                什麼時候<span className="text-mango">最甜</span>。」
              </p>
              <p className="mt-6 text-xs tracking-wider text-muted">— 夏至果園 第二代果農</p>
            </blockquote>

            <ol className="grid gap-px overflow-hidden rounded-[24px] sm:grid-cols-3 md:rounded-[28px]">
              {[
                ["樹頭熟", "等果皮自然轉紅才採，香氣與甜度最完整。"],
                ["一顆顆挑", "人工檢查外觀與重量，小果與傷果不出貨。"],
                ["友善耕作", "以草生栽培保護土壤，減少不必要的用藥。"],
              ].map(([t, d], i) => (
                <li key={t} className="glass rounded-none p-6">
                  <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 font-serif text-xl font-bold">{t}</p>
                  <p className="mt-2 text-sm leading-7 text-ink/75">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── 02 商品 ── */}
      <section id="products" className={section}>
        <SectionHead no="02" title="商品" en="Shop">
          2027 產季預計推出的品項，價格為預估、含運費。目前尚未開賣，可以先登記到貨通知。
        </SectionHead>

        {/* 手機 1 欄、平板 2 欄（第三張橫跨）、電腦 3 欄 */}
        <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {products.map((p, i) => {
            const wide = i === products.length - 1; // 平板時最後一張橫跨兩欄
            return (
              <article
                key={p.name}
                className={`glass group flex flex-col overflow-hidden rounded-[24px] md:rounded-[28px] ${
                  wide ? "md:col-span-2 md:flex-row lg:col-span-1 lg:flex-col" : ""
                }`}
              >
                <div
                  className={`relative aspect-[4/3] shrink-0 overflow-hidden ${
                    wide ? "md:aspect-auto md:w-1/2 lg:aspect-[4/3] lg:w-auto" : ""
                  }`}
                >
                  <ParallaxImage
                    src={p.img}
                    alt={p.alt}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    amount={0.06}
                    imgClassName="transition duration-700 group-hover:scale-105"
                  />
                  {p.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-mango px-3 py-1 text-[11px] font-medium text-white">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted">{p.en}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-ink/70">{p.spec}</p>
                  <ul className="mb-6 mt-4 flex flex-wrap gap-2">
                    {p.notes.map((n) => (
                      <li key={n} className="rounded-full border border-ink/15 bg-white/40 px-3 py-1 text-xs">
                        {n}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-end justify-between border-t border-ink/10 pt-5">
                    <p>
                      <span className="mr-1 text-xs text-muted">預估 NT$</span>
                      <span className="font-serif text-3xl font-black">{nt(p.price)}</span>
                    </p>
                    <Link
                      href="#order"
                      className="rounded-full bg-ink px-5 py-2.5 text-xs font-medium text-paper transition hover:bg-mango"
                    >
                      到貨通知
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── 03 產季 ── */}
      <section id="season" className={section}>
        <SectionHead no="03" title="產季" en="Harvest Calendar">
          芒果一年只有一季。愛文最早熟，金煌接在後面，盛夏是兩者重疊、最好吃的時候。
        </SectionHead>

        <div className="glass space-y-6 rounded-[24px] p-5 sm:space-y-8 sm:p-8 md:rounded-[28px] lg:p-10">
          {varieties.map((v) => (
            <div key={v.name} className="grid items-center gap-3 sm:grid-cols-12 sm:gap-4">
              <p className="font-serif text-xl font-bold sm:col-span-2 sm:text-2xl">{v.name}</p>
              <div className="sm:col-span-10">
                <MonthBar months={v.months} color={v.color} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 搶先名單 ── */}
      <section id="order" className={section}>
        <SectionHead no="04" title="搶先名單" en="Join the Waitlist">
          果園還在準備中，尚未開賣。留下 Email，開賣時會第一個通知你。
        </SectionHead>

        {/* 加入名單的好處：手機 1 欄、平板以上 3 欄 */}
        <ol className="grid border-t border-ink/20 sm:grid-cols-3">
          {perks.map(([t, d], i) => (
            <li
              key={t}
              className={`flex gap-5 border-b border-ink/20 py-6 sm:block sm:py-8 ${i > 0 ? "sm:border-l sm:pl-6" : ""} ${i < 2 ? "sm:pr-6" : ""}`}
            >
              <span className="text-outline font-serif text-5xl font-black leading-none sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-serif text-xl font-bold sm:mt-6">{t}</p>
                <p className="mt-2 text-sm leading-7 text-ink/75">{d}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* 大圖 + Email 登記卡：手機/平板卡片接在照片下方，電腦浮在照片左側 */}
        <div className="relative mt-12 md:mt-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] md:rounded-[32px] lg:aspect-[16/9]">
            <ParallaxImage src="/images/mango-cut.jpg" alt="切成花狀的愛文芒果" sizes="100vw" amount={0.1} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-ink/50 lg:via-ink/10" />
          </div>
          <div className="relative z-10 -mt-16 px-3 sm:-mt-24 sm:px-8 lg:absolute lg:left-12 lg:top-1/2 lg:mt-0 lg:w-[26rem] lg:-translate-y-1/2 lg:px-0">
            <Parallax offset={-30}>
              <div className="glass rounded-3xl p-6 sm:p-8">
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink/70">Waitlist · 2027 Season</p>
                <p className="mb-6 mt-3 font-serif text-2xl font-black leading-snug sm:text-3xl">
                  今年夏天的第一口，
                  <br />
                  先幫你留著。
                </p>
                <WaitlistForm />
              </div>
            </Parallax>
          </div>
        </div>

        {/* 常見問題 */}
        <div className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-12 lg:gap-6">
          <h3 className="font-serif text-2xl font-black sm:text-3xl lg:col-span-4">常見問題</h3>
          <div className="glass divide-y divide-ink/10 rounded-[24px] px-5 sm:px-6 md:rounded-[28px] lg:col-span-8">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {q}
                  <span className="text-xl text-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-ink/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
