import { BookingCalendar } from "@/components/booking-calendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">Appliance Bookings</h1>
      <div className="flex-1">
        <BookingCalendar />
      </div>
    </div>
  );
}
