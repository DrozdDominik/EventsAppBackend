export interface EventResponse {
  name: string;
  description: string;
  category: string;
  estimatedTime: number;
  link: string | null;
  lat: number;
  lon: number;
}
