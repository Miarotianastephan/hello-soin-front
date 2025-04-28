import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
} from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/Sidebar"
import { API_URL } from "@/services/api"


export function NavUser() {
  const { isMobile } = useSidebar()
  const [practitionerData, setPractitionerData] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${API_URL}/praticien/get-info-praticien`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.data.success) {
          setPractitionerData(response.data.data)
        }
      } catch (error) {
        console.error("Erreur de récupération des données:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiration')
    localStorage.removeItem('userData')
  
    // Utiliser replace pour éviter d'ajouter au stack d'historique
    navigate('/login', { replace: true })
  
    // Nettoyer l'historique du navigateur pour éviter le retour arrière
    window.history.pushState(null, '', ' /medicalReact/login')
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', ' /medicalReact/login')
    })
  
    // Rechargement (optionnel selon ton besoin)
    window.location.reload()
  }
  

  return practitionerData ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage 
                  src={`${API_URL}/image${practitionerData.profil_photo}` || ""}
                  alt={`${practitionerData.firstname} ${practitionerData.lastname}`} 
                />
                <AvatarFallback className="rounded-lg">
                  {practitionerData.firstname[0]}{practitionerData.lastname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {practitionerData.firstname} {practitionerData.lastname}
                </span>
                <span className="truncate text-xs">{practitionerData.mail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage 
                    src={`${API_URL}/image${practitionerData.profil_photo}` || ""} 
                    alt={`${practitionerData.firstname} ${practitionerData.lastname}`} 
                  />
                  <AvatarFallback className="rounded-lg">
                    {practitionerData.firstname[0]}{practitionerData.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {practitionerData.firstname} {practitionerData.lastname}
                  </span>
                  <span className="truncate text-xs">{practitionerData.mail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/profil">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <div className="px-4 py-2 text-muted-foreground text-xs">
      En attente de connexion...
    </div>
  )
}