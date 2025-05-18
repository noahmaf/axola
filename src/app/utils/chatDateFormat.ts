import { format, differenceInDays } from "date-fns";

export function formatChatTimestamp(dateString: string) {
  const date = new Date(dateString); // Convert to Date object
  const now = new Date();
  const daysDiff = differenceInDays(now, date);

  if (daysDiff === 0) {
    return format(date, "HH:mm"); // Show only time (e.g., "14:35")
  } else if (daysDiff === 1) {
    return "Yesterday";
  } else if (daysDiff <= 7) {
    return format(date, "EEEE"); // Show weekday name (e.g., "Monday")
  } else {
    return format(date, "dd/MM/yyyy"); // Show full date (e.g., "25/02/2025")
  }
}
