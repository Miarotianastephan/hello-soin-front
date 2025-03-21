import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  IconButton,
  Tooltip,
  Drawer
} from "@material-tailwind/react";
import { Info, MailIcon, Phone } from "lucide-react";
import { useEffect, useState } from "react";

// { date, key, nom, prenom, email, practice_start, practice_end, practice_type }
const TABLE_HEAD = ["Date", "Nom et email", "Duree", "Heure de debut", "Type de pratique", ""];

const DetailsPanel = ({isOpened, closePanel, selectedAppoint}) => {

  return(
    <>
      <Drawer placement="right" overlay={false} open={isOpened} onClose={closePanel} className="p-4 shadow">
        {/* Information principale */}
        <div className="mb-6 flex flex-col items-end gap-2">
          { selectedAppoint === null ? (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Info className="w-5 h-5 text-helloSoin" />
                      Aucune détails à afficher
                    </p>
          ) : (<>
              <IconButton variant="text" color="blue-gray" onClick={closePanel} >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
              <div className="flex w-full gap-3 items-start justify-between">
                <img
                  src="https://i.pravatar.cc/300"
                  alt="Aperçu de la photo de profil"
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div>
                  <Typography variant="h5" className="mt-1 font-bold text-helloBlue">
                  {selectedAppoint ? `${selectedAppoint.nom} ${selectedAppoint.prenom}` : ""}
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex gap-1 mt-1 text-helloBlue break-all"
                  >
                    <MailIcon className="h-4 w-4" />
                    {selectedAppoint ? selectedAppoint.email : ""}
                  </Typography>
                  <Typography
                    variant="small"
                    className="flex gap-1 mt-1 text-helloBlue"
                  >
                    <Phone className="h-4 w-4" />
                    {selectedAppoint ? selectedAppoint.numero : ""}
                  </Typography>
                </div>
              </div>
            </>)}
        </div>
        {/* Detail des rendez-vous */}
        <div className="">
          <Typography variant="h6" className="font-bold text-helloBlue">
            Détails du rendez-vous 
          </Typography>
          <ul className="space-y-2 text-helloBlue">
            <li className="flex">
              <span className="flex-1">Date</span>
              <span className="flex-1 text-start">{selectedAppoint ? selectedAppoint.date : ""}</span>
            </li>
            <li className="flex">
              <span className="flex-1">Type de pratique</span>
              <span className="flex-1 text-start">{selectedAppoint ? selectedAppoint.practice_type : ""}</span>
            </li>
            <li className="flex">
              <span className="flex-1">Heure de début</span>
              <span className="flex-1 text-start">{selectedAppoint ? selectedAppoint.practice_start : ""}</span>
            </li>
            <li className="flex">
              <span className="flex-1">Heure de fin</span>
              <span className="flex-1 text-start">{selectedAppoint ? selectedAppoint.practice_end : ""}</span>
            </li>
            <li className="flex flex-col">
              <span className="flex-1">Déscription :</span>
              <span className="flex-1 text-start">{selectedAppoint ? selectedAppoint.motif : ""}</span>
            </li>
          </ul>
        </div>
      </Drawer>
    </>
  );
}
 
export function ListTable({todayAppointments}) {
  const [dataRDV, setDataRDV] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedAppoint, setSelectedAppoint] = useState(null);
 
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

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
    
    return appointments.filter(appointDetail => {
      const { nom, prenom } = appointDetail;
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

  function handleShowDetailPanel(details){
    setSelectedAppoint(details)
    openDrawer();
    console.log(details)
  }

  return (
    <Card >
      <DetailsPanel isOpened={open} closePanel={closeDrawer} selectedAppoint={selectedAppoint} />
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
                  Aucun rendez‑vous pour aujourd’hui.
                  </td>
              </tr>
            ) :
            (
              dataRDV.map(
              ({ date, key, nom, prenom, email, practice_start, practice_end, practice_type }, index) => {
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
                            {nom} {prenom}
                          </Typography>
                          <Typography
                            variant="small"
                            className="font-normal opacity-70 text-helloBlue"
                          >
                            {email}
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
                          {getDurationInMinutes(practice_start, practice_end)} minutes
                        </Typography>
                    </td>
                    {/* Adresse => Heure debut et fin */}
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-normal text-helloBlue"
                        >
                          {practice_start} à {practice_end}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          className="font-normal text-helloBlue"
                        >
                          {practice_type}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Voir plus">
                        <IconButton variant="text" onClick={() => handleShowDetailPanel(dataRDV[index])}>
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
    </Card>
  );
}