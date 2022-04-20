import { $ } from "./util/$";

interface Post {
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

export async function blog() {
  const postListElement = $<HTMLDivElement>("post-list");
  const posts: Post[] = await fetch("/blog/latest.json").then(res => res.json());

  for (const post of posts) {
    const postElement = document.createElement("a");
    postElement.className = "post hover";
    postElement.href = `blog/${post.slug}`;

    const postCoverElement = document.createElement("img");
    postCoverElement.className = "post-cover";
    postCoverElement.src = "blog/" + post.cover.medium;
    postElement.appendChild(postCoverElement);

    const postInfoElement = document.createElement("div");
    postInfoElement.className = "post-info";

    const postTitleElement = document.createElement("h3");
    postTitleElement.className = "post-title";

    const postIconElement = document.createElement("img");
    postIconElement.className = "post-icon emoji";
    postIconElement.src = "blog/" + post.icon.url;

    postTitleElement.appendChild(postIconElement);
    postTitleElement.append(post.title);
    postInfoElement.appendChild(postTitleElement);

    if (post.description) {
      const descriptionElement = document.createElement("p");
      descriptionElement.className = "post-description";
      descriptionElement.innerText = post.description;
      postInfoElement.appendChild(descriptionElement);
    }

    postElement.appendChild(postInfoElement);

    // for (const tag of post.tags) {
    //   const tagElement = $<HTMLDivElement>("post-tag");
    //   const tagNameElement = $<HTMLSpanElement>("post-tag-name");
    //   const tagColorElement = $<HTMLSpanElement>("post-tag-color");

    //   tagNameElement.innerText = tag.name;
    //   tagColorElement.style.backgroundColor = tag.color;

    //   tagElement.append(tagNameElement, tagColorElement);
    //   tagsElement.append(tagElement);
    // }

    postListElement.append(postElement);
  }
}