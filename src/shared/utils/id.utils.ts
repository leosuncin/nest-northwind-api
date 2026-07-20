export function isId<Entity extends { id: unknown }>(
  value: unknown,
): value is Entity['id'] {
  if (typeof value === 'string' && /\d+/.test(value)) {
    return true;
  }

  if (typeof value === 'number' && Number.isInteger(value)) {
    return true;
  }

  return false;
}
