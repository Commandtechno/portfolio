import { $ } from "./util/$";

interface Post {
  created: string;
  updated: string;

  title: string;
  description?: string;

  published: boolean;
  tags: {
    name: string;
    color: string;
  }[];

  cover: string;
  icon: {
    emoji: string;
    url: string;
  };
}

export async function blog() {
  // const latest = await fetch("/blog/latest").then(res => res.json());
  const posts: Post[] = [
    {
      created: "2022-03-28T20:51:00.000Z",
      updated: "2022-04-18T21:11:00.000Z",
      title: "table",
      tags: [],
      published: true,
      icon: { emoji: "🪑", url: "assets/223c35ad9b57facc9d052dbfbf7bf0ac.svg" },
      cover: "assets/503fdb74079c426ae6234a28ea7cad1d.webp"
    },
    {
      created: "2022-03-24T00:19:00.000Z",
      updated: "2022-04-18T21:11:00.000Z",
      title: "twitter",
      tags: [],
      published: true,
      icon: { emoji: "🐦", url: "assets/6e0c68e0c8469e16b4fb1b200eb4e74e.svg" },
      cover: "assets/44ca77d4aa658ca0ea1ef719c580b304.webp"
    },
    {
      created: "2022-03-22T05:20:00.000Z",
      updated: "2022-04-16T21:13:00.000Z",
      title: "code blocks",
      description: "i love packaging my node projects into exes and binaries for all platforms",
      tags: [],
      published: true,
      icon: { emoji: "👨‍💻", url: "assets/921f791226d0bf3b12d6674ec4dcc7d4.svg" },
      cover: "assets/21c2b5fd167c1452f345ad1416bb8341.webp"
    },
    {
      created: "2022-03-22T01:53:51.007Z",
      updated: "2022-04-16T23:38:00.000Z",
      title: "Building a scalable scraper",
      description:
        "Definitely 100% my Rust project for (politely) checking thousands of social media pages every day (real)",
      tags: [
        { name: "Programming", color: "green" },
        { name: "Personal Project", color: "brown" },
        { name: "Rust", color: "purple" }
      ],
      published: true,
      icon: { emoji: "🔭", url: "assets/21aff55e49dc210ad47e6a1e70df4465.svg" },
      cover: "assets/5bf91f11a206c6dd776f7ed075f259f3.gif"
    }
  ];

  const postListElement = $<HTMLDivElement>("post-list");

  for (const post of posts) {
    const postElement = document.createElement("div");
    postElement.className = "post";

    const postCoverElement = document.createElement("img");
    postCoverElement.className = "post-cover";
    postCoverElement.src = "blog/" + post.cover;
    postElement.appendChild(postCoverElement);

    const postInfoElement = document.createElement("div");
    postInfoElement.className = "post-info";

    const postTitleElement = document.createElement("h3");
    postTitleElement.className = "post-title";

    const postIconElement = document.createElement("img");
    postIconElement.className = "emoji";
    postIconElement.src = "blog/" + post.icon.url;

    postTitleElement.appendChild(postIconElement);
    postTitleElement.append(post.title);
    postInfoElement.appendChild(postTitleElement);

    if (post.description) {
      const descriptionElement = document.createElement("p");
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