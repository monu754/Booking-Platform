import type { ShowSummary, VenueSummary } from "@show-booking/types";
import { api } from "./api";

type BackendShowResponse = {
  id: number;
  title: string;
  description: string;
  duration: number;
  language: string;
  genre: string;
  posterUrl: string;
  venueIds: number[];
  venues: VenueSummary[];
  timings: ShowSummary["timings"];
};

export type ShowFormPayload = {
  title: string;
  description: string;
  duration: number;
  language: string;
  genre: string;
  posterUrl: string;
  venueIds: number[];
  timings: {
    venueId: number;
    startTime: string;
    price: number;
  }[];
};

function mapShow(response: BackendShowResponse): ShowSummary {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    durationMinutes: response.duration,
    language: response.language,
    genre: response.genre,
    posterUrl: response.posterUrl,
    venues: response.venues,
    timings: response.timings,
  };
}

export async function getShows(): Promise<ShowSummary[]> {
  const response = await api.get<BackendShowResponse[]>("/shows");
  return response.data.map(mapShow);
}

export async function getShowById(showId: number): Promise<ShowSummary> {
  const response = await api.get<BackendShowResponse>(`/shows/${showId}`);
  return mapShow(response.data);
}

export async function getManagedShows(): Promise<ShowSummary[]> {
  const response = await api.get<BackendShowResponse[]>("/shows/manage");
  return response.data.map(mapShow);
}

export async function createShow(show: ShowFormPayload, imageFile?: File): Promise<ShowSummary> {
  const posterUrl = show.posterUrl.trim();
  if (imageFile) {
    const formData = new FormData();
    formData.append("title", show.title);
    formData.append("description", show.description);
    formData.append("duration", show.duration.toString());
    formData.append("language", show.language);
    formData.append("genre", show.genre);
    show.venueIds.forEach((venueId) => formData.append("venueIds", venueId.toString()));
    formData.append("timings", JSON.stringify(show.timings));
    formData.append("image", imageFile);
    
    const response = await api.post<BackendShowResponse>("/shows", formData);
    return mapShow(response.data);
  }
  
  // If no file but URL is provided, we still need to send as form-data because the backend expects it now for consistency
  const formData = new FormData();
  formData.append("title", show.title);
  formData.append("description", show.description);
  formData.append("duration", show.duration.toString());
  formData.append("language", show.language);
  formData.append("genre", show.genre);
  show.venueIds.forEach((venueId) => formData.append("venueIds", venueId.toString()));
  formData.append("timings", JSON.stringify(show.timings));
  if (posterUrl) formData.append("posterUrl", posterUrl);
  
  const response = await api.post<BackendShowResponse>("/shows", formData);
  return mapShow(response.data);
}

export async function updateShow(showId: number, show: ShowFormPayload, imageFile?: File): Promise<ShowSummary> {
  const posterUrl = show.posterUrl.trim();
  const formData = new FormData();
  formData.append("title", show.title);
  formData.append("description", show.description);
  formData.append("duration", show.duration.toString());
  formData.append("language", show.language);
  formData.append("genre", show.genre);
  show.venueIds.forEach((venueId) => formData.append("venueIds", venueId.toString()));
  formData.append("timings", JSON.stringify(show.timings));
  
  if (imageFile) {
    formData.append("image", imageFile);
  } else if (posterUrl) {
    formData.append("posterUrl", posterUrl);
  }
  
  const response = await api.put<BackendShowResponse>(`/shows/${showId}`, formData);
  return mapShow(response.data);
}

export async function deleteShow(showId: number): Promise<void> {
  await api.delete(`/shows/${showId}`);
}
