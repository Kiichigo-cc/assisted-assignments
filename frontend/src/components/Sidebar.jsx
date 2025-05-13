import { Home, Settings, Book, MessageCircle, ChartBar } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import { NavUser } from "./nav-user";
import InstructorAccess from "./user-permissions/InstructorAccess";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: Book,
  },
  {
    title: "Student Metrics",
    url: "/reports",
    icon: ChartBar,
    requiresInstructor: true,
  },
  {
    title: "Chatlogs",
    url: "/chatlogs",
    icon: MessageCircle,
    requiresInstructor: true,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const itemContent = (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );

                return item.requiresInstructor ? (
                  <InstructorAccess key={item.title}>
                    {itemContent}
                  </InstructorAccess>
                ) : (
                  itemContent
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? null : isAuthenticated ? (
          <NavUser user={user} />
        ) : (
          <LoginButton />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
