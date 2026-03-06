function formatDate(dateStr) {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}
function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}
function nullToEmptyString(arg) {
  return arg ?? "";
}

export { formatAmount as a, formatDate as f, nullToEmptyString as n };
