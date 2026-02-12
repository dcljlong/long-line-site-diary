export function newId(prefix = '') {
  const id = crypto.randomUUID();
  return prefix ? (prefix + '-' + id) : id;
}
