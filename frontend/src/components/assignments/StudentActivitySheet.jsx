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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InstructorAccess from "../user-permissions/InstructorAccess";

export default function StudentActivitySheet({ users, assignmentId }) {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.userId}>
                  <a
                    href={`/chatlogs?userId=${user.userId}&assignmentId=${assignmentId}`}
                    target="_blank"
                    rel="noopener noreferrer" // For security reasons
                  >
                    <TableCell>
                      <div className="flex flex-row space-x-4 items-center">
                        <Avatar>
                          <AvatarImage src={user.profilePicture} alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                  </a>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SheetContent>
      </Sheet>
    </InstructorAccess>
  );
}
