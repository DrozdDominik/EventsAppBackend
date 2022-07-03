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
}

export interface NewEventEntity extends Omit<EventEntity, 'id' | 'isChosen' | 'link'> {
  id?: string;
  isChosen?: boolean;
  link?: string | null;
}

export type MainEventEntity = Omit<EventEntity, 'link' | 'lat' | 'lon'>