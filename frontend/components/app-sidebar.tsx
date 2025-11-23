import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserPill } from "@privy-io/react-auth/ui";
import { HomeIcon, Scroll, User } from "lucide-react";

const items = [
  { url: "/", title: "Home", icon: HomeIcon },
  { url: "/patents", title: "Patents", icon: Scroll },
  { url: "/profile/", title: "Profile", icon: User },

];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Scroll className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold gradient-text-blue-purple">
            Eureka
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <a href={item.url} className="gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-base font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <UserPill />
      </SidebarFooter>
    </Sidebar>
  );
}
