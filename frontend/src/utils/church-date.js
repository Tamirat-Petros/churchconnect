const TIME_ZONE = "Africa/Addis_Ababa";

export function formatChurchDate(value, calendar = "gregory") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";

  try {
    return new Intl.DateTimeFormat(calendar === "ethiopic" ? "am-ET" : "en-ET", {
      calendar,
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: TIME_ZONE
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-ET", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: TIME_ZONE
    }).format(date);
  }
}

export function formatChurchDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  const dateLabel = new Intl.DateTimeFormat("en-ET", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-ET", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE
  }).format(date);
  return `${dateLabel} · ${timeLabel} EAT`;
}

export function formatChurchTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${new Intl.DateTimeFormat("en-ET", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TIME_ZONE
  }).format(date)} EAT`;
}
