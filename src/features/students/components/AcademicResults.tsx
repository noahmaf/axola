import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  BookOpen,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Percent,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// interface AcademicResultsProps {
//   studentName: string;
// }

const formatPercent = (value: number) =>
  `${new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)}%`;

export function AcademicResults() {
  // --------- Module marks (illustrative, with credits) ----------
  const modulePerformance = [
    { code: "ECON114", subject: "Economics 114", grade: 72, credits: 16 },
    { code: "STAT144", subject: "Statistics 144", grade: 65, credits: 16 },
    {
      code: "CSIS114",
      subject: "Computer Science 114",
      grade: 78,
      credits: 16,
    },
    { code: "ACCN114", subject: "Accounting 114", grade: 69, credits: 16 },
    {
      code: "AFLA1508",
      subject: "Academic Literacy (Eng)",
      grade: 81,
      credits: 8,
    },
    { code: "BLGW1624", subject: "Business Law", grade: 58, credits: 12 },
  ];

  const totalCredits = modulePerformance.reduce((s, m) => s + m.credits, 0);
  const weightedAverage =
    modulePerformance.reduce((s, m) => s + m.grade * m.credits, 0) /
    totalCredits;

  const distinctions = modulePerformance.filter((m) => m.grade >= 75).length;
  const passes = modulePerformance.filter((m) => m.grade >= 50).length;

  // Credits progress example
  const creditsCompleted = 64;
  const creditsRequired = 120;
  const creditCompletionRate = (creditsCompleted / creditsRequired) * 100;

  // Average target example (e.g., bursary requirement)
  const targetAverage = 72;
  const isAtRisk = weightedAverage < targetAverage;

  // --------- Term progression (percentage averages) ----------
  const averageProgressData = [
    { term: "Quarter 1", average: 68, cumulative: 68 },
    { term: "Quarter 2", average: 71, cumulative: 69.5 },
    { term: "Quarter 3", average: 73, cumulative: 70.7 },
    { term: "Quarter 4", average: 75, cumulative: 71.8 },
  ];

  // Helper to style blocks by mark band
  const bandClass = (mark: number) =>
    mark >= 75
      ? {
          tone: "emerald",
          bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
          border: "border-l-emerald-500",
          text: "text-emerald-800 dark:text-emerald-200",
          bar: "[&>div]:bg-emerald-500",
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          label: "Distinction",
        }
      : mark >= 60
      ? {
          tone: "blue",
          bg: "bg-blue-50/50 dark:bg-blue-950/20",
          border: "border-l-blue-500",
          text: "text-blue-800 dark:text-blue-200",
          bar: "[&>div]:bg-blue-500",
          badge: "bg-blue-100 text-blue-800 border-blue-200",
          label: "Good",
        }
      : mark >= 50
      ? {
          tone: "amber",
          bg: "bg-amber-50/50 dark:bg-amber-950/20",
          border: "border-l-amber-500",
          text: "text-amber-800 dark:text-amber-200",
          bar: "[&>div]:bg-amber-500",
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          label: "Pass",
        }
      : {
          tone: "red",
          bg: "bg-red-50/50 dark:bg-red-950/20",
          border: "border-l-red-500",
          text: "text-red-800 dark:text-red-200",
          bar: "[&>div]:bg-red-500",
          badge: "bg-red-100 text-red-800 border-red-200",
          label: "At Risk",
        };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Average */}
        <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
              Current Average
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatPercent(weightedAverage)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Target - {formatPercent(targetAverage)}
            </p>
          </CardContent>
        </Card>

        {/* Credit Completion */}
        <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
              Credit Completion
            </CardTitle>
            <Percent className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {formatPercent(creditCompletionRate)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {creditsCompleted}/{creditsRequired} credits
            </p>
          </CardContent>
        </Card>

        {/* Distinctions */}
        <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-amber-700 dark:text-amber-300">
              Distinctions
            </CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              {distinctions}
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              {passes}/{modulePerformance.length} modules passed
            </p>
          </CardContent>
        </Card>

        {/* Academic Standing */}
        <Card className="border-l-4 border-l-purple-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-700 dark:text-purple-300">
              Academic Standing
            </CardTitle>
            {isAtRisk ? (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {isAtRisk ? "Attention Needed" : "Good Standing"}
              </div>
              {isAtRisk && (
                <Badge variant="secondary" className="text-red-600 bg-red-100">
                  Below target
                </Badge>
              )}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {isAtRisk
                ? "Improve average to meet requirement"
                : "Meeting requirements"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Average Progression Chart */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">
            Average Progression
          </CardTitle>
          <CardDescription>
            Term averages and cumulative performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={averageProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="term" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v: number) => [formatPercent(v), ""]} />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Term Average"
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                strokeWidth={3}
                name="Cumulative Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Module Performance */}
      <Card className="border-t-4 border-t-emerald-500">
        <CardHeader>
          <CardTitle className="text-emerald-700 dark:text-emerald-300">
            Module Performance
          </CardTitle>
          <CardDescription>Current semester marks and credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modulePerformance.map((m, idx) => {
              const band = bandClass(m.grade);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${band.bg} ${band.border}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className={`font-medium text-sm ${band.text}`}>
                        {m.subject}
                      </h4>
                      <p className="text-xs text-muted-foreground">{m.code}</p>
                    </div>
                    <Badge variant="secondary" className={band.badge}>
                      {band.label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mark</span>
                      <span className={`font-semibold ${band.text}`}>
                        {formatPercent(m.grade)}
                      </span>
                    </div>
                    <Progress value={m.grade} className={`h-2 ${band.bar}`} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Credits: {m.credits}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Goals & Progress */}
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">
            Goals & Progress
          </CardTitle>
          <CardDescription>
            Program requirement and credit targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Average Target */}
          <div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                Average Program Target
              </span>
              <span className="font-semibold">
                <span className={isAtRisk ? "text-red-600" : "text-green-600"}>
                  {formatPercent(weightedAverage)}
                </span>{" "}
                / {formatPercent(targetAverage)}
              </span>
            </div>
            <Progress
              value={Math.min((weightedAverage / targetAverage) * 100, 100)}
              className={`h-3 ${
                isAtRisk ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"
              }`}
            />
            {isAtRisk && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  Below requirement — extra support may be necessary.
                </span>
              </div>
            )}
          </div>

          {/* Credits Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Credits Progress
              </span>
              <span className="font-semibold">
                {creditsCompleted}/{creditsRequired}
              </span>
            </div>
            <Progress
              value={creditCompletionRate}
              className="h-3 [&>div]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
