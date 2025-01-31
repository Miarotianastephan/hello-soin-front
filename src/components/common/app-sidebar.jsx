import { 
  Sidebar,
  SidebarContent,
  SidebarFooter, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,} from "@/components/ui/sidebar"
import { Calendar, Home, Inbox, Search, Settings, Plus, Minus } from "lucide-react"
import { NavUser } from "@/components/common/nav-user"
import { Link } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useEffect, useState } from "react";
import { getLocalData } from "@/services/api";

// Menu items.
const items = [
  {
    title: "Acceuil",
    url: "/about",
    icon: Home,
  },
  {
    title: "Historique du patient",
    url: "/historique/rdv",
    icon: Calendar,
  },
  {
    title: "Information sur le patient",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

const AppSidebar = () => {

  const [user_info, setUserInfo] = useState({});

  // const user = {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // }

  useEffect(() => {
    const data = getLocalData('user_data');
    setUserInfo(data);
  },[])

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={({ isActive }) => isActive ? "font-bold text-blue-500" : ""}><item.icon /> <span>{item.title}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        <NavUser user={user_info} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;