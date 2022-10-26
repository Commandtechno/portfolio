import { ActivityType } from "../../constants";

export interface ActivityProps {
  id: string;
  name: string;
  type: typeof ActivityType[keyof typeof ActivityType];
  url?: string | null;
  created_at: number;
  timestamps: {
    start: number;
    end: number;
  };
  sync_id: string;
  platform: string;
  application_id: string;
  details?: string | null;
  state?: string | null;
  emoji?: { id: string; animated: boolean } | { name: string };
  party: {
    id?: string;
    size?: [current_size: number, max_size: number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
  buttons?: string[];
}