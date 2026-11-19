"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * 位移幅度
   * - 一般模式：元素經過畫面時，總共位移 ±offset px。
   *   正數 = 比捲動慢（像遠景），負數 = 比捲動快（像近景、往上浮）。
   * - relative 模式：offset 是「父層高度的比例」，用在裝照片的容器（例如 0.1）。
   * - page 模式：offset 是捲動距離的倍數，用在固定背景（例如 0.05）。
   */
  offset?: number;
  relative?: boolean;
  page?: boolean;
};

export default function Parallax({ children, className = "", style, offset = 40, relative = false, page = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 尊重「減少動態效果」的系統設定
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      let y: number;

      if (page) {
        y = -window.scrollY * offset;
      } else {
        // 量父層位置，避免自己的位移影響計算
        const box = (el.parentElement ?? el).getBoundingClientRect();
        const vh = window.innerHeight;
        if (box.bottom < -200 || box.top > vh + 200) return; // 不在畫面內就不算
        // progress：元素從畫面底部進入 = 0，從頂部離開 = 1
        const progress = (vh - box.top) / (vh + box.height);
        const range = relative ? box.height * offset : offset;
        y = (progress - 0.5) * 2 * range;
      }

      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [offset, relative, page]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={style}>
      {children}
    </div>
  );
}
