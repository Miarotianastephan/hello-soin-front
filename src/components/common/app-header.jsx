import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb"
import { Separator } from "@/components/ui/Separator"
import {SidebarTrigger} from "@/components/ui/Sidebar"
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const AppHeader = () => {
  const location = useLocation();
  // Découper le chemin en segments
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [actualPath, setActualPath] = useState("");
  
  useEffect(() => {
    const explicit_path = pathnames.map((name, index) => {
      if (index === pathnames.length - 1) return name;
      return `${name}`;
    }).join(" | "); 
    // document.title = explicit_path; 
    setActualPath(explicit_path)
  },[location, pathnames])
  
  return (
    <>
      <header className="flex sticky top-0 z-50 mb-4 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Hello
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{ actualPath ? actualPath : "" }</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    </>
  );
};

export default AppHeader;