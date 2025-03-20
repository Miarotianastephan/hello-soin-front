import React from 'react';
import { getColorByType } from '../utils/agendaUtils';
import { IconButton, Tooltip, Typography } from '@material-tailwind/react';
import { Info } from 'lucide-react';

const AppointmentsList = ({ appointments }) => (
  <div className="p-1 text-helloBlue">
    {/* Legende por les types de pratiques */}
    <div className="flex gap-8 mb-2 p-2">
      <div className="flex items-center">
        <span
          className="mr-1"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: getColorByType('naturopathie'),
          }}
        />
        <span>Naturopathie</span>
      </div>
      <div className="flex items-center">
        <span
          className="mr-1"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: getColorByType('acupuncture'),
          }}
        />
        <span>Acupuncture</span>
      </div>
      <div className="flex items-center">
        <span
          className="mr-1"
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: getColorByType('hypnose'),
          }}
        />
        <span>Hypnose</span>
      </div>
    </div>
    
    {appointments.length === 0 ? (
      <p>Aucun rendez‑vous.</p>
    ) : (
      //  border-separate border-spacing-4
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="rounded-l-full p-4"></th>
            <th className="p-4">Nom</th>
            <th className="p-4">Telephone</th>
            <th className="p-4">Date</th>
            <th className="p-4">Pratique</th>
            <th className="p-2">Heure</th>
            <th className="rounded-r-full p-4">Motif</th>
          </tr>
        </thead>
        <tbody>
          {appointments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((app, idx) => (
              <tr key={idx} className="odd:bg-gray-100 gap-4">
                <td className="rounded-l-full px-4">
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      backgroundColor: getColorByType(app.practice_type),
                    }}
                  />
                </td>
                <td className="px-4">
                  <div className="flex items-center gap-3">
                    {/* <Avatar src={img} alt={name} size="sm" /> */}
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        className="font-bold text-helloBlue"
                      >
                        {app.patient.nom} {app.patient.prenom}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal opacity-70 text-helloBlue"
                      >
                        {app.patient.email}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="px-4">
                  <Typography
                    variant="small"
                    className="w-max font-normal opacity-70 text-helloBlue"
                  >
                    {app.patient.numero}
                  </Typography>
                </td>
                <td className="px-4">
                  <Typography
                    variant="small"
                    className="w-max font-normal opacity-70 text-helloBlue"
                  >
                    {app.date}
                  </Typography>
                </td>
                <td className="px-4 capitalize">{app.practice.type}</td>
                <td className="w-max px-2">
                  <Typography
                    variant="small"
                    className="font-normal opacity-70 text-helloBlue whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]"
                  >
                  {app.practice.start} - {app.practice.end}
                  </Typography>
                </td>
                <td className="rounded-r-full px-4">
                  <Tooltip content={app.motif || "Motif absent !"}>
                    <IconButton
                      variant="text"
                    >
                      <Info className="h-5 w-5" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
);

export default AppointmentsList;
