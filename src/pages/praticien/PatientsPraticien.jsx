import React, { useEffect, useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Input,
  Typography,
  Button,
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
  ListItemPrefix,
  Avatar, Chip
} from "@material-tailwind/react";
import { Phone, MailIcon, MapPin, CircleArrowRight } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import clsx from "clsx";

const SearchBarFilter = () => {
  function handleSearch(searchStr) {
    console.log(searchStr);
  }

  return (
    <>
      <div>
        <Typography variant="h5" className="text-helloBlue">
          Liste des patients
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
        <div className="flex gap-1">
          <Button
            variant="text"
            size="sm"
            className="flex items-center gap-2 text-helloBlue"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" /> Filtrer
          </Button>
          <Button
            variant="text"
            size="sm"
            className="flex items-center gap-2 text-helloBlue"
          >
            <ArrowsUpDownIcon className="h-5 w-5" /> Trier par
          </Button>
        </div>
      </div>
    </>
  );
};

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
        clipRule="evenodd"
      />
    </svg>
  );
}
const ListPatients = () => {
  return (
    <Card className="flex-1">
      <List className="max-h-80 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-thumb]:bg-helloBlue [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:rounded-xl [&::-webkit-scrollbar-track]:bg-slate-100">
        <ListItem ripple={false} className="py-1 pr-1 pl-4 border border-helloBlue">
          <ListItemPrefix>
            <Avatar
              variant="circular"
              alt="alexander"
              src="https://docs.material-tailwind.com/img/face-2.jpg"
            />
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
            George Menez
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
            menez@gmail.com
            </Typography>
          </div>
          <ListItemSuffix>
            <IconButton variant="text" color="blue-gray">
              <CircleArrowRight className="h-6 w-6" />
            </IconButton>
          </ListItemSuffix>
        </ListItem>
      </List>
    </Card>
  );
};

const ListHistoricRdv = () => {
    const historic = [
    {
        date: "18-02-25",
        heure: "08:00",
        pratiques: "Acupuncture",
        Duree: "25",
        Status: "Terminés",
        status_code: 0,
    },
    {
        date: "27-02-25",
        heure: "07:00",
        pratiques: "Naturopathie",
        Duree: "30",
        Status: "Terminés",
        status_code: 0,
    },
    {
        date: "15-03-25",
        heure: "11:00",
        pratiques: "Acupuncture",
        Duree: "25",
        Status: "A venir",
        status_code: 1,
    },
    ]
  return (
    <>
    <Table>
      <TableCaption>Historique des rendez-vous prises.</TableCaption>
      <TableHeader className="bg-gray-100">
        <TableRow>
          <TableHead className="w-max text-helloGray font-bold">Date et Heure</TableHead>
          <TableHead className="text-helloGray font-bold">Pratique</TableHead>
          <TableHead className="text-helloGray font-bold">Durée</TableHead>
          <TableHead className="text-right text-helloGray font-bold">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody >
        {historic.map((d) => (
          <TableRow key={d.date} className="text-helloBlue">
            <TableCell className="font-medium">{d.date} / {d.heure}</TableCell>
            <TableCell>{d.pratiques}</TableCell>
            <TableCell>{d.Duree} min</TableCell>
            <TableCell className="flex justify-end "> 
              <Chip 
                value={d.Status} 
                className={clsx(d.status_code === 0 ? "bg-helloSoin" : "bg-blue-400", "normal-case", "rounded-full")}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
    </>
  );
};

const DetailsPatients = () => {
  return (
    <>
      <div className="h-max flex flex-1 gap-6 flex-col bg-white rounded-xl shadow p-4 ">
        {/* Premiere section pour le photo et information principale */}
        <div className="flex gap-4">
          <img
            src="https://i.pravatar.cc/300"
            alt="Aperçu de la photo de profil"
            className="h-24 w-24 rounded-lg object-cover"
          />
          <div>
            <Typography variant="h5" className="mt-1 font-bold text-helloBlue">
              George Menez
            </Typography>
            <Typography
              variant="small"
              className="flex gap-4 mt-1 text-helloBlue"
            >
              <MailIcon className="h-4 w-4" />
              menez@gmail.com
            </Typography>
            <Typography
              variant="small"
              className="flex gap-4 mt-1 text-helloBlue"
            >
              <Phone className="h-4 w-4" />
              00000
            </Typography>
            <Typography
              variant="small"
              className="flex gap-4 mt-1 text-helloBlue"
            >
              <MapPin className="h-4 w-4" />
              Andoharanofotsy
            </Typography>
          </div>
        </div>
        {/* Second section info professionnelle */}
        <div className="">
          <Typography variant="h6" className="font-bold text-helloBlue">
            Informations Professionnelles
          </Typography>
          <ul className="space-y-2 text-helloBlue">
            <li className="flex">
              <span className="flex-1">Identifiant</span>
              <span className="flex-1 text-start">########</span>
            </li>
            <li className="flex">
              <span className="flex-1">Telephone</span>
              <span className="flex-1 text-start">00000</span>
            </li>
            <li className="flex">
              <span className="flex-1">Date</span>
              <span className="flex-1 text-start">04-03-2025</span>
            </li>
            <li className="flex">
              <span className="flex-1">Genre</span>
              <span className="flex-1 text-start">Femme</span>
            </li>
            <li className="flex">
              <span className="flex-1">Code postal</span>
              <span className="flex-1 text-start">90-202</span>
            </li>
          </ul>
        </div>
        {/* Troisieme section info professionnelle */}
        <div className="">
          <Typography variant="h6" className="font-bold text-helloBlue">
            Type de rendez-vous
          </Typography>
          <ul className="space-y-2 text-helloBlue">
            <li className="flex">
              <span className="flex-1">Acupuncture</span>
              <span className="flex-1 text-start font-bold text-sm">
                2 rendez-vous
              </span>
            </li>
            <li className="flex">
              <span className="flex-1">Naturopathie</span>
              <span className="flex-1 text-start font-bold text-sm">
                4 rendez-vous
              </span>
            </li>
          </ul>
        </div>
        {/* Derniere Section pour la liste des RDV */}
        <div className="">
          <Typography variant="h5" className="mb-2 font-bold text-helloBlue">
            Historiques des rendez-vous
          </Typography>
          <ListHistoricRdv />
        </div>
      </div>
    </>
  );
};

const PatientsPraticien = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 m-4 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center justify-between">
          <SearchBarFilter />
        </div>
        <div className="min-h-[100vh] flex gap-6 rounded-xl md:min-h-min">
          {/* Pour la liste et le details */}
          <ListPatients />
          <DetailsPatients />
        </div>
      </div>
    </>
  );
};

export default PatientsPraticien;
