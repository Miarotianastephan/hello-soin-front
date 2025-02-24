import { GalleryVerticalEnd } from "lucide-react";
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import hello_soin from "@/assets/main_logo.png";

const AppSidebarHeader = () => {
    return(
        <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-white" size="lg" asChild>
              <a href="#">
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div> */}
                <div className="flex flex-col gap-0.5 leading-none">
                  <img src={hello_soin} alt="Hello Soin Logo" className="h-auto w-auto rounded-lg object-cover object-center" />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    );
}
export default AppSidebarHeader;