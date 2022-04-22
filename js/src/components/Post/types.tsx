export interface PostProps {
  title: string;
  slug: string;
  icon: {
    emoji: string;
    url: string;
  };
  cover: {
    small: string;
    medium: string;
    large: string;
  };

  created: string;
  updated: string;
  description?: string;
  tags: {
    name: string;
    color: string;
  }[];

  published: boolean;
}