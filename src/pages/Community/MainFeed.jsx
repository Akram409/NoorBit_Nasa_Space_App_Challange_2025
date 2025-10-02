import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Pin, Star } from 'lucide-react';

const MainFeed = ({ activeTab, setActiveTab }) => {
  const tabs = ['Hot', 'New', 'All'];
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleLike = (postId) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const posts = [
    {
      id: 1,
      isPinned: true,
      author: 'CA',
      authorName: 'START HERE',
      content: 'New to the community? Start here with introductions.',
      likes: 14,
      comments: 14,
      shares: 86,
      timeAgo: '2h'
    },
    {
      id: 2,
      author: 'CA',
      authorName: 'Community Guidelines',
      content: 'Community Guidelines',
      likes: 725,
      shares: 319,
      timeAgo: '4h'
    },
    {
      id: 3,
      author: 'CA',
      authorName: 'Take Action Together!',
      content: 'Take Action Together!',
      likes: 817,
      shares: 422,
      timeAgo: '6h'
    },
    {
      id: 4,
      author: 'CA',
      authorName: 'Dhaka Heat Hits 39°C - Need Solutions',
      content: 'The extreme heat is affecting everyone. What solutions can we implement in our community?',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
      hashtags: ['#dhakaheat', '#hot', '#HOWTOIOT'],
      likes: 58,
      shares: 81,
      timeAgo: '8h'
    },
    {
      id: 5,
      author: 'GI',
      authorName: '15k Trees = 2.4°C Cooler',
      content: 'Our tree planting initiative could reduce urban temperatures significantly. Join us!',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
      timeAgo: '12h'
    }
  ];

  return (
    <div className="main-feed">
      <div className="feed-header">
        <div className="feed-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="create-post-btn">
          Create a post
        </button>
      </div>

      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            {post.isPinned && (
              <div className="pinned-badge">
                <Pin size={16} />
                <span>Pinned</span>
              </div>
            )}
            
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">{post.author}</div>
                <div className="author-info">
                  <div className="author-name">{post.authorName}</div>
                  <div className="post-time">{post.timeAgo}</div>
                </div>
              </div>
              <button className="post-menu">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="post-content">
              <p>{post.content}</p>
              {post.image && (
                <div className="post-image">
                  <img src={post.image} alt="Post content" />
                </div>
              )}
              {post.hashtags && (
                <div className="post-hashtags">
                  {post.hashtags.map((tag, index) => (
                    <span key={index} className="hashtag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="post-actions">
              <button 
                className={`action-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <Heart size={18} fill={likedPosts.has(post.id) ? '#ef4444' : 'none'} />
                <span>Like</span>
              </button>
              <button className="action-btn">
                <MessageCircle size={18} />
                <span>{post.comments || 0}</span>
              </button>
              <div className="post-stats">
                <span className="stat">
                  <Star size={14} />
                  {post.shares}
                </span>
                {post.likes && (
                  <span className="stat likes">
                    {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainFeed;
