export interface PostProps {
  created: string;
  updated: string;

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

  title: string;
  description?: string;
  tags: {
    name: string;
    color: string;
  }[];

  published: boolean;
}