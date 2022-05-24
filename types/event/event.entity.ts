export interface EventEntity {
    id?: string;
    name: string;
    description: string;
    is_chosen?: boolean;
    estimated_time: number;
    link?: string | null;
    lat: number;
    lon: number;
}