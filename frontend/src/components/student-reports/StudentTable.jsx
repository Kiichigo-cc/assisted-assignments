import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  RotateCcw,
  SortAsc,
  Download,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import downloadChatLogs from "../assignments";

export function StudentTable({ studentsData, accessToken, assignment }) {
  const assignmentId = useParams().assignmentId;
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [taskCompletionRange, setTaskCompletionRange] = useState([0, 100]);
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showFilters, setShowFilters] = useState(false);

  const handleDownload = async (accessToken, user, assignmentData) => {
    await downloadChatLogs({
      accessToken,
      user,
      assignmentData,
      instructorView: true,
    });
  };

  const handleDownloadAll = async (accessToken, users, assignmentData) => {
    for (const user of users) {
      await handleDownload(accessToken, user, assignmentData);
    }

    await handleDownload(accessToken, null, assignmentData);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getNegativeSentimentLabel = (student) => {
    const count = student.issues?.length || 0;
    if (count === 0) return "0 (None)";
    if (count <= 2) return `${count} (Mild)`;
    if (count <= 5) return `${count} (Moderate)`;
    return `${count} (Severe)`;
  };

  const filteredAndSortedStudents = () => {
    const result = studentsData.filter((student) => {
      if (
        nameFilter &&
        !student.user.name.toLowerCase().includes(nameFilter.toLowerCase())
      )
        return false;
      if (statusFilter !== "all" && student.assignmentStatus !== statusFilter)
        return false;
      if (
        student.taskCompletion < taskCompletionRange[0] ||
        student.taskCompletion > taskCompletionRange[1]
      )
        return false;

      const sentimentLabel = getNegativeSentimentLabel(student);
      if (sentimentFilter !== "all") {
        if (sentimentFilter === "none" && !sentimentLabel.includes("None"))
          return false;
        if (sentimentFilter === "mild" && !sentimentLabel.includes("Mild"))
          return false;
        if (
          sentimentFilter === "elevated" &&
          !sentimentLabel.includes("Elevated")
        )
          return false;
      }

      return true;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const resetFilters = () => {
    setNameFilter("");
    setStatusFilter("all");
    setTaskCompletionRange([0, 100]);
    setSentimentFilter("all");
    setSortConfig({ key: null, direction: "asc" });
  };

  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc className="ml-1 h-4 w-4 text-slate-400" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const filteredStudents = filteredAndSortedStudents();

  return (
    <Card className="overflow-x-auto overflow-y-auto max-h-[600px]">
      <CardHeader className="w-full flex sm:flex-row flex-col items-center justify-between">
        <CardTitle>Student Performance</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      {showFilters && (
        <div className="px-6 pb-2">
          <div className="p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium mb-3">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-medium block mb-1">
                  Student Name
                </label>
                <Input
                  placeholder="Search by name"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  className="h-8"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">
                  Assignment Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">
                  Task Completion ({taskCompletionRange[0]}% -{" "}
                  {taskCompletionRange[1]}%)
                </label>
                <Slider
                  value={taskCompletionRange}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={setTaskCompletionRange}
                  className="py-2"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">
                  Negative Sentiment
                </label>
                <Select
                  value={sentimentFilter}
                  onValueChange={setSentimentFilter}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Sentiments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiments</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      <CardContent>
        <div className="text-sm text-slate-500 mb-2">
          Showing {filteredStudents.length} of {studentsData.length} students
        </div>
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => requestSort("name")}>
                <div className="flex items-center">
                  Student Name
                  {getSortDirectionIcon("name")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("taskCompletion")}>
                <div className="flex items-center">
                  Task Completion
                  {getSortDirectionIcon("taskCompletion")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("assignmentStatus")}>
                <div className="flex items-center">
                  Assignment Status
                  {getSortDirectionIcon("assignmentStatus")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("responseCount")}>
                <div className="flex items-center">
                  Response Count
                  {getSortDirectionIcon("responseCount")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("avgResponseLength")}>
                <div className="flex items-center">
                  Avg Response Length
                  {getSortDirectionIcon("avgResponseLength")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("aggregateResponseLength")}>
                <div className="flex items-center">
                  Aggregate Length
                  {getSortDirectionIcon("aggregateResponseLength")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("totalActiveTime")}>
                <div className="flex items-center">
                  Active Time (min)
                  {getSortDirectionIcon("totalActiveTime")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("estIndependentInput")}>
                <div className="flex items-center">
                  Est. Independent Input
                  {getSortDirectionIcon("estIndependentInput")}
                </div>
              </TableHead>
              <TableHead onClick={() => requestSort("issues")}>
                <div className="flex items-center">
                  Negative Sentiment
                  {getSortDirectionIcon("issues")}
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-right">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() =>
                    handleDownloadAll(
                      accessToken,
                      studentsData.map((s) => s.user),
                      assignment
                    )
                  }
                  title="Download All Chatlogs"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.user.name}>
                  <TableCell className="font-medium">
                    <Link
                      to={`/chatlogs?userId=${student.user.userId}&assignmentId=${assignmentId}`}
                      className="hover:underline"
                    >
                      {student.user.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={student.taskCompletion}
                        className="h-2 w-16"
                      />
                      <span className="text-sm">{student.taskCompletion}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        student.assignmentStatus === "Completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : student.assignmentStatus === "In Progress"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {student.assignmentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.responseCount}</TableCell>
                  <TableCell>{student.avgResponseLength.toFixed(2)}</TableCell>
                  <TableCell>{student.aggregateResponseLength}</TableCell>
                  <TableCell>{student.totalActiveTime}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={student.estIndependentInput}
                        className="h-2 w-16"
                      />
                      <span className="text-sm">
                        {student.estIndependentInput}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        getNegativeSentimentLabel(student).includes("None")
                          ? "bg-green-50 text-green-700 border-green-200"
                          : getNegativeSentimentLabel(student).includes("Mild")
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : getNegativeSentimentLabel(student).includes(
                              "Moderate"
                            )
                          ? "bg-orange-50 text-orange-700 border-orange-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {getNegativeSentimentLabel(student)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        handleDownload(accessToken, student.user, assignment);
                      }}
                      title="Download Chatlog"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-slate-500"
                >
                  No students match the current filters. Try adjusting your
                  filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
