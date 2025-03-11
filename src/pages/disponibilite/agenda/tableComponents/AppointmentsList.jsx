import React from 'react';
import { getColorByType } from '../utils/agendaUtils';

const AppointmentsList = ({ appointments }) => (
  <div className="p-1">
    <div className="flex gap-4 my-2">
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
      <table className="w-full">
        <thead>
          <tr className="text-left border-b bg-gray-200">
            <th></th>
            <th>Date</th>
            <th>Heure</th>
            <th>Patient</th>
            <th>Motif</th>
          </tr>
        </thead>
        <tbody>
          {appointments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((app, idx) => (
              <tr key={idx} className="border-b">
                <td>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      backgroundColor: getColorByType(app.practice.type),
                    }}
                  />
                </td>
                <td>{app.date}</td>
                <td>
                  {app.practice.start} - {app.practice.end}
                </td>
                <td>
                </td>
                <td>{app.motif}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )}
  </div>
);

export default AppointmentsList;
