let locale;
if (navigator.language.startsWith("en")) locale = "en-CA";

import { jsx } from "../../jsx";

import { PostProps } from ".";

export function Post(post: PostProps) {
  const created = new Date(post.created).toLocaleString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <a className="post hover" href={`blog/${post.slug}`}>
      <img
        className="post-cover"
        srcset={`blog/${post.cover.small} 1x, blog/${post.cover.medium} 2x, blog/${post.cover.large} 4x`}
        src={post.cover.small}
      />
      <div className="post-info">
        <p className="post-timestamp">{created}</p>
        <h3 className="post-title">
          <img className="post-icon emoji" src={`blog/${post.icon.url}`} />
          {post.title}
        </h3>
        <p className="post-description">{post.description}</p>
        <div className="post-tags">
          {...post.tags.map(tag => (
            <span className={`post-tag post-tag-${tag.color}`}>{tag.name}</span>
          ))}
        </div>
      </div>
    </a>
  );
}