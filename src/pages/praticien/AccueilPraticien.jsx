import { ListTable } from "@/components/praticienComponents/list-table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { findAppointements } from "@/services/appointement-services";

const AccueilPraticien = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Configuration du viewport pour éviter le zoom manuel sur mobile
  useEffect(() => {
    const viewport = document.querySelector("meta[name=viewport]");
    const contentValue =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    if (viewport) {
      viewport.setAttribute("content", contentValue);
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = contentValue;
      document.head.appendChild(meta);
    }
  }, []);

  // Suivi dynamique de la largeur de l'écran
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Récupération des rendez-vous
  useEffect(() => {
    async function fetchPratiques() {
      const appointJson = await findAppointements();
      setAppointments(appointJson);
    }
    fetchPratiques();
  }, []);

  const todayStr = format(new Date(), "dd-MM-yyyy");
  const todayAppointments = appointments.filter(app => app.date === todayStr);

  function getAppointmentsForNextWeekDays(appointments) {
    // Date d'aujourd'hui en commençant par minuit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date limite : 7 jours à partir d'aujourd'hui
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    return appointments.filter(appointment => {
      const [day, month, year] = appointment.date.split("-").map(Number);
      const appointmentDate = new Date(year, month - 1, day);
      return appointmentDate >= today && appointmentDate <= sevenDaysLater;
    });
  }

  const nextWeekDaysAppointments = getAppointmentsForNextWeekDays(appointments);

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 m-4 p-4 bg-muted/50 rounded-xl">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-2">
          {/* First Card */}
          <div className="flex items-start justify-between p-5 bg-helloSoin rounded-xl shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm text-gray-100">
                Rendez-vous <br />
                du jour
              </div>
              <div className="flex items-center pt-1">
                <div className="text-xl font-medium text-gray-100">
                  {todayAppointments.length}
                </div>
              </div>
            </div>
            <div className="text-gray-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 51 51"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M48.875 12.75L28.687 32.938 18.063 22.312 2.126 38.25"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M36.125 12.75h12.75V25.5"
                />
              </svg>
            </div>
          </div>
          {/* Second card */}
          <div className="flex gap-2 items-start justify-between p-5 bg-helloOrange rounded-xl shadow-sm">
            <div className="flex flex-col justify-between h-full">
              <div className="text-sm text-white">
                Rendez-vous <br /> 7 prochaines jours
              </div>
              <div className="flex items-center pt-1">
                <div className="text-xl font-medium text-white">
                  {nextWeekDaysAppointments.length}
                </div>
              </div>
            </div>
            <div className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 47 46"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M41.536 30.456a19.21 19.21 0 01-5.675 7.4 19.771 19.771 0 01-8.557 3.937c-3.138.608-6.38.455-9.444-.447a19.673 19.673 0 01-8.129-4.725 19.1 19.1 0 01-4.92-7.902 18.775 18.775 0 01-.564-9.237 18.98 18.98 0 013.923-8.419 19.538 19.538 0 017.497-5.639"
                />
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M43.083 23c0-2.517-.506-5.01-1.49-7.335a19.142 19.142 0 00-4.246-6.218 19.617 19.617 0 00-6.353-4.155A19.953 19.953 0 0023.5 3.833V23h19.583z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <ListTable todayAppointments={todayAppointments} />
        </div>
      </div>
    </>
  );
};

export default AccueilPraticien;
