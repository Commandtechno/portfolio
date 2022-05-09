import { Post, PostProps } from "./components/Post";
import { prefetch } from "./util/prefetch";
import { $ } from "./util/$";

export async function blog() {
  const postListElement = $<HTMLDivElement>("post-list");
  const posts: PostProps[] = await fetch("/blog/latest.json").then(res => res.json());

  for (const post of posts) {
    const postElement = Post(post);
    postElement.addEventListener("mouseenter", prefetch, { once: true });
    postListElement.append(postElement);
  }
}