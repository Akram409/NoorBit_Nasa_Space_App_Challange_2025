import React from 'react';
import { ChevronRight, Users } from 'lucide-react';

const RightSidebar = () => {
  const topPosts = [
    {
      id: 1,
      title: 'How To Spend The Perfect Day',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop',
      engagement: '40k'
    },
    {
      id: 2,
      title: 'How To Spend The Perfect Day',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=60&h=60&fit=crop',
      engagement: '32k'
    },
    {
      id: 3,
      title: 'How To Spend The Perfect Day',
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=60&h=60&fit=crop',
      engagement: '28k'
    },
    {
      id: 4,
      title: 'How To Spend The Perfect Day On Os...',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=60&h=60&fit=crop',
      engagement: '25k'
    }
  ];

  return (
    <div className="right-sidebar">
      <div className="community-info">
        <h3>EcoPath Community</h3>
        <p className="community-description">
          Join billions in saving your city 
          preserve and heal your city every small step counts.
        </p>
        
        <div className="user-info-section">
          <div className="current-user">
            <div className="user-avatar-small">A</div>
            <div>
              <div className="username">amal_uddin</div>
              <div className="user-role">Community Member &gt;</div>
            </div>
          </div>
          
          <div className="user-sections">
            <div className="section-item">
              <span>My posts</span>
              <ChevronRight size={16} />
            </div>
            <div className="section-item">
              <span>My comments</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="community-rules">
        <h4>Community rules</h4>
        <div className="no-content">
          <Users size={40} />
          <p>No Offensive Content</p>
        </div>
        <div className="rule-links">
          <a href="#">Terms of Use Code of Conduct</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>

      <div className="top-posts">
        <h4>👑 Top Post</h4>
        <div className="posts-list">
          {topPosts.map(post => (
            <div key={post.id} className="top-post-item">
              <img src={post.image} alt={post.title} className="post-thumbnail" />
              <div className="post-info">
                <p className="post-title">{post.title}</p>
                <span className="post-engagement">{post.engagement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
