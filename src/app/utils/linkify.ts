export type Segment =
  | { type: "text"; value: string }
  | { type: "link"; value: string };

/**
 * URL matcher that avoids trailing punctuation like ')', ',', '.'
 * and allows optional protocol.
 */
const URL_REGEX =
  /\b((?:https?:\/\/)?(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:[/?#][^\s)]*)?)/gi;

/** Add https:// if missing and trim trailing punctuation that often follows links. */
function normalizeUrl(raw: string): string {
  const cleaned = raw.replace(/[),.]+$/, ""); // strip ) , .
  return cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
}

/** Splits a message into text and link segments */
export function splitMessageIntoSegments(message: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(message)) !== null) {
    const start = match.index;
    const end = start + match[0].length;

    if (start > lastIndex) {
      segments.push({ type: "text", value: message.slice(lastIndex, start) });
    }

    const href = normalizeUrl(match[0]);
    segments.push({ type: "link", value: href });
    lastIndex = end;
  }

  if (lastIndex < message.length) {
    segments.push({ type: "text", value: message.slice(lastIndex) });
  }

  return segments;
}

/** Extracts all URLs from a message (deduped) */
export function extractUrls(message: string): string[] {
  const set = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = URL_REGEX.exec(message)) !== null) {
    set.add(normalizeUrl(match[0]));
  }

  return Array.from(set);
}
