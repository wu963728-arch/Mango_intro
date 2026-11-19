import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Parallax from "@/components/Parallax";
import { formatDate, getPost, posts, type Block } from "@/content/posts";

// 文章內容是固定的，不需要「瞬間切換」驗證（避免開發模式出現 instant-shell 警告）
export const instant = false;

// 建置時先產生三篇文章的頁面
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title}｜夏至果園`, description: post.excerpt };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h2":
      return (
        <h2 key={i} className="mt-12 font-serif text-2xl font-bold sm:text-3xl">
          {b.text}
        </h2>
      );
    case "list":
      return (
        <ul key={i} className="mt-5 space-y-2">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3">
              <span className="mt-[0.85em] h-px w-4 shrink-0 bg-mango" />
              {it}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={i} className="glass my-10 rounded-3xl p-6 font-serif text-xl font-bold leading-relaxed sm:p-8 sm:text-2xl">
          {b.text}
        </blockquote>
      );
    default:
      return (
        <p key={i} className="mt-5">
          {b.text}
        </p>
      );
  }
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <article className="pt-10 md:pt-14 lg:pt-20">
      {/* 標題區 */}
      <header className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/blog" className="text-xs text-muted hover:text-mango">
          ← 果園日誌
        </Link>
        <p className="mt-8 text-xs tracking-wider text-muted">
          {post.category} · {formatDate(post.date)} · {post.readMinutes} 分鐘閱讀
        </p>
        <h1 className="mt-4 font-serif text-4xl font-black leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-6 text-base leading-8 text-ink/75">{post.excerpt}</p>
      </header>

      {/* 封面：有視差 */}
      <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 md:mt-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] sm:aspect-[16/9] md:rounded-[32px]">
          <Parallax relative offset={0.1} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
            <Image src={post.cover} alt={post.coverAlt} fill sizes="(min-width: 1152px) 1152px, 100vw" loading="eager" fetchPriority="high" className="object-cover" />
          </Parallax>
        </div>
      </div>

      {/* 內文 */}
      <div className="mx-auto max-w-2xl px-4 pt-6 text-[16px] leading-[2] text-ink/85 sm:px-6 sm:text-[17px]">
        {post.body.map(renderBlock)}

        {/* 文末 CTA */}
        <div className="mt-16 flex flex-col items-start gap-4 border-t border-ink/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-xl font-bold">想在開賣時第一個知道？</p>
          <Link href="/#order" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-mango">
            加入搶先名單 <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      {/* 其他文章 */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="mb-6 border-t border-ink/20 pt-6 font-serif text-2xl font-black">繼續閱讀</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {others.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="glass group flex overflow-hidden rounded-[24px]">
              <div className="relative w-28 shrink-0 overflow-hidden sm:w-44">
                <Image src={p.cover} alt={p.coverAlt} fill sizes="176px" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xs text-muted">{p.category}</p>
                <p className="mt-2 font-serif text-lg font-bold leading-snug group-hover:text-mango">{p.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
