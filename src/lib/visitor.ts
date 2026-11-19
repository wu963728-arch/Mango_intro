"use client";

import { useSyncExternalStore } from "react";

// 訪客稱呼
// - 輸入的名稱會存進 localStorage → 下次進來直接顯示，不再詢問
// - 按「略過」只記在記憶體 → 本次瀏覽不再問，下次進來會再問
// 所有元件透過 useVisitor() 同步讀取

const KEY = "geshi-visitor-name";
const CHANGE = "geshi-visitor-change";
const OPEN = "geshi-visitor-open";

export const NAME_MAX = 12;

type Stored = { name: string } | { skipped: true };

let memory: string | null = null;
let loaded = false;

function readRaw(): string | null {
  // 第一次讀取時，從 localStorage 取回上次輸入的名稱
  if (!loaded) {
    loaded = true;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) memory = JSON.stringify({ name: saved });
    } catch {
      /* localStorage 不能用（例如部分無痕模式）就當作沒存過 */
    }
  }
  return memory;
}

function writeRaw(value: Stored) {
  memory = JSON.stringify(value);
  if ("name" in value) {
    try {
      localStorage.setItem(KEY, value.name);
    } catch {
      /* 存不了就只留在記憶體 */
    }
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    // 其他分頁改了名稱也同步
    if (e.key === KEY) {
      memory = e.newValue ? JSON.stringify({ name: e.newValue }) : null;
      cb();
    }
  };
  window.addEventListener(CHANGE, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useVisitor() {
  // 伺服器端回傳 undefined = 還不知道（避免畫面先閃一下視窗）
  const raw = useSyncExternalStore(subscribe, readRaw, () => undefined);

  if (raw === undefined) return { ready: false, name: "", skipped: false };

  let data: Partial<{ name: string; skipped: boolean }> = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {};
  }
  return { ready: true, name: data.name ?? "", skipped: Boolean(data.skipped) };
}

export function saveName(name: string) {
  writeRaw({ name: name.trim().slice(0, NAME_MAX) });
}

export function skipName() {
  writeRaw({ skipped: true });
}

/** 讓歡迎視窗再打開一次（例如按「更改」） */
export function openWelcome() {
  window.dispatchEvent(new Event(OPEN));
}

export const WELCOME_OPEN_EVENT = OPEN;
