import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Parallax from "@/components/Parallax";
import LuckyDraw from "@/components/LuckyDraw";
import WelcomeModal from "@/components/WelcomeModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 中文標題用的襯線字體
const serifTC = Noto_Serif_TC({
  variable: "--font-serif-tc",
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "夏至果園｜台南玉井愛文芒果 產地直送",
  description: "樹上自然熟、採收當日出貨的台南玉井愛文芒果，2027 產季搶先登記中。",
};

// 這個設計只有淺色版：告訴瀏覽器不要自動套用深色模式
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#f3eee4",
};

// 背景顆粒質感
const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} ${serifTC.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-hidden">
        {/* 背景：一顆落日色的大圓與葉綠色塊，讓玻璃有東西可以透 */}
        <div aria-hidden className="pointer-events-none fixed inset-0">
          {/* 三層背景用不同速度移動，製造景深 */}
          <Parallax page offset={0.06} className="absolute inset-0">
            <div className="absolute -top-[30vw] -right-[30vw] h-[90vw] w-[90vw] max-h-[900px] max-w-[900px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#f7c36a_0%,#ee8a3a_45%,#d9581f_100%)] opacity-90 sm:-top-[18vw] sm:-right-[12vw] sm:h-[58vw] sm:w-[58vw]" />
          </Parallax>
          <Parallax page offset={-0.04} className="absolute inset-0">
            <div className="absolute top-[45vh] -left-[30vw] h-[70vw] w-[70vw] rounded-full bg-leaf/70 blur-[90px] sm:top-[55vh] sm:-left-[14vw] sm:h-[42vw] sm:w-[42vw]" />
          </Parallax>
          <Parallax page offset={0.12} className="absolute inset-0">
            <div className="absolute top-[110vh] right-[10vw] h-[50vw] w-[50vw] rounded-full bg-[#e9d27a]/60 blur-[100px] sm:h-[30vw] sm:w-[30vw]" />
          </Parallax>
          <div
            className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
            style={{ backgroundImage: grain }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* 右下角抽獎按鈕 + Modal（每一頁都有） */}
        <LuckyDraw />

        {/* 第一次進站時詢問稱呼 */}
        <WelcomeModal />
      </body>
    </html>
  );
}
