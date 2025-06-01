import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// DashboardHeader component to display assignment and student metrics
export function DashboardHeader({ studentsData, assignment }) {
  // Calculate summary statistics
  const totalStudents = studentsData.length;
  const completedStudents = studentsData.filter(
    (s) => s.taskCompletion === 100
  ).length;
  const inProgressStudents = studentsData.filter(
    (s) => s.taskCompletion < 100 && s.taskCompletion > 0
  ).length;
  const notStartedStudents = studentsData.filter(
    (s) => s.taskCompletion === 0
  ).length;

  // Calculate average task completion
  const avgTaskCompletion = Math.round(
    studentsData.reduce((sum, student) => sum + student.taskCompletion, 0) /
      totalStudents
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold text-center md:text-left">
          {assignment.name}
        </CardTitle>
        <CardDescription className="text-center md:text-left">
          Student performance metrics and engagement analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex flex-col justify-center p-4 border rounded-lg">
            <span className="text-sm font-medium">Total Students</span>
            <span className="text-3xl font-bold">{totalStudents}</span>
          </div>
          <div className="flex flex-col justify-center p-4 border rounded-lg">
            <span className="text-sm font-medium">Completed</span>
            <span className="text-3xl font-bold">{completedStudents}</span>
          </div>
          <div className="flex flex-col justify-center p-4 border rounded-lg">
            <span className="text-sm font-medium">In Progress</span>
            <span className="text-3xl font-bold">{inProgressStudents}</span>
          </div>
          <div className="flex flex-col justify-center p-4 border rounded-lg">
            <span className="text-sm font-medium">Not Started</span>
            <span className="text-3xl font-bold">{notStartedStudents}</span>
          </div>
          <div className="flex flex-col justify-center p-4 border rounded-lg">
            <span className="text-sm font-medium">Avg. Completion</span>
            <span className="text-3xl font-bold">{avgTaskCompletion}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
