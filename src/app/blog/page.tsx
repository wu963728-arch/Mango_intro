import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/Parallax";
import { formatDate, posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "果園日誌｜夏至果園",
  description: "挑芒果、存芒果，以及果園一整年的故事。",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 md:pt-14 lg:pt-20">
      {/* 標題 */}
      <header className="mb-10 grid gap-5 border-b border-ink/20 pb-8 md:mb-14 md:grid-cols-12">
        <Parallax offset={-20} className="md:col-span-8">
          <p className="mb-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted">
            <span className="h-px w-10 bg-ink/40" />
            Journal
          </p>
          <h1 className="font-serif text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">果園日誌</h1>
        </Parallax>
        <p className="max-w-sm text-sm leading-7 text-ink/70 md:col-span-4 md:self-end">
          挑芒果、存芒果，以及果園一整年的故事。寫給每一個愛吃芒果的人。
        </p>
      </header>

      {/* 精選文章：手機上下、電腦左右 */}
      {/* 照片不放在玻璃（backdrop-filter）裡，避免瀏覽器大圖繪製問題；只有文字區用玻璃 */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group grid overflow-hidden rounded-[24px] shadow-[0_24px_60px_-28px_rgb(28_38_32/0.35)] md:rounded-[32px] lg:grid-cols-12"
      >
        <div className="relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-[7/5]">
          <Image
            src={featured.cover}
            alt={featured.coverAlt}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="glass flex flex-col justify-center rounded-none border-0 p-6 sm:p-10 lg:col-span-5">
          <p className="text-xs text-muted">
            <span className="mr-3 rounded-full bg-mango px-2.5 py-1 text-[11px] text-white">最新</span>
            {featured.category} · {formatDate(featured.date)}
          </p>
          <h2 className="mt-5 font-serif text-3xl font-black leading-snug sm:text-4xl">{featured.title}</h2>
          <p className="mt-4 text-sm leading-7 text-ink/75">{featured.excerpt}</p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-medium group-hover:text-mango">
            閱讀全文 <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </p>
        </div>
      </Link>

      {/* 其他文章：手機 1 欄、平板以上 2 欄 */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {rest.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="glass group flex flex-col overflow-hidden rounded-[24px] md:rounded-[28px]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={p.cover}
                alt={p.coverAlt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="text-xs text-muted">
                {p.category} · {formatDate(p.date)} · {p.readMinutes} 分鐘
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold leading-snug">{p.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink/75">{p.excerpt}</p>
              <p className="mt-auto pt-6 text-sm font-medium group-hover:text-mango">
                閱讀全文 <span aria-hidden>→</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
