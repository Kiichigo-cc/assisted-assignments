import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export function IssuesReport({ studentsData }) {
  // Filter students with at least one issue
  const studentsWithIssues = studentsData?.filter(
    (student) => student.issues.length > 0
  );

  // Track open state for each student group
  const [openStates, setOpenStates] = useState(
    studentsWithIssues?.reduce((acc, student) => {
      acc[student.user.name] = false; // All collapsed by default
      return acc;
    }, {})
  );

  const toggleOpen = (studentName) => {
    setOpenStates((prev) => ({
      ...prev,
      [studentName]: !prev[studentName],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues Report: Negative Sentiment Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[600px]">
        {studentsWithIssues?.map((student) => (
          <Collapsible
            key={student.user.name}
            open={openStates[student.user.name]}
            onOpenChange={() => toggleOpen(student.user.name)}
            className="border rounded-md"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 rounded-t-md">
              <div className="flex items-center gap-2">
                {openStates[student.user.name] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="font-medium">{student.user.name}</span>
              </div>
              <Badge variant="destructive">
                {student.issues.length} issue
                {student.issues.length !== 1 ? "s" : ""}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 pt-1 space-y-3">
              {student.issues.map((issue, index) => (
                <Alert
                  key={index}
                  className="bg-destructive/20 border-destructive"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    <span className="text-xs font-normal">{issue.issue}</span>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <blockquote className="border-l-2 border-destructive pl-2 italic text-sm my-2">
                      "{issue.quote}"
                    </blockquote>
                    <p className="text-sm">{issue.description}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
