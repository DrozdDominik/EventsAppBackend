export interface SimpleEventEntity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface EventEntity extends SimpleEventEntity {
  description: string;
  isChosen: boolean;
  estimatedTime: number;
  link: string | null;
  userId: string;
}

export interface NewEventEntity extends Omit<EventEntity, 'id' | 'isChosen' | 'link'> {
  id?: string;
  isChosen?: boolean;
  link?: string | null;
}

export interface MainEventEntityResult {
  id: string;
  name: string;
  description: string;
  is_chosen: boolean;
  estimated_time: number;
  user_id: string;
}

export type MainEventData = Omit<EventEntity, 'link' | 'lat' | 'lon'>