export const getTodayKey = () => {
  const today = new Date();
  return `ll-snapshot-${today.toISOString().slice(0, 10)}`;
};

export const saveSnapshot = (snapshot) => {
  const key = getTodayKey();
  localStorage.setItem(key, JSON.stringify(snapshot));
};

export const loadSnapshot = (date) => {
  const key = `ll-snapshot-${date}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const getAllSnapshotKeys = () => {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('ll-snapshot-'))
    .sort();
};
