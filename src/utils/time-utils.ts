import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Defina o fuso horário padrão da aplicação
const defaultTimezone = "America/Sao_Paulo";

export function getNow(): Date {
  return dayjs().tz(defaultTimezone).toDate();
}

export function addDays(date: Date, days: number): Date {
  return dayjs(date).add(days, "day").toDate();
}

export function isBefore(date: Date, compareDate: Date): boolean {
  return dayjs(date).isBefore(compareDate);
}

export function isAfter(date: Date, compareDate: Date): boolean {
  return dayjs(date).isAfter(compareDate);
}

export function isSameDay(date: Date, compareDate: Date): boolean {
  return dayjs(date).isSame(compareDate, "day");
}

export function get7DaysFromNow(): Date {
  return addDays(getNow(), 7);
}

export function get1HourFromNow(): Date {
  return dayjs().add(1, "hour").toDate();
}

export function oneHour() {
  return 1000 * 60 * 60;
}
