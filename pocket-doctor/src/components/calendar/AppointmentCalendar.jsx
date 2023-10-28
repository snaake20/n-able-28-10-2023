import React, { useMemo } from 'react'

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function AppointmentCalendar() {
  const currentDate = useMemo(() => {
    new Date()
  })

  return (
    <div>
        <Calendar 
        activeStartDate={currentDate}
        defaultView="month"
        locale="ro"
        />
    </div>
  )
}

export default AppointmentCalendar