import { $ } from "./util/$";

import { Post, PostProps } from "./components/Post";

function prefetch({ target }) {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = target.href;
  document.head.appendChild(link);
  target.removeEventListener("mouseenter", prefetch);
}

export async function blog() {
  const postListElement = $<HTMLDivElement>("post-list");
  const posts: PostProps[] = await fetch("/blog/latest.json").then(res => res.json());

  for (const post of posts) {
    const postElement = Post(post);
    postListElement.append(postElement);
  }
}