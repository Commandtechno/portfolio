export interface ActivityProps {
  application_id: string;
  type: number;
  timestamps: {
    start: number;
    end: number;
  };
  state: string;
  sync_id: string;
  party: {
    id: string;
    size: [number, number];
  };
  name: string;
  id: string;
  details: string;
  created_at: number;
  assets: {
    large_image: string;
    large_text: string;
    small_image: string;
    small_text: string;
  };
}