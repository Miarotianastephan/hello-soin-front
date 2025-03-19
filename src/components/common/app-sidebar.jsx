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
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/common/nav-user";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getLocalData } from "@/services/api";

import { menu_principale, menu_secondaire } from "./constant";
import AppSidebarHeader from "./app-sidebar-header";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

const AppSidebar = () => {
  const location = useLocation();
  // const [user_info, setUserInfo] = useState({});

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
          <SidebarGroupLabel>Navigation Principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu_principale.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      to={item.url}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition hover:text-green-400 active:text-helloSoin  ${
                        location.pathname === item.url
                          ? "text-helloSoin bg-gray-100"
                          : "text-gray-700"
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
        <DropdownMenuSeparator />
        {/* Menu secondaire  */}
        <SidebarGroup>
          <SidebarGroupLabel>Parametrages</SidebarGroupLabel>
          <SidebarMenu>
            {menu_secondaire.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={subItem.url}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition hover:text-green-400 active:text-helloSoin  ${
                                location.pathname === subItem.url
                                  ? "text-helloSoin bg-gray-100"
                                  : "text-gray-700"
                              }`}
                            >
                              <subItem.icon />
                               <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Resume de l'user connecter */}
        <NavUser /> 
      </SidebarFooter>
      <SidebarRail title="" className="hover:bg-gray-50" />
    </Sidebar>
  );
};

export default AppSidebar;
