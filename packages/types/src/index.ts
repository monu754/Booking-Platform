export type AppRole = "USER" | "ADMIN" | "ORGANIZER" | "STAFF";

export type AuthPayload = {
  token: string;
  name: string;
  email: string;
  roles: AppRole[];
};

export type ShowTimingSummary = {
  id: number;
  screenName: string;
  venueName: string;
  venueCity: string;
  startTime: string;
  price: number;
};

export type ShowSummary = {
  id: number;
  title: string;
  description: string;
  durationMinutes: number;
  language: string;
  genre: string;
  posterUrl: string;
  timings?: ShowTimingSummary[];
};

export type SeatMapItem = {
  id: number;
  showTimingId: number;
  label: string;
  status: "AVAILABLE" | "BOOKED";
};

export type BookingSummary = {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  showTimingId: number | null;
  seatIds: number[];
  paymentStatus: string | null;
  transactionId: string | null;
  paymentMethod: string | null;
};

export type CreateBookingRequest = {
  showTimingId: number;
  seatIds: number[];
};

export type PaymentSimulationRequest = {
  bookingId: number;
  paymentMethod: string;
  outcome: "SUCCESS" | "FAILED";
};

export type PaymentSimulationResponse = {
  bookingId: number;
  transactionId: string;
  paymentStatus: "SUCCESS" | "FAILED";
  bookingStatus: "CONFIRMED" | "FAILED";
  paymentMethod: string;
};
