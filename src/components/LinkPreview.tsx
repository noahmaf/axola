import { useMemo, useState } from "react";

/** Build a list of favicon candidates for a given page URL, in priority order. */
function getFaviconCandidates(href: string, size = 64): string[] {
  let url: URL;
  try {
    url = new URL(href.startsWith("http") ? href : `https://${href}`);
  } catch {
    return [];
  }
  const origin = url.origin;
  const host = url.hostname;

  return [
    // Google S2 (stable and simple)
    `https://www.google.com/s2/favicons?sz=${size}&domain_url=${encodeURIComponent(origin)}`,

    // gstatic v2 (MUST be this exact path + params; older/short forms 404)
    `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=${encodeURIComponent(origin)}&size=${size}`,

    // DuckDuckGo cache
    `https://icons.duckduckgo.com/ip3/${host}.ico`,

    // Site default path
    `https://${host}/favicon.ico`,

    // Clearbit Logos (public but rate-limited; last resort)
    `https://logo.clearbit.com/${host}`,
  ];
}

/** Small <img> that walks through candidates until one loads. */
function Favicon({ pageUrl, size = 16, className }: { pageUrl: string; size?: number; className?: string }) {
  const candidates = useMemo(() => getFaviconCandidates(pageUrl, Math.max(size, 32)), [pageUrl, size]);
  const [idx, setIdx] = useState(0);

  if (!candidates.length) {
    return <div style={{ width: size, height: size }} className="rounded-sm bg-gray-300 shrink-0" />;
  }

  const src = candidates[Math.min(idx, candidates.length - 1)];

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={className ?? "shrink-0"}
      onError={() => {
        if (idx < candidates.length - 1) setIdx((n) => n + 1);
        else setIdx(idx); // stick on last; shows broken img but we keep layout
      }}
    />
  );
}

export function LinkPreview({ url, title }: { url: string; title?: string }) {
  const { host, displayUrl } = useMemo(() => {
    try {
      const u = new URL(url);
      return { host: u.hostname, displayUrl: url };
    } catch {
      return { host: url, displayUrl: url };
    }
  }, [url]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-md border p-2 hover:bg-gray-50"
    >
      <Favicon pageUrl={url} size={16} />

      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{title ?? host}</div>
        <div className="text-xs text-gray-500 truncate">{displayUrl}</div>
      </div>
    </a>
  );
}

export default LinkPreview;
