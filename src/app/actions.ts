"use server";

import { randomInt } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type WaitlistState = {
  status: "idle" | "success" | "duplicate" | "error";
  message: string;
};

type Entry = { email: string; interest: string; createdAt: string };

// 名單存在專案根目錄的 data/waitlist.json（只適合本機練習，正式上線請改用資料庫或 Google Sheet 等服務）
const FILE = path.join(process.cwd(), "data", "waitlist.json");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function readList(): Promise<Entry[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Entry[];
  } catch {
    return [];
  }
}

export async function joinWaitlist(_prev: WaitlistState, formData: FormData): Promise<WaitlistState> {
  // 防機器人：真人看不到這個欄位，有填就當作垃圾訊息
  if (formData.get("company")) {
    return { status: "success", message: "已收到！" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const interest = String(formData.get("interest") ?? "").slice(0, 50);

  if (!EMAIL_RE.test(email) || email.length > 200) {
    return { status: "error", message: "Email 格式好像不太對，再檢查一下？" };
  }

  const list = await readList();
  if (list.some((e) => e.email === email)) {
    return { status: "duplicate", message: "這個 Email 已經在名單裡了，開賣時一定通知你！" };
  }

  list.push({ email, interest, createdAt: new Date().toISOString() });
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(list, null, 2), "utf8");

  return { status: "success", message: "登記成功！開賣前會第一個寄信通知你。" };
}

/* ───────── 抽獎：10% 機率中「芒果 9 折優惠券」 ───────── */

export type DrawResult = { win: true; code: string } | { win: false };

const WIN_RATE = 10; // 百分比
const COUPON_FILE = path.join(process.cwd(), "data", "coupons.json");
// 不含容易看錯的 0/O、1/I/L
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

type Coupon = { code: string; discount: "90%"; createdAt: string; used: boolean };

export async function drawLottery(): Promise<DrawResult> {
  // 在伺服器端決定結果，使用者無法從瀏覽器竄改機率
  const win = randomInt(100) < WIN_RATE;
  if (!win) return { win: false };

  let coupons: Coupon[] = [];
  try {
    coupons = JSON.parse(await readFile(COUPON_FILE, "utf8")) as Coupon[];
  } catch {
    coupons = [];
  }

  // 產生不重複的優惠碼，例如 MANGO-7KQ2XH
  let code: string;
  do {
    code = "MANGO-" + Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
  } while (coupons.some((c) => c.code === code));

  coupons.push({ code, discount: "90%", createdAt: new Date().toISOString(), used: false });
  await mkdir(path.dirname(COUPON_FILE), { recursive: true });
  await writeFile(COUPON_FILE, JSON.stringify(coupons, null, 2), "utf8");

  return { win: true, code };
}
