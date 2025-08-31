// src/pages/Reports.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// shadcn/ui
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// recharts
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";

// helpers
const asset = (p: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${p.replace(/^\//, "")}`;


// ---------- Types ----------
type LoginRecord = { at: string | Date };
type ChatRow = { at: string | Date; category: string; status?: string };
type View = "yearly" | "weekly" | "daily";

// ---------- CSV paths ----------
const LOGINS_CSV_URL = asset("daily_activity_logs_rows.csv"); // -> public/daily_activity_logs_rows.csv
const CHATS_CSV_URL  = asset("chats_rows.csv");               // -> public/chats_rows.csv


// ---------- Colors / Sizes ----------
const MONTH_COLORS = [
  "#ef4444","#f97316","#f59e0b","#eab308",
  "#84cc16","#22c55e","#14b8a6","#06b6d4",
  "#3b82f6","#6366f1","#a855f7","#ec4899",
];
const PRIMARY = "#2563eb";
const DOT_R_YEARLY = 5;
const DOT_R_OTHER = 4.5;
const LINE_WIDTH = 3;

// Category palette (for chats line chart)
const CAT_COLORS = [
  "#f59e0b","#10b981","#3b82f6","#ef4444","#a855f7",
  "#14b8a6","#06b6d4","#84cc16","#eab308","#6366f1",
  "#ec4899","#f97316","#0ea5e9","#22c55e","#f43f5e",
];

// Status colors (Pie)
const STATUS_COLORS: Record<string, string> = {
  "New": "#64748b",
  "In Progress": "#f59e0b",
  "Pending Resolve": "#f97316",
  "Resolved": "#10b981",
};

// ---------- Utils ----------
function buildPalette(n: number): string[] {
  if (n <= 0) return [];
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const hue = Math.round((i / Math.max(1, n - 1)) * 300);
    out.push(`hsl(${hue} 80% 50%)`);
  }
  return out;
}
const toDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  const delta = (day + 6) % 7; // Monday start
  x.setDate(x.getDate() - delta);
  return x;
}
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addWeeks = (d: Date, n: number) => addDays(d, n * 7);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function formatWeekRange(start: Date, end?: Date) {
  const e = end ?? addDays(start, 6);
  const sm = start.toLocaleString("default", { month: "short" });
  const em = e.toLocaleString("default", { month: "short" });
  const sd = start.getDate();
  const ed = e.getDate();
  return sm === em ? `${sm} ${sd} – ${ed}` : `${sm} ${sd} – ${em} ${ed}`;
}
function hourLabel12(h: number) {
  const suffix = h < 12 ? "AM" : "PM";
  const base = h % 12 === 0 ? 12 : h % 12;
  return `${base} ${suffix}`;
}
const monthShort = (m: number) => new Date(2000, m, 1).toLocaleString("default", { month: "short" });

// ---------- CSV loaders ----------
async function loadLoginsCsv(url: string): Promise<LoginRecord[]> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const createdIdx = header.findIndex((h) => h === "created_at");
  if (createdIdx === -1) return [];
  const out: LoginRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const created = cols[createdIdx]?.trim();
    if (created) out.push({ at: created });
  }
  return out;
}
async function loadChatsCsv(url: string): Promise<ChatRow[]> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const createdIdx = header.findIndex((h) => h === "created_at");
  const categoryIdx = header.findIndex((h) => h === "category");
  const statusIdx = header.findIndex((h) => h === "status");
  if (createdIdx === -1 || categoryIdx === -1) return [];
  const out: ChatRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const created = cols[createdIdx]?.trim();
    const category = (cols[categoryIdx] ?? "").trim() || "Uncategorized";
    const status = statusIdx !== -1 ? (cols[statusIdx] ?? "").trim() : undefined;
    if (created) out.push({ at: created, category, status });
  }
  return out;
}

// ---------- Buckets (shared) ----------
function bucketsYear(anchor: Date, today: Date) {
  const year = anchor.getFullYear();
  const lastMonthIdx = year === today.getFullYear() ? today.getMonth() : 11;
  const arr = [];
  for (let m = 0; m <= lastMonthIdx; m++) {
    const start = new Date(year, m, 1);
    arr.push({
      key: start,
      name: monthShort(m),
      _rangeStart: start,
      _rangeEnd: endOfMonth(start),
      monthIndex: m,
    });
  }
  return arr;
}
function bucketsWeek(anchor: Date, today: Date) {
  const weekStart = startOfWeek(new Date(Math.min(+anchor, +today)));
  const arr: any[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    if (+d > +today) break; // no future
    arr.push({
      key: d,
      name: d.toLocaleDateString(undefined, { weekday: "short" }),
      _rangeStart: startOfDay(d),
      _rangeEnd: endOfDay(d),
    });
  }
  return arr;
}
function bucketsDay(anchor: Date, today: Date) {
  const day = startOfDay(new Date(Math.min(+anchor, +today)));
  const isToday = sameDay(day, today);
  const lastHour = isToday ? new Date().getHours() : 23;
  const arr = [];
  for (let h = 0; h <= lastHour; h++) {
    const hs = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h);
    const he = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, 59, 59, 999);
    arr.push({ key: hs, name: hourLabel12(h), _rangeStart: hs, _rangeEnd: he });
  }
  return arr;
}

// Range helper for windows
// function currentWindowRange(view: View, anchor: Date, today: Date): { start: Date; end: Date } {
//   if (view === "yearly") {
//     const months = bucketsYear(anchor, today);
//     const endIdx = months.length - 1;
//     return { start: months[0]._rangeStart, end: months[endIdx]._rangeEnd };
//   }
//   if (view === "weekly") {
//     const days = bucketsWeek(anchor, today);
//     const endIdx = days.length - 1;
//     return { start: days[0]._rangeStart, end: days[endIdx]._rangeEnd };
//   }
//   const hours = bucketsDay(anchor, today);
//   const endIdx = hours.length - 1;
//   return { start: hours[0]._rangeStart, end: hours[endIdx]._rangeEnd };
// }

// ---------- Login bucketing (Chart 1) ----------
function bucketizeLogins(records: LoginRecord[], view: View, anchor: Date, today: Date) {
  if (view === "yearly") {
    const buckets = bucketsYear(anchor, today);
    const data = buckets.map((b) => ({
      name: b.name, logins: 0, monthIndex: b.monthIndex, _rangeStart: b._rangeStart, _rangeEnd: b._rangeEnd,
    }));
    for (const r of records) {
      const t = toDate(r.at);
      if (t.getFullYear() !== anchor.getFullYear()) continue;
      const m = t.getMonth();
      if (m <= buckets.length - 1) data[m].logins += 1;
    }
    return data;
  }
  if (view === "weekly") {
    const buckets = bucketsWeek(anchor, today);
    const data = buckets.map((b) => ({ name: b.name, logins: 0, _rangeStart: b._rangeStart, _rangeEnd: b._rangeEnd }));
    for (const r of records) {
      const t = toDate(r.at);
      for (let i = 0; i < buckets.length; i++) {
        const b = buckets[i];
        if (sameDay(startOfDay(t), startOfDay(b.key))) { data[i].logins += 1; break; }
      }
    }
    return data;
  }
  const buckets = bucketsDay(anchor, today);
  const data = buckets.map((b) => ({ name: b.name, logins: 0, _rangeStart: b._rangeStart, _rangeEnd: b._rangeEnd }));
  for (const r of records) {
    const t = toDate(r.at);
    if (!sameDay(t, buckets[0].key)) continue;
    const h = t.getHours();
    if (h >= 0 && h < data.length) data[h].logins += 1;
  }
  return data;
}

// ---------- Chats bucketing for Chart 2 (fixed to current YEAR) ----------
function bucketizeChatsYearToDate(rows: ChatRow[], year: number, today: Date) {
  const categories = Array.from(new Set(rows.map(r => r.category)));
  const months = bucketsYear(new Date(year, 0, 1), today);
  const data = months.map((b) => {
    const point: Record<string, any> = { name: b.name, _rangeStart: b._rangeStart, _rangeEnd: b._rangeEnd };
    for (const c of categories) point[c] = 0;
    return point;
  });
  for (const r of rows) {
    const t = toDate(r.at);
    if (t.getFullYear() !== year) continue;
    const m = t.getMonth();
    if (m <= data.length - 1) data[m][r.category] += 1;
  }
  return { data, categories, months };
}

// ---------- Tooltips ----------
const LoginTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    const v = p?.value as number;
    const monthIdx = typeof p?.payload?.monthIndex === "number" ? p.payload.monthIndex : null;
    const paletteColor = p?.payload?.__color as string | undefined;
    const color = monthIdx !== null ? MONTH_COLORS[monthIdx] : paletteColor || PRIMARY;
    return (
      <div className="rounded-md border bg-white px-3 py-2 text-popover-foreground shadow-sm">
        <div className="text-xs opacity-70">{label}</div>
        <div className="text-sm font-semibold" style={{ color }}>{v} logins</div>
      </div>
    );
  }
  return null;
};
const ChatsTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-white px-3 py-2 text-popover-foreground shadow-sm">
        <div className="text-xs opacity-70">{label}</div>
        <div className="text-xs mt-1 space-y-0.5">
          {payload.map((p: any, i: number) => (
            <div key={i} style={{ color: p.color }}>
              <span className="font-medium">{p.name}</span>: {p.value}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// ---------- Dots ----------
const YearlyDot = (props: any) => {
  const { cx, cy, payload } = props;
  const idx = typeof payload?.monthIndex === "number" ? payload.monthIndex : null;
  const fill = idx !== null ? MONTH_COLORS[idx] : PRIMARY;
  return <circle cx={cx} cy={cy} r={DOT_R_YEARLY} fill={fill} stroke="#fff" strokeWidth={1.5} />;
};
const PaletteDot = (props: any) => {
  const { cx, cy, payload } = props;
  const fill = payload?.__color || PRIMARY;
  return <circle cx={cx} cy={cy} r={DOT_R_OTHER} fill={fill} stroke="#fff" strokeWidth={1.5} />;
};

// ---- Custom clickable legend for chats (with per-category counts) ----
type ChatsLegendProps = {
  categories: string[];
  colors: Record<string, string>;
  hidden: Set<string>;
  totals: Record<string, number>;
  onToggle: (key: string) => void;
};
const ChatsLegend: React.FC<ChatsLegendProps> = ({ categories, colors, hidden, totals, onToggle }) => {
  if (!categories.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2">
      {categories.map((cat) => {
        const isHidden = hidden.has(cat);
        const color = colors[cat];
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onToggle(cat)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition
              ${isHidden ? "opacity-50" : "opacity-100"} hover:bg-black/5 dark:hover:bg-white/10`}
            aria-pressed={!isHidden}
            title={isHidden ? `Show ${cat}` : `Hide ${cat}`}
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">{cat}</span>
            <span className="ml-1 font-semibold" style={{ color }}>{totals[cat] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
};

// ---- Custom legend for Pie (status + number) ----
type PieLegendProps = {
  data: { name: string; value: number }[];
  colors: Record<string, string>;
};
const PieLegend: React.FC<PieLegendProps> = ({ data, colors }) => {
  if (!data.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-2">
      {data.map((d) => (
        <div key={d.name} className="inline-flex items-center gap-2 text-sm">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors[d.name] || "#94a3b8" }} />
          <span className="font-medium">{d.name}</span>
          <span className="ml-1 font-semibold" style={{ color: colors[d.name] || "#94a3b8" }}>
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ---------- Reports Page ----------
const Reports: React.FC = () => {
  const today = React.useMemo(() => new Date(), []);

  // Load CSVs
  const [loginRows, setLoginRows] = React.useState<LoginRecord[]>([]);
  const [chatRows, setChatRows] = React.useState<ChatRow[]>([]);
  React.useEffect(() => {
    loadLoginsCsv(LOGINS_CSV_URL).then(setLoginRows).catch(() => setLoginRows([]));
    loadChatsCsv(CHATS_CSV_URL).then(setChatRows).catch(() => setChatRows([]));
  }, []);

  // ===== Chart 1 controls (independent) =====
  const [view, setView] = React.useState<View>("yearly");
  const [anchor, setAnchor] = React.useState<Date>(today);

  const movePrev = () => {
    setAnchor((d) =>
      view === "yearly" ? addMonths(d, -12) :
      view === "weekly" ? addWeeks(d, -1) :
      addDays(d, -1)
    );
  };
  const moveNext = () => {
    setAnchor((d) => {
      const next =
        view === "yearly" ? addMonths(d, +12) :
        view === "weekly" ? addWeeks(d, +1) :
        addDays(d, +1);
      return new Date(Math.min(+next, +today));
    });
  };
  const nextDisabled = +startOfDay(anchor) >= +startOfDay(today);

  // ----- LOGIN CHART (Chart 1) -----
  const loginDataRaw = React.useMemo(
    () => bucketizeLogins(loginRows, view, anchor, today),
    [loginRows, view, anchor, today]
  );
  const loginPalette =
    view === "yearly" ? MONTH_COLORS : buildPalette(loginDataRaw.length || (view === "weekly" ? 7 : 24));
  const loginData = React.useMemo(
    () => loginDataRaw.map((d: any, i: number) => ({
      ...d,
      __color: view === "yearly" ? undefined : loginPalette[Math.min(i, loginPalette.length - 1)] || PRIMARY,
    })),
    [loginDataRaw, loginPalette, view]
  );
  const loginGradientStops =
    view === "yearly"
      ? MONTH_COLORS.map((c, i) => <stop key={i} offset={`${(i / 11) * 100}%`} stopColor={c} />)
      : loginPalette.map((c, i) => (
          <stop key={i} offset={`${(i / Math.max(1, loginPalette.length - 1)) * 100}%`} stopColor={c} />
        ));

  const loginHeaderRightLabel = React.useMemo(() => {
    if (view === "yearly") return `${anchor.getFullYear()}`;
    if (!loginData.length) return "";
    const first = loginData[0];
    const last = loginData[loginData.length - 1];
    if (view === "weekly") {
      const start = first._rangeStart as Date;
      const end = new Date(Math.min(+last._rangeEnd, +today));
      return formatWeekRange(start, end);
    }
    const day = first._rangeStart as Date;
    const m = day.toLocaleString("default", { month: "short" });
    return `${day.getDate()} ${m} ${day.getFullYear()}`;
  }, [loginData, view, anchor, today]);

  const totalLoginsInScope = React.useMemo(
    () => loginData.reduce((sum: number, d: any) => sum + (d.logins ?? 0), 0),
    [loginData]
  );

  // ===== Chart 2 (independent, fixed to current YEAR Jan..Dec YTD) =====
  const chart2Year = today.getFullYear();
  const {
    data: chatsYearData,
    categories: categories2,
  } = React.useMemo(
    () => bucketizeChatsYearToDate(chatRows, chart2Year, today),
    [chatRows, chart2Year, today]
  );
  const [hiddenCats2, setHiddenCats2] = React.useState<Set<string>>(new Set());
  const catColorMap2 = React.useMemo(() => {
    const map: Record<string, string> = {};
    categories2.forEach((c, i) => { map[c] = CAT_COLORS[i % CAT_COLORS.length]; });
    return map;
  }, [categories2]);
  const toggleCat2 = (key: string) => {
    setHiddenCats2((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const catTotalsYear = React.useMemo(() => {
    const totals: Record<string, number> = {};
    categories2.forEach((c) => (totals[c] = 0));
    chatsYearData.forEach((pt: any) => {
      categories2.forEach((c) => (totals[c] += pt[c] ?? 0));
    });
    return totals;
  }, [chatsYearData, categories2]);
  const totalChatsYear = React.useMemo(
    () => Object.values(catTotalsYear).reduce((a, b) => a + b, 0),
    [catTotalsYear]
  );

  // ===== Chart 3 (independent, current MONTH-to-date) =====
  const pieData = React.useMemo(() => {
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const counts: Record<string, number> = {
      "New": 0,
      "In Progress": 0,
      "Pending Resolve": 0,
      "Resolved": 0,
    };
    for (const r of chatRows) {
      const t = toDate(r.at);
      if (t >= start && t <= end) {
        const s = (r.status || "New");
        if (counts[s] !== undefined) counts[s] += 1;
      }
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [chatRows, today]);
  // const totalPie = React.useMemo(() => pieData.reduce((a, b) => a + b.value, 0), [pieData]);

  // ---------- RENDER ----------
  return (
    <div className="overflow-y-scroll flex flex-col items-center gap-6 p-6">
      {/* Side-by-side on lg+, stacked on smaller screens */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* ===== Card 1: Login Trends (with controls) ===== */}
        <Card className="bg-white border rounded-xl h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Login Trends</CardTitle>
            <div className="flex items-center gap-3">
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(v) => v && setView(v as View)}
                className="hidden sm:flex"
              >
                <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
                <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
                <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
              </ToggleGroup>
              <Select value={view} onValueChange={(v) => setView(v as View)}>
                <SelectTrigger className="w-[130px] sm:hidden">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <button onClick={movePrev} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4" /> Prev
                </button>
                <div className="text-sm text-gray-600 whitespace-nowrap">{loginHeaderRightLabel}</div>
                <button
                  onClick={moveNext}
                  disabled={nextDisabled}
                  className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loginData} margin={{ left: 4, right: 12, top: 10, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={8} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={8} width={40} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<LoginTooltip />} />
                  <defs>
                    <linearGradient id="seriesGradient" x1="0" y1="0" x2="1" y2="0">
                      {loginGradientStops}
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="logins"
                    dot={view === "yearly" ? <YearlyDot /> : <PaletteDot />}
                    strokeWidth={LINE_WIDTH}
                    stroke={"url(#seriesGradient)"}
                    activeDot={{ r: DOT_R_OTHER + 1.5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center border-t pt-4">
              <div>
                <div className="text-foreground/80 text-sm">Total (scope)</div>
                <div className="font-semibold text-xl">{totalLoginsInScope}</div>
              </div>
              <div>
                <div className="text-foreground/80 text-sm">Scope</div>
                <div className="font-semibold">
                  {view === "yearly" && `${anchor.getFullYear()}`}
                  {view === "weekly" && "7 days"}
                  {view === "daily" && "24 hours"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== Card 2: Support Chats by Category (straight lines; current YEAR YTD) ===== */}
        <Card className="bg-white border rounded-xl h-full">
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Support Chats by Category</CardTitle>
            <div className="text-sm text-gray-600">Scope: Jan – {monthShort(today.getMonth())} {today.getFullYear()}</div>
          </CardHeader>

          <CardContent className="pt-2">
            <ChatsLegend
              categories={categories2}
              colors={catColorMap2}
              hidden={hiddenCats2}
              totals={catTotalsYear}
              onToggle={toggleCat2}
            />

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chatsYearData} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={8} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickMargin={8} width={40} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChatsTooltip />} />
                  {categories2
                    .filter((cat) => !hiddenCats2.has(cat))
                    .map((cat) => (
                      <Line
                        key={cat}
                        type="linear"              // <-- STRAIGHT LINE (changed)
                        dataKey={cat}
                        name={cat}
                        stroke={catColorMap2[cat]}
                        strokeWidth={2.5}
                        isAnimationActive={false}
                        dot={{ r: 3.5, stroke: "#fff", strokeWidth: 1.5, fill: catColorMap2[cat] }}
                        activeDot={{ r: 5, stroke: "#fff", strokeWidth: 1.5 }}
                      />
                    ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-center border-t pt-4">
              <div>
                <div className="text-foreground/80 text-sm">Total (year)</div>
                <div className="font-semibold text-xl">{totalChatsYear}</div>
              </div>
              <div>
                <div className="text-foreground/80 text-sm">Year</div>
                <div className="font-semibold">{today.getFullYear()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Card 3: Chats by Status (Pie) — current MONTH-to-date ===== */}
      <div className="w-full max-w-7xl">
        <Card className="bg-white border rounded-xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Chats by Status</CardTitle>
            <div className="text-sm text-gray-600">
              Scope: {today.toLocaleString("default", { month: "long" })} {today.getFullYear()}
            </div>
          </CardHeader>
          <CardContent>
            <PieLegend data={pieData} colors={STATUS_COLORS} />

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const p = payload[0];
                        const val = p.value as number;
                        const color = (p.payload && (p.payload.fill as string)) || "#94a3b8";
                        const totalPie = pieData.reduce((a, b) => a + b.value, 0);
                        const pct = totalPie ? Math.round((val / totalPie) * 100) : 0;
                        return (
                          <div className="rounded-md border bg-white px-3 py-2 text-popover-foreground shadow-sm text-sm">
                            <div className="font-medium" style={{ color }}>{p.name}</div>
                            <div>{val} chats</div>
                            <div className="text-xs opacity-70">{pct}% of month</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Pie
                    data={pieData.map(d => ({ ...d, fill: STATUS_COLORS[d.name] || "#94a3b8" }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                    label={(d: any) => {
                      const totalPie = pieData.reduce((a, b) => a + b.value, 0);
                      return d.value ? `${Math.round((d.value / (totalPie || 1)) * 100)}%` : "";
                    }}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={`slice-${idx}`} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
