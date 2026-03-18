import type { ShowSummary } from "@show-booking/types";
import { api } from "./api";

type BackendShowResponse = {
  id: number;
  title: string;
  description: string;
  duration: number;
  language: string;
  genre: string;
  posterUrl: string;
  timings: ShowSummary["timings"];
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

export async function createShow(show: Omit<BackendShowResponse, "id" | "timings">, imageFile?: File): Promise<ShowSummary> {
  if (imageFile) {
    const formData = new FormData();
    formData.append("title", show.title);
    formData.append("description", show.description);
    formData.append("duration", show.duration.toString());
    formData.append("language", show.language);
    formData.append("genre", show.genre);
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
  if (show.posterUrl) formData.append("posterUrl", show.posterUrl);
  
  const response = await api.post<BackendShowResponse>("/shows", formData);
  return mapShow(response.data);
}

export async function updateShow(showId: number, show: Omit<BackendShowResponse, "id" | "timings">, imageFile?: File): Promise<ShowSummary> {
  const formData = new FormData();
  formData.append("title", show.title);
  formData.append("description", show.description);
  formData.append("duration", show.duration.toString());
  formData.append("language", show.language);
  formData.append("genre", show.genre);
  
  if (imageFile) {
    formData.append("image", imageFile);
  } else if (show.posterUrl) {
    formData.append("posterUrl", show.posterUrl);
  }
  
  const response = await api.put<BackendShowResponse>(`/shows/${showId}`, formData);
  return mapShow(response.data);
}

export async function deleteShow(showId: number): Promise<void> {
  await api.delete(`/shows/${showId}`);
}
