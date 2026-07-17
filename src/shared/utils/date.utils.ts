export function roundDateToDay(date?: Date): Date | undefined {
  if (!date) return;

  return new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
}
