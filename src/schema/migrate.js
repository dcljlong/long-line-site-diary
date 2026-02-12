import { SCHEMA_VERSION } from './schema';

const KEY_VERSION = 'll-schema-version';
const KEY_SITES = 'll-sites';
const KEY_TASKS = 'll-tasks';

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse(raw, fallback) {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeSite(s) {
  const safe = (s && typeof s === 'object') ? s : {};
  const jobNumber = String(safe.jobNumber || safe.job_number || '').trim();
  const name = String(safe.name || '').trim();

  const projectAddress = String(
    safe.projectAddress || safe.project_address || safe.address || ''
  ).trim();

  const mainContractor = String(
    safe.mainContractor || safe.main_contractor || safe.mainContractorName || ''
  ).trim();

  const stRaw = String(safe.status || '').trim();
  const st = stRaw ? stRaw : 'Active';

  return {
    ...safe,
    id: safe.id || crypto.randomUUID(),
    jobNumber,
    name,
    projectAddress,
    address: projectAddress, // back-compat alias
    mainContractor,
    mainContractorName: mainContractor, // back-compat alias
    status: st,
    description: String(safe.description || '').trim(),
    createdAt: safe.createdAt || safe.created_at || nowIso(),
    updatedAt: nowIso(),
  };
}

function normalizeTask(t) {
  const safe = (t && typeof t === 'object') ? t : {};
  const statusRaw = String(safe.status || '').toLowerCase().trim();

  const completedBool = !!(safe.completed || safe.done || safe.isDone);
  const status =
    statusRaw === 'planned' || statusRaw === 'active' || statusRaw === 'complete'
      ? statusRaw
      : (completedBool ? 'complete' : 'active');

  const prRaw = String(safe.priority || '').toLowerCase().trim();
  const priority =
    prRaw === 'urgent' || prRaw === 'high' || prRaw === 'normal'
      ? (prRaw === 'high' ? 'high' : prRaw)
      : 'normal';

  const startDate = safe.startDate || safe.start_date || safe.start || null;
  const dueDate = safe.dueDate || safe.due_date || safe.due || safe.date || null;

  const durationDays =
    (safe.durationDays ?? safe.duration_days ?? safe.duration ?? safe.days) ?? null;

  const siteId = safe.siteId || safe.site_id || safe.jobId || safe.job_id || safe.site || null;

  return {
    ...safe,
    id: safe.id || ('t' + Date.now()),
    siteId: siteId || null,
    title: String(safe.title || safe.name || '').trim(),
    status,
    priority,
    startDate: startDate || null,
    dueDate: dueDate || null,
    durationDays: (durationDays === null || durationDays === undefined) ? null : Number(durationDays),
    createdAt: safe.createdAt || safe.created_at || nowIso(),
    updatedAt: nowIso(),
  };
}

export function preflightMigrateLocalStorage() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const vRaw = window.localStorage.getItem(KEY_VERSION);
  const current = Number(vRaw || '0') || 0;

  if (current >= SCHEMA_VERSION) return;

  const sitesRaw = window.localStorage.getItem(KEY_SITES);
  const tasksRaw = window.localStorage.getItem(KEY_TASKS);

  const sites = Array.isArray(safeJsonParse(sitesRaw, [])) ? safeJsonParse(sitesRaw, []) : [];
  const tasks = Array.isArray(safeJsonParse(tasksRaw, [])) ? safeJsonParse(tasksRaw, []) : [];

  const sitesNext = (sites || []).map(normalizeSite);
  const tasksNext = (tasks || []).map(normalizeTask);

  window.localStorage.setItem(KEY_SITES, JSON.stringify(sitesNext));
  window.localStorage.setItem(KEY_TASKS, JSON.stringify(tasksNext));
  window.localStorage.setItem(KEY_VERSION, String(SCHEMA_VERSION));
}
