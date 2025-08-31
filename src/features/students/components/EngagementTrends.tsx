import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui//card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  MessageSquare,
  LogIn,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

interface EngagementTrendsProps {
  studentName: string;
}

export function EngagementTrends({ studentName }: EngagementTrendsProps) {
  // Mock data for demonstration
  const loginActivityData = [
    { date: "2024-08-25", logins: 3 },
    { date: "2024-08-26", logins: 2 },
    { date: "2024-08-27", logins: 4 },
    { date: "2024-08-28", logins: 1 },
    { date: "2024-08-29", logins: 5 },
    { date: "2024-08-30", logins: 3 },
    { date: "2024-08-31", logins: 2 },
  ];

  const stepEngagementData = [
    { week: "Week 1", opened: 8, completed: 6 },
    { week: "Week 2", opened: 12, completed: 9 },
    { week: "Week 3", opened: 10, completed: 8 },
    { week: "Week 4", opened: 15, completed: 12 },
  ];

  const chatActivityData = [
    { date: "2024-08-25", messages: 5 },
    { date: "2024-08-26", messages: 2 },
    { date: "2024-08-27", messages: 8 },
    { date: "2024-08-28", messages: 1 },
    { date: "2024-08-29", messages: 12 },
    { date: "2024-08-30", messages: 6 },
    { date: "2024-08-31", messages: 3 },
  ];

  const activityBreakdown = [
    { name: "Steps Completed", value: 35, color: "#6366f1" },
    { name: "Announcements Read", value: 18, color: "#10b981" },
    { name: "Chat Messages", value: 37, color: "#f59e0b" },
    { name: "Login Sessions", value: 20, color: "#ec4899" },
  ];

  const weeklyEngagement = [
    { week: "Week 1", engagement: 75 },
    { week: "Week 2", engagement: 82 },
    { week: "Week 3", engagement: 68 },
    { week: "Week 4", engagement: 91 },
  ];

  const totalActivities = activityBreakdown.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">
              Total Logins
            </CardTitle>
            <LogIn className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              20
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              This week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">
              Steps Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              35
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              Out of 42 total
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-amber-700 dark:text-amber-300">
              Chat Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
              37
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              This week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-700 dark:text-purple-300">
              Avg. Session Time
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              24m
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Per session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Login Activity */}
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-300">
              Daily Login Activity
            </CardTitle>
            <CardDescription>
              Login frequency over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={loginActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  }
                />
                <Area
                  type="monotone"
                  dataKey="logins"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Engagement Score */}
        <Card className="border-t-4 border-t-emerald-500">
          <CardHeader>
            <CardTitle className="text-emerald-700 dark:text-emerald-300">
              Weekly Engagement Score
            </CardTitle>
            <CardDescription>
              Overall engagement percentage by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, "Engagement"]} />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step Engagement */}
        <Card className="border-t-4 border-t-amber-500">
          <CardHeader>
            <CardTitle className="text-amber-700 dark:text-amber-300">
              Step Engagement
            </CardTitle>
            <CardDescription>Steps opened vs completed by week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stepEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="opened" fill="#f59e0b" name="Opened" />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card className="border-t-4 border-t-purple-500">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300">
              Activity Breakdown
            </CardTitle>
            <CardDescription>
              Distribution of student activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {activityBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 border-l-2"
                  style={{ borderLeftColor: item.color }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                  <span
                    className="text-sm font-semibold ml-auto"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Activity */}
      <Card className="border-t-4 border-t-teal-500">
        <CardHeader>
          <CardTitle className="text-teal-700 dark:text-teal-300">
            Chat Activity
          </CardTitle>
          <CardDescription>
            Daily chat message count over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chatActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Bar dataKey="messages" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-violet-500">
          <CardHeader>
            <CardTitle className="text-violet-700 dark:text-violet-300">
              Completion Progress
            </CardTitle>
            <CardDescription>
              Current progress across different activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Steps Completed
                </span>
                <span className="font-semibold text-emerald-600">
                  35/42 (83%)
                </span>
              </div>
              <Progress value={83} className="h-3 [&>div]:bg-emerald-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Announcements Read
                </span>
                <span className="font-semibold text-blue-600">18/20 (90%)</span>
              </div>
              <Progress value={90} className="h-3 [&>div]:bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-purple-500" />
                  Weekly Login Goal
                </span>
                <span className="font-semibold text-purple-600">
                  20/25 (80%)
                </span>
              </div>
              <Progress value={80} className="h-3 [&>div]:bg-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-rose-500">
          <CardHeader>
            <CardTitle className="text-rose-700 dark:text-rose-300">
              Engagement Insights
            </CardTitle>
            <CardDescription>
              Key insights about {studentName.split(" ")[0]}'s engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border-l-4 border-l-green-500">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  Most active during afternoon hours (12PM - 6PM)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500">
              <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  High completion rate of 83% for assigned steps
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-l-yellow-500">
              <TrendingDown className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  Chat activity has decreased by 8% this week
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border-l-4 border-l-purple-500">
              <Clock className="w-4 h-4 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">
                  Consistent daily login pattern maintained
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
