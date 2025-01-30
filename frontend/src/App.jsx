import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chatbot from "@/components/Chatbot";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import Courses, { CoursePage } from "@/components/Course";
import { ThemeProvider } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <SidebarProvider
          style={{
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "10rem",
          }}
        >
          <AppSidebar />
          <div className="w-full p-8">
            <Routes>
              <Route path="/" element={<Courses />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CoursePage />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route
                path="/settings"
                element={
                  <div>
                    Light Mode/Dark Mode <ModeToggle />
                  </div>
                }
              />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
