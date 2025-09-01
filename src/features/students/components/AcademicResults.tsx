import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, BookOpen, BarChart3, AlertTriangle, CheckCircle2, Percent } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// interface AcademicResultsProps {
//   studentName: string;
// }

export function AcademicResults() {
  // Mock academic data
  const gpaData = [
    { semester: 'Quarter 1', gpa: 53, cumulative: 53 },
    { semester: 'Quarter 2', gpa: 56, cumulative: 54.5 },
    { semester: 'Quarter 3', gpa: 58, cumulative: 55.6 },
    { semester: 'Quarter 4', gpa: 69, cumulative: 59 },
  ];

  const subjectPerformance = [
    { subject: 'Mathematics', grade: 85, credits: 4, letter: 'A' },
    { subject: 'Statistics', grade: 92, credits: 3, letter: 'A+' },
    { subject: 'Computer Science', grade: 78, credits: 4, letter: 'B+' },
    { subject: 'Physics', grade: 88, credits: 3, letter: 'A' },
    { subject: 'English', grade: 82, credits: 2, letter: 'A-' },
  ];



  const currentGPA = 3.63;
  const targetGPA = 3.75;
  const creditCompletionRate = 89; // percentage of credits completed on time
  const academicStanding = "Good Standing";
  const isAtRisk = currentGPA < targetGPA;

  return (
    <div className="space-y-8">

      {/* Academic Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-700 dark:text-blue-300">Current GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{currentGPA}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Target: {targetGPA}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">Credit Completion</CardTitle>
            <Percent className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{creditCompletionRate}%</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">On-time completion rate</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-amber-700 dark:text-amber-300">Avg. Grade</CardTitle>
            <Target className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">85%</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">This semester</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-700 dark:text-purple-300">Academic Standing</CardTitle>
            {isAtRisk ? 
              <AlertTriangle className="h-4 w-4 text-red-500" /> : 
              <CheckCircle2 className="h-4 w-4 text-purple-500" />
            }
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{academicStanding}</div>
              {isAtRisk && (
                <Badge variant="secondary" className="text-red-600 bg-red-100">
                  At Risk
                </Badge>
              )}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              {isAtRisk ? "Below GPA target" : "Meeting requirements"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GPA Progression Chart */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300">GPA Progression</CardTitle>
          <CardDescription>Semester-wise GPA and cumulative performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gpaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="gpa" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Semester GPA"
              />
              <Line 
                type="monotone" 
                dataKey="cumulative" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Cumulative GPA"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Subject Performance */}
      <Card className="border-t-4 border-t-emerald-500">
        <CardHeader>
          <CardTitle className="text-emerald-700 dark:text-emerald-300">Subject Performance Analysis</CardTitle>
          <CardDescription>Current semester grades and credit distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectPerformance.map((subject, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                subject.grade >= 90 ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-l-emerald-500" :
                subject.grade >= 80 ? "bg-blue-50/50 dark:bg-blue-950/20 border-l-blue-500" :
                "bg-amber-50/50 dark:bg-amber-950/20 border-l-amber-500"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-medium text-sm ${
                    subject.grade >= 90 ? "text-emerald-800 dark:text-emerald-200" :
                    subject.grade >= 80 ? "text-blue-800 dark:text-blue-200" :
                    "text-amber-800 dark:text-amber-200"
                  }`}>{subject.subject}</h4>
                  <Badge 
                    variant="secondary" 
                    className={
                      subject.grade >= 90 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                      subject.grade >= 80 ? "bg-blue-100 text-blue-800 border-blue-200" :
                      "bg-amber-100 text-amber-800 border-amber-200"
                    }
                  >
                    {subject.letter}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grade</span>
                    <span className={`font-semibold ${
                      subject.grade >= 90 ? "text-emerald-800 dark:text-emerald-200" :
                      subject.grade >= 80 ? "text-blue-800 dark:text-blue-200" :
                      "text-amber-800 dark:text-amber-200"
                    }`}>{subject.grade}%</span>
                  </div>
                  <Progress 
                    value={subject.grade} 
                    className={`h-2 ${
                      subject.grade >= 90 ? "[&>div]:bg-emerald-500" :
                      subject.grade >= 80 ? "[&>div]:bg-blue-500" :
                      "[&>div]:bg-amber-500"
                    }`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Credits: {subject.credits}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Academic Goals & Progress */}
      <Card className="border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">Academic Goals & Progress</CardTitle>
          <CardDescription>Bursary requirements and performance targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-500" />
                GPA Target (Bursary Requirement)
              </span>
              <span className="font-semibold">
                <span className={isAtRisk ? "text-red-600" : "text-green-600"}>{currentGPA}</span>
                /{targetGPA}
              </span>
            </div>
            <Progress 
              value={(currentGPA / targetGPA) * 100} 
              className={`h-3 ${isAtRisk ? "[&>div]:bg-red-500" : "[&>div]:bg-green-500"}`}
            />
            {isAtRisk && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  At Risk: GPA below bursary requirement
                </span>
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Credits Progress
              </span>
              <span className="font-semibold">64/120</span>
            </div>
            <Progress value={(64/120) * 100} className="h-3 [&>div]:bg-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}