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
  SidebarRail,} from "@/components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { LayoutDashboard, CalendarDays, CalendarFold, CalendarClock, Inbox, Activity, Settings, User, Users } from "lucide-react";
import { NavUser } from "@/components/common/nav-user";
import AppSidebarHeader from "./app-sidebar-header";

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
    title: "Acceuil", url: "/", icon: LayoutDashboard,
  },
  {
    title: "Disponibilite", url: "/disponibilite", icon: CalendarFold,
  },
  {
    title: "Creneaux", url: "/creneaux", icon: CalendarClock,
  },
  {
    title: "Agenda", url: "/agenda", icon: CalendarDays,
  },
  {
    title: "Pratique", url: "/pratiques", icon: Activity,
  },
  {
    title: "Patient", url: "#", icon: Users,
  },
  {
    title: "Message", url: "#", icon: Inbox,
  }
]

const AppSidebar = () => {
  const location = useLocation();
  const [user_info, setUserInfo] = useState({
    id_users: undefined,
    user_name: "Jean",
    user_forname: "Bosco",
    adresse: "Ambiatibe",
    code_postal: "12344",
    ville: "Tsy hay",
    user_created_at: "05-02-2025",
    user_date_naissance: "01-08-2002",
    user_mail: "jean@mail.jean",
    user_password: "xxxxxxx",
    user_phone: "34 21 245 21",
    user_photo_url: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    id_type_user: undefined,
    mot_de_passe: ""
  });

  // useEffect(() => {
  //   const data = getLocalData('user_data');
  //   setUserInfo(data);
  // },[])

  return (
    <Sidebar collapsible="icon" className="z-20">
      {/* Pour l'en tete du sidebar */}
      <AppSidebarHeader />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition hover:text-green-400 active:text-helloSoin  ${
                      location.pathname === item.url ? "text-helloSoin bg-gray-100" : "text-gray-700"
                    }`}
                    >
                      <item.icon /> <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user_info} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;