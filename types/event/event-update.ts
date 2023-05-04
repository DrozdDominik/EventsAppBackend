export interface EventUpdate {
  name?: string;
  description?: string;
  isChosen?: boolean;
  time?: string;
  duration?: number;
  date?: string;
  link?: string;
  lat?: number;
  lon?: number;
  categoryId?: string;
}

export type UpdateProperty = keyof EventUpdate;
