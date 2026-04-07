function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
function nullToEmptyString(arg) {
  return arg ?? "";
}

export { formatDate as f, nullToEmptyString as n };
