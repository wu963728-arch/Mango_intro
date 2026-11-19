import Link from "next/link";
import Parallax from "./Parallax";

const photoCredits = [
  ["Allec Gomes", "https://unsplash.com/photos/7CMH2a9Vumo"],
  ["Desirae Hayes-Vitor", "https://unsplash.com/photos/vxtBBfMTMZ0"],
  ["Ima Enoch", "https://unsplash.com/photos/HMV4-a9P2cM"],
  ["Jacqueline Brandwayn", "https://unsplash.com/photos/McxsrN3WW48"],
];

export default function Footer() {
  return (
    <footer className="px-4 pb-4 pt-20 sm:px-6 sm:pb-6 md:pt-24">
      <div className="glass mx-auto max-w-7xl overflow-hidden rounded-[24px] px-6 pt-10 sm:px-10 sm:pt-12 md:rounded-[28px]">
        <div className="grid gap-10 border-b border-ink/15 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-2xl font-bold leading-snug">
              好芒果，
              <br />
              是陽光寫給人的信。
            </p>
            <p className="mt-4 text-sm text-ink/70">台南市玉井區 · 自產自銷</p>
          </div>

          <div className="md:col-span-2 md:col-start-7">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted">Index</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#story" className="hover:text-mango">果園</Link></li>
              <li><Link href="/#products" className="hover:text-mango">商品</Link></li>
              <li><Link href="/#season" className="hover:text-mango">產季</Link></li>
              <li><Link href="/#order" className="hover:text-mango">搶先名單</Link></li>
              <li><Link href="/blog" className="hover:text-mango">果園日誌</Link></li>
              <li><Link href="/game" className="hover:text-mango">接芒果小遊戲</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>電話 06-000-0000</li>
              <li>LINE @geshi-mango</li>
              <li>hello@example.com</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-end">
          <Parallax offset={40} className="shrink-0">
            <p className="whitespace-nowrap font-serif text-[clamp(3.5rem,15vw,11rem)] font-black leading-[0.85] tracking-[0.04em] text-ink/90">
              夏至果園
            </p>
          </Parallax>
          <div className="pb-2 text-xs text-muted sm:text-right">
            <p>
              Photos on Unsplash by{" "}
              {photoCredits.map(([name, url], i) => (
                <span key={name}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-mango">
                    {name}
                  </a>
                  {i < photoCredits.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p className="mt-1">© 2026 夏至果園 · AI Coding 無痛上手 練習作品</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
