import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  Book,
  MessageCircle,
  EllipsisVertical,
} from "lucide-react";

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
import { useEffect } from "react";
import useAccessToken from "@/hooks/useAccessToken";

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
    title: "Chatbot",
    url: "/chatbot",
    icon: MessageCircle,
  },
  {
    title: "Chatlogs",
    url: "/chatlogs",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const { scopes, error } = useAccessToken();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (
                  item.title === "Chatlogs" &&
                  (scopes?.length === 0 || !scopes)
                ) {
                  return null;
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
