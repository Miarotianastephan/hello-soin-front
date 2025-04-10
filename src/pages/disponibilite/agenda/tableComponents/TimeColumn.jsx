import React from 'react';
import { DAY_COLUMN_HEIGHT } from '../utils/agendaUtils';

const HEADER_HEIGHT = 60;

const TimeColumn = () => {
  const intervals = [];
  const totalIntervals = 24 * 12; // 288 intervalles de 5 minutes
  for (let i = 0; i < totalIntervals; i++) {
    const hour = Math.floor(i / 12);
    const minute = (i % 12) * 5;
    const timeLabel =
      (hour < 10 ? '0' : '') +
      hour +
      ':' +
      (minute < 10 ? '0' : '') +
      minute;
    intervals.push(timeLabel);
  }

  const contentHeight = DAY_COLUMN_HEIGHT - HEADER_HEIGHT;

  return (
    <div 
      className="relative" 
      style={{ 
        height: `${DAY_COLUMN_HEIGHT}px`,
        width: '50px'
      }}
    >
      <div
        className="sticky top-0 bg-white z-10 border-b p-1"
        style={{ height: `${HEADER_HEIGHT}px` }}
      />
      <div
        style={{
          position: 'absolute',
          top: `${HEADER_HEIGHT}px`,
          height: `${contentHeight}px`,
          width: '100%'
        }}
      >
        {intervals.map((time, idx) => {
          const top = idx * (contentHeight / totalIntervals);
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: `${top}px`,
                height: `${contentHeight / totalIntervals}px`,
                width: '100%',
                borderBottom: (idx % 4 === 3) ? '1px solid #ccc' : 'none',
                textAlign: (idx % 4 === 0) ? 'left' : 'right',
                fontWeight: (idx % 4 === 0) ? 'bold' : '',
                paddingLeft: (idx % 4 === 0) ? '4px' : '0px',
                paddingRight: (idx % 4 === 0) ? '0px' : '4px',
                fontSize: '10px'
              }}
              className='text-gray-700 text-xs'
            >
              {time}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeColumn;
