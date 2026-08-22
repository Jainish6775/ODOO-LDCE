import { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiMoreHorizontal, FiSend, FiMapPin, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import './Community.css';

export default function Community() {
  const [activeTab, setActiveTab] = useState('For You');
  
  // Mock data for community posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: 'Sarah Jenkins',
        handle: '@sarahj_travels',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timeAgo: '2 hours ago',
      content: 'Just finished an amazing 14-day trip across Japan! The cherry blossoms in Kyoto were absolutely breathtaking. I highly recommend taking the bullet train down to Osaka for the street food.',
      tripDetails: {
        title: 'Spring in Japan',
        destinations: 'Tokyo, Kyoto, Osaka',
        duration: '14 Days',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      likes: 342,
      comments: 28,
      liked: true,
      saved: false
    },
    {
      id: 2,
      author: {
        name: 'Marcus Chen',
        handle: '@marcus_wanders',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timeAgo: '5 hours ago',
      content: 'Anyone have recommendations for budget accommodations in Rome? Planning a backpacking trip for this summer!',
      tripDetails: null,
      likes: 12,
      comments: 45,
      liked: false,
      saved: false
    },
    {
      id: 3,
      author: {
        name: 'Elena Rodriguez',
        handle: '@elena_explores',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timeAgo: '1 day ago',
      content: 'My ultimate guide to the Swiss Alps is finally live! We managed to stay under $100/day by cooking our own meals and taking advantage of the local hiking passes.',
      tripDetails: {
        title: 'Swiss Alps on a Budget',
        destinations: 'Interlaken, Zermatt',
        duration: '7 Days',
        image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      likes: 890,
      comments: 156,
      liked: false,
      saved: true
    }
  ]);

  const trendingTags = ['#Japan2026', '#BudgetTravel', '#SoloTravel', '#EuroSummer', '#Hiking', '#DigitalNomad'];

  const toggleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { 
          ...post, 
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1 
        };
      }
      return post;
    }));
  };

  const toggleSave = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        if (!post.saved) toast.success('Saved to your bookmarks!');
        return { ...post, saved: !post.saved };
      }
      return post;
    }));
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Travel Community</h1>
        <p className="text-neutral-500">Get inspired, ask questions, and share your adventures.</p>
      </div>

      <div className="community-layout mt-6">
        {/* Main Feed */}
        <div className="community-feed">
          {/* Create Post Input */}
          <div className="card create-post-card mb-6">
            <div className="card-body">
              <div className="create-post-input-area">
                <div className="avatar">ME</div>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Share your travel experiences or ask for advice..." 
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
              </div>
              <div className="create-post-actions mt-3">
                <button className="btn btn-ghost btn-sm text-primary-600">
                  <FiMapPin /> Attach Trip
                </button>
                <button className="btn btn-primary btn-sm">
                  Post
                </button>
              </div>
            </div>
          </div>

          <div className="tabs feed-tabs mb-6">
            {['For You', 'Following', 'Trending'].map(tab => (
              <button 
                key={tab} 
                className={`tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Posts Stream */}
          <div className="posts-stream">
            {posts.map(post => (
              <div key={post.id} className="card post-card">
                <div className="card-body">
                  
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="post-author-info">
                      <img src={post.author.avatar} alt={post.author.name} className="avatar" />
                      <div>
                        <div className="post-author-name">{post.author.name}</div>
                        <div className="post-author-meta">
                          <span>{post.author.handle}</span> • <span>{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                    <button className="btn-icon btn-sm text-neutral-400"><FiMoreHorizontal /></button>
                  </div>
                  
                  {/* Post Content */}
                  <div className="post-content mt-4">
                    <p>{post.content}</p>
                  </div>

                  {/* Attached Trip Card (if any) */}
                  {post.tripDetails && (
                    <div className="post-trip-attachment mt-4">
                      <img src={post.tripDetails.image} alt={post.tripDetails.title} className="post-trip-image" />
                      <div className="post-trip-info">
                        <h4>{post.tripDetails.title}</h4>
                        <div className="post-trip-meta">
                          <span><FiMapPin /> {post.tripDetails.destinations}</span>
                          <span><FiCalendar /> {post.tripDetails.duration}</span>
                        </div>
                        <button className="btn btn-secondary btn-sm mt-2">View Itinerary</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Footer/Actions */}
                <div className="card-footer post-footer">
                  <button 
                    className={`post-action-btn ${post.liked ? 'liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <FiHeart fill={post.liked ? 'currentColor' : 'none'} />
                    <span>{post.likes}</span>
                  </button>
                  <button className="post-action-btn">
                    <FiMessageCircle />
                    <span>{post.comments}</span>
                  </button>
                  <button className="post-action-btn">
                    <FiShare2 />
                  </button>
                  
                  <div style={{ flex: 1 }}></div>
                  
                  <button 
                    className={`post-action-btn ${post.saved ? 'saved' : ''}`}
                    onClick={() => toggleSave(post.id)}
                  >
                    <FiBookmark fill={post.saved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="community-sidebar hide-mobile">
          <div className="card trending-card mb-6">
            <div className="card-body">
              <h3 className="widget-title">Trending Topics</h3>
              <div className="trending-tags mt-4">
                {trendingTags.map(tag => (
                  <div key={tag} className="trending-tag-item">
                    <div className="trending-tag-name">{tag}</div>
                    <div className="trending-tag-count">{Math.floor(Math.random() * 5000) + 100} posts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="card suggestion-card">
            <div className="card-body">
              <h3 className="widget-title">Top Contributors</h3>
              <div className="user-suggestion mt-4">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="avatar avatar-sm" />
                <div className="user-suggestion-info">
                  <div className="font-bold text-sm">David Kim</div>
                  <div className="text-xs text-neutral-500">Expert Planner</div>
                </div>
                <button className="btn btn-secondary btn-sm ml-auto">Follow</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
