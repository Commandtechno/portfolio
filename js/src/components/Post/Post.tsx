import { jsx } from "../../jsx";

import { PostProps } from ".";

export function Post(post: PostProps) {
  return (
    <a className="post hover" href={`blog/${post.slug}`}>
      <img
        className="post-cover"
        srcset={`blog/${post.cover.small} 1x, blog/${post.cover.medium} 2x, blog/${post.cover.large} 4x`}
        src={post.cover.small}
      />
      <div className="post-info">
        <h3 className="post-title">
          <img className="post-icon emoji" src={`blog/${post.icon}`} />
          code blocks
        </h3>
        <p className="post-description">{post.description}</p>
        <div className="post-tags">
          {post.tags.map(tag => (
            <div className="tag">{tag.name}</div>
          ))}
        </div>
      </div>
    </a>
  );
}