export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
}

export function numberToWords(num: number): string {
  if (num === 0) return "Zero Naira Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function helper(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
    if (n < 1000000) return helper(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? (n % 1000 < 100 ? " and " : ", ") + helper(n % 1000) : "");
    if (n < 1000000000) return helper(Math.floor(n / 1000000)) + " Million" + (n % 1000000 !== 0 ? (n % 1000000 < 100 ? " and " : ", ") + helper(n % 1000000) : "");
    return helper(Math.floor(n / 1000000000)) + " Billion" + (n % 1000000000 !== 0 ? (n % 1000000000 < 100 ? " and " : ", ") + helper(n % 1000000000) : "");
  }

  const words = helper(Math.floor(num));
  return `${words} Naira Only`;
}

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) {
    return trimmed;
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

export function getYouTubeThumbnail(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

export function getAttachmentUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("http://localhost") || trimmed.startsWith("https://localhost")) {
    return trimmed;
  }
  // Route through our own server-side proxy to force a real download for external URLs
  return `/api/download?url=${encodeURIComponent(trimmed)}`;
}


