import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Download } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InstructorAccess from "../user-permissions/InstructorAccess";
import downloadChatLogs from "./index.js";
import useAccessToken from "@/hooks/useAccessToken";

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

export default function StudentActivitySheet({ users, assignmentData }) {
  const { accessToken } = useAccessToken();
  return (
    <InstructorAccess>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">View Chat Logs</Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>View Chat Logs</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[100px] text-right">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() =>
                      handleDownloadAll(accessToken, users, assignmentData)
                    }
                    title="Download All"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <a
                      href={`/chatlogs?userId=${user.userId}&assignmentId=${assignmentData.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <div className="flex flex-row space-x-4 items-center">
                        <Avatar>
                          <AvatarImage
                            src={user.profilePicture}
                            alt="@shadcn"
                          />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        handleDownload(accessToken, user, assignmentData);
                      }}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SheetContent>
      </Sheet>
    </InstructorAccess>
  );
}
