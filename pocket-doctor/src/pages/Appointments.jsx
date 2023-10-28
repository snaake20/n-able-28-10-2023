import AppointmentCalendar from "../components/calendar/AppointmentCalendar";
import AppointmentsList from "../components/calendar/AppointmentsList";

export default function Appointments() {
  return <div className="py-[10vh] flex justify-center flex-col items-center">
    <AppointmentCalendar />

    <AppointmentsList />
  </div>;
}
