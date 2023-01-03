const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDate = (value) => {
  if (!value) {
    return "";
  }
  const dt = new Date(value);
  return (
    days[dt.getDay()] +
    ", " +
    months[dt.getMonth()] +
    " " +
    dt.getDate() +
    ", " +
    dt.getFullYear()
  );
};
