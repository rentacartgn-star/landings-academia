// [A4] Día natural en Madrid (YYYY-MM-DD). Misma frontera que el rollup SQL. Sin dependencias de servidor.
export function madridDayPure(d = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
