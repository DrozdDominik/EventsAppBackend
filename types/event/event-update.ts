export interface EventUpdate {
  name?: string;
  description?: string;
  isChosen?: boolean;
  estimatedTime?: number;
  link?: string;
  lat?: number;
  lon?: number;
  categoryId?: string;
}

export type UpdateProperty = keyof EventUpdate;
