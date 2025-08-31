import {
  format,
  isAfter,
  isSameDay,
  differenceInCalendarDays,
} from "date-fns";

export function formatChatTimestamp(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffDays = differenceInCalendarDays(now, date);

  // Any future timestamp (including later today) → full date & time
  if (diffDays < 0 || (diffDays === 0 && isAfter(date, now))) {
    return format(date, "dd/MM/yyyy, HH:mm");
  }

  if (diffDays === 0 && isSameDay(date, now)) {
    return `Today, ${format(date, "HH:mm")}`;
  }

  if (diffDays === 1) {
    return `Yesterday, ${format(date, "HH:mm")}`;
  }

  if (diffDays <= 7) {
    return `${format(date, "EEEE")}, ${format(date, "HH:mm")}`;
  }

  return format(date, "dd/MM/yyyy, HH:mm");
}
