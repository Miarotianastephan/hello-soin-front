import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React, { useEffect, useState } from "react";
 
const TABS = [
  {
    label: "Jour",
    value: "all",
  },
  {
    label: "Semaine",
    value: "monitored",
  },
  {
    label: "Mois",
    value: "unmonitored",
  },
];
 
const TABLE_HEAD = ["Date", "Nom du Patient", "Duree", "Heure de debut", "Heure de fin", ""];
 
const TABLE_ROWS = [
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
    name: "John Michael",
    email: "john@creative-tim.com",
    heure_debut: "10:00",
    heure_fin: "10:30",
    duree: "30",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    heure_debut: "11:00",
    heure_fin: "12:00",
    duree: "60",
    date: "23/04/18",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    heure_debut: "14:15",
    heure_fin: "14:30",
    duree: "15",
    date: "19/09/17",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    heure_debut: "16:15",
    heure_fin: "16:30",
    duree: "15",
    date: "24/12/08",
  },
  {
    img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    heure_debut: "17:00",
    heure_fin: "17:35",
    duree: "35",
    date: "04/10/21",
  },
];
 
export function ListTable({todayAppointments}) {
  const [dataRDV, setDataRDV] = useState([]);

  useEffect(() => {
    setDataRDV(todayAppointments);
  }, [todayAppointments]);

  function getDurationInMinutes(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
  
    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;
  
    if (endTotal < startTotal) {
      return (24 * 60 - startTotal) + endTotal;
    }
    return endTotal - startTotal;
  }

  function searchAppointments(appointments, searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    
    if (!term) return appointments;
    
    return appointments.filter(appointment => {
      const { nom, prenom } = appointment.patient;
      return (
        (nom && nom.toLowerCase().includes(term)) ||
        (prenom && prenom.toLowerCase().includes(term))
      );
    });
  }

  function handleSearch(searchValue) {
    const resultSearch = searchAppointments(todayAppointments, searchValue);
    setDataRDV(resultSearch);
  }

  return (
    <Card >
      <CardHeader floated={false} shadow={false} className="p-4 rounded-none">
        <div className=" flex items-center justify-between">
          <div>
            <Typography variant="h5" className="text-helloBlue">
              Rendez-vous aujourd’hui
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Recherche"
                className=""
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            { dataRDV.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                  Aucun rendez‑vous.
                  </td>
              </tr>
            ) :
            (
              dataRDV.map(
              ({ date, key, patient, practice }, index) => {
                const isLast = index === dataRDV.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={key}>
                    {/* Date du rendez-vous */}
                    <td className={classes}>
                      <div className="w-max">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold text-helloPurple"
                        >
                          {date}
                        </Typography>
                      </div>
                    </td>
                    {/* Detail Patient */}
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {/* <Avatar src={img} alt={name} size="sm" /> */}
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            className="font-bold text-helloBlue"
                          >
                            {patient.nom}
                          </Typography>
                          <Typography
                            variant="small"
                            className="font-normal opacity-70 text-helloBlue"
                          >
                            {patient.email}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    {/* Pratique => Duree du rendez-vous */}
                    <td className={classes}>
                        <Typography
                          variant="small"
                          className="font-normal opacity-70 text-helloBlue"
                        >
                          {getDurationInMinutes(practice.start, practice.end)} minutes
                        </Typography>
                    </td>
                    {/* Adresse => Heure debut et fin */}
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-normal text-helloBlue"
                        >
                          De {practice.start}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-normal text-helloBlue"
                        >
                          à {practice.end}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Voir plus">
                        <IconButton variant="text">
                          <ArrowRightCircleIcon className="h-6 w-6 text-helloBlue" />
                        </IconButton>
                      </Tooltip>
                      
                    </td>
                  </tr>
                );
              },
            ))}
          </tbody>
        </table>
      </CardBody>
      {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter> */}
    </Card>
  );
}