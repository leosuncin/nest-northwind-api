export function roundDateToDay(date?: Date): Date | undefined {
  if (!date) return;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
