const normalizeDateString = (dateString: string): string => {
  const parts = dateString.split(" ");
  if (parts.length !== 2) {
    return dateString;
  }
  const [datePart, timeWithTZ] = parts;
  const timePart = timeWithTZ.split("+")[0];
  return `${datePart}T${timePart}Z`;
};

export const formatDateTime = (dateString: string) => {
  const normalizedDate = normalizeDateString(dateString);

  const date = new Date(normalizedDate);
  if (isNaN(date.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const [day, month, year] = formattedDate.split(" ");
  return `${day} ${month} ${year} - ${formattedTime}`;
};

export const formatTime = (dateString: string) => {
  const normalizedDate = normalizeDateString(dateString);

  const date = new Date(normalizedDate);
  if (isNaN(date.getTime())) return "Invalid Date";

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return formattedTime;
};
