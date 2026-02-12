// src/utils/backup.js
//
// Exports/imports ALL Long Line Site Diary localStorage keys (prefix-based).
// Current convention: keys start with "ll-".

const KEY_PREFIXES = ["ll-"];
const SCHEMA_VERSION = "1.0.0";
const APP_ID = "LongLineSiteDiary";

function isAppKey(k) {
  return KEY_PREFIXES.some((p) => k.startsWith(p));
}

function listAppKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (isAppKey(k)) keys.push(k);
  }
  keys.sort();
  return keys;
}

export function exportAppData() {
  const keys = listAppKeys();

  const payload = {
    app: APP_ID,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    keys,
    data: {}
  };

  keys.forEach((key) => {
    const raw = localStorage.getItem(key);

    if (raw == null || raw === "") {
      payload.data[key] = null;
      return;
    }

    // Prefer JSON, but allow plain strings for forward compatibility
    try {
      payload.data[key] = JSON.parse(raw);
    } catch {
      payload.data[key] = raw;
    }
  });

  return payload;
}

export function downloadBackupFile() {
  const data = exportAppData();

  const safeTs = new Date().toISOString().replaceAll(":", "-");
  const filename = `LLSD_Backup_${safeTs}.json`;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAppData(fileContent, { mode = "replace" } = {}) {
  let parsed;

  try {
    parsed = JSON.parse(fileContent);
  } catch {
    throw new Error("Invalid JSON file.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid backup format.");
  }

  if (parsed.app !== APP_ID) {
    throw new Error("Invalid backup source.");
  }

  if (!parsed.schemaVersion) {
    throw new Error("Missing schema version.");
  }

  if (!parsed.data || typeof parsed.data !== "object") {
    throw new Error("Backup missing data section.");
  }

  const incomingKeys = Array.isArray(parsed.keys) ? parsed.keys : Object.keys(parsed.data);
  const appIncomingKeys = incomingKeys.filter((k) => typeof k === "string" && isAppKey(k)).sort();

  if (mode === "replace") {
    // remove existing app keys first to prevent stale leftovers
    listAppKeys().forEach((k) => localStorage.removeItem(k));
  }

  appIncomingKeys.forEach((key) => {
    const value = parsed.data[key];

    // null means "present but empty" in export; store as empty array/object? keep as null JSON.
    if (value === null || value === undefined) {
      localStorage.setItem(key, "");
      return;
    }

    if (typeof value === "string") {
      localStorage.setItem(key, value);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  });

  return { importedKeys: appIncomingKeys.length };
}
