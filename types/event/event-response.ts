export interface EventResponse {
  name: string;
  description: string;
  category: string;
  estimatedTime: number;
  date: string;
  link: string | null;
  lat: number;
  lon: number;
}
