// 部落格文章資料：新增文章就在這個陣列加一筆

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type Post = {
  slug: string; // 網址：/blog/<slug>
  title: string;
  excerpt: string;
  category: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  cover: string;
  coverAlt: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "how-to-pick-irwin-mango",
    title: "挑一顆好吃的愛文芒果，看這五個地方",
    excerpt: "顏色、香氣、手感、重量與蒂頭——果農每天都在用的挑果方法，教你在市場一眼挑中最甜的那顆。",
    category: "選果指南",
    date: "2026-11-10",
    readMinutes: 4,
    cover: "/images/mango-pile.jpg",
    coverAlt: "一堆紅黃相間的愛文芒果",
    body: [
      { type: "p", text: "每到夏天，市場上的芒果堆得像小山一樣。看起來都很漂亮，但吃起來甜度、香氣差很多。其實只要掌握幾個重點，就能大幅提高挑中好芒果的機率。" },
      { type: "h2", text: "1. 看顏色：紅中帶黃，越均勻越好" },
      { type: "p", text: "愛文芒果成熟時，果皮會從青綠轉成紅色，底色則透出黃色。日照充足的一面會比較紅，但整體顏色過渡自然、沒有大片青綠色的，通常熟度比較一致。" },
      { type: "h2", text: "2. 聞香氣：靠近蒂頭聞一聞" },
      { type: "p", text: "成熟的芒果在蒂頭附近會散發明顯的果香。如果完全沒有味道，代表還沒熟；如果聞到發酵般的酒味，則可能已經過熟。" },
      { type: "h2", text: "3. 摸手感：微微有彈性" },
      { type: "p", text: "用指腹輕輕按壓果肩，有一點點彈性、像按在臉頰上的感覺最剛好。太硬是還沒熟，按下去會留下凹痕的則是過熟。注意要用指腹、不要用指尖，避免壓傷果肉。" },
      { type: "h2", text: "4. 掂重量：同樣大小，選比較重的" },
      { type: "p", text: "拿兩顆差不多大的芒果比較，手感比較沉的通常水分和果肉比較飽滿。" },
      { type: "h2", text: "5. 看蒂頭：飽滿、不凹陷" },
      { type: "p", text: "蒂頭周圍飽滿、略為隆起的果實，代表在樹上發育完整。蒂頭明顯凹陷或周圍乾縮的，可能放置太久。" },
      { type: "quote", text: "外表的小黑點、小斑痕其實不影響風味，那是果實在戶外經歷風雨的痕跡。" },
      { type: "p", text: "記住這五個重點，下次逛市場時試試看吧。當然，如果想省下挑選的功夫，也可以直接交給我們——每一顆出貨前，都會經過這五道檢查。" },
    ],
  },
  {
    slug: "ripening-and-storage",
    title: "芒果買回家，先別急著冰",
    excerpt: "常溫催熟、冷藏保鮮、冷凍做冰——三個階段的保存方法，讓每一顆芒果都在最好吃的時候入口。",
    category: "保存方法",
    date: "2026-10-22",
    readMinutes: 3,
    cover: "/images/mango-cut.jpg",
    coverAlt: "切成花狀的芒果果肉",
    body: [
      { type: "p", text: "很多人一買回芒果就直接放進冰箱，結果放了好幾天還是硬硬的、甜度也上不來。其實芒果是「採收後還會繼續熟成」的水果，保存的關鍵在於分階段處理。" },
      { type: "h2", text: "階段一：常溫熟成" },
      { type: "p", text: "還沒完全熟的芒果，請放在陰涼通風處，避免陽光直射。一般大約 2–4 天，等到果皮微微變軟、散發香氣，就是最佳賞味時機。" },
      { type: "list", items: ["不要堆疊擺放，避免壓傷", "可以用報紙輕輕包覆，讓熟成更均勻", "每天檢查一次，先熟的先吃"] },
      { type: "h2", text: "階段二：熟了再冷藏" },
      { type: "p", text: "芒果熟了之後，再放進冰箱冷藏，可以延緩繼續熟化。建議用保鮮袋或紙袋裝好，避免吸附冰箱異味，並在 3 天內吃完。" },
      { type: "quote", text: "未熟的芒果放進冰箱，低溫會讓熟成停擺，甚至造成果皮出現黑斑、果肉無法變甜。" },
      { type: "h2", text: "階段三：吃不完就冷凍" },
      { type: "p", text: "一次買太多也不用擔心。把熟透的芒果去皮切塊，平鋪在保鮮盒裡冷凍，就是現成的芒果冰。想吃的時候拿出來稍微退冰，或是直接打成冰沙都很適合。" },
      { type: "p", text: "冷凍芒果建議在一個月內吃完，風味最好。" },
    ],
  },
  {
    slug: "a-year-in-the-orchard",
    title: "從開花到採收：一顆芒果的一年",
    excerpt: "我們吃到的每一顆芒果，都在樹上走過將近半年。跟著果園的時序，看看一年裡發生了什麼事。",
    category: "果園日誌",
    date: "2026-09-30",
    readMinutes: 5,
    cover: "/images/mango-tree.jpg",
    coverAlt: "掛在枝頭、帶著水珠的芒果",
    body: [
      { type: "p", text: "夏天吃到的那一口甜，其實從前一年的秋天就開始準備了。以下是果園裡一整年的節奏，實際時間會隨每年天氣略有不同。" },
      { type: "h2", text: "秋季（9–11 月）：修剪與養樹" },
      { type: "p", text: "採收結束後，第一件事是修剪枝條，讓陽光和空氣能照進樹冠內部。接著施肥、照顧土壤，讓果樹在入冬前長出健康的新枝，為隔年開花儲備養分。" },
      { type: "h2", text: "冬季（12–2 月）：等待開花" },
      { type: "p", text: "天氣轉涼、雨量變少，是芒果樹開始花芽分化的時候。到了年底與初春，枝頭會冒出一串串細小的花穗，整個果園都是淡淡的花香。" },
      { type: "h2", text: "春季（3–4 月）：結果與套袋" },
      { type: "p", text: "花謝之後，小小的果實開始成形。一串花穗最後通常只會留下少數幾顆果實，我們會再做疏果，讓養分集中。果實長到一定大小時，會一顆顆套上紙袋，保護果皮不受蟲害與風雨摩擦。" },
      { type: "quote", text: "套袋是整年最累的工作之一：每一顆果實，都要人工一顆顆套上。" },
      { type: "h2", text: "夏季（5–8 月）：採收" },
      { type: "p", text: "終於到了收成的季節。我們每天巡園，觀察果皮轉色與果實的飽滿度，只採收在樹上熟成到位的芒果。採下來的果實當天就會挑選、分級、裝箱。" },
      { type: "p", text: "採收季一結束，果園又會回到秋天的修剪，開始下一輪的循環。下次吃芒果的時候，也許可以想想它在樹上度過的這半年。" },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
}
