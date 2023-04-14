export const twitterNumberFormat = (n: number) => {
  const suffixes = ["", "K", "M", "B", "T"];
  const decimalPlaces = 1;

  if (n < 1000) {
    return n.toString();
  }

  const exponent = Math.floor(Math.log10(n) / 3);
  const value = n / Math.pow(1000, exponent);

  return suffixes[exponent]
    ? `${value.toFixed(decimalPlaces)} ${suffixes[exponent]}`
    : value.toFixed(decimalPlaces);
};

export const twitterFromNowFormat = (isoDate: string) => {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 0) throw new Error("Date cannot be in the future.");
  if (seconds < 30) return "now";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

export const getNameInitials = (fullName: string) =>
  fullName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();
