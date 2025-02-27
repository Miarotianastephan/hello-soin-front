import {
  LayoutDashboard,
  CalendarDays,
  CalendarFold,
  Activity,
  Inbox,
  Users,
  Settings2,
} from "lucide-react";

const menu_principale = [
  {
    title: "Accueil",
    url: "/praticien/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: CalendarDays,
  },
  // {
  //   title: "Message",
  //   url: "#",
  //   icon: Inbox,
  // },
];

const menu_secondaire = [
  {
    title: "Parametrages",
    url: "#",
    icon: Settings2,
    isActive: true,
    items: [
      {
        title: "Plage horaire",
        url: "/plage-horaire",
        icon: CalendarFold,
      },
      {
        title: "Type de pratique",
        url: "/pratiques",
        icon: Activity,
      },
      {
        title: "Mes patients",
        url: "#",
        icon: Users,
      },
    ]
  },
]

const user_test = {
  user_mail: "logintest@gmail.com",
  mot_de_passe: "logintest"
}

export { menu_principale, menu_secondaire, user_test };
