import { useState, useEffect } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiMoreHorizontal, FiSend, FiMapPin, FiCalendar, FiCopy } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { communityAPI } from '../../services/api';
import './Community.css';

export default function Community() {
  const [activeTab, setActiveTab] = useState('Trending');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunityTrips();
  }, []);

  const fetchCommunityTrips = async () => {
    try {
      setLoading(true);
      const res = await communityAPI.getPublicTrips();
      // Map trips to post structure
      const fetchedPosts = res.data.map(trip => ({
        id: trip.id,
        author: {
          name: trip.creator_name || 'Anonymous Explorer',
          handle: '@' + (trip.creator_name || 'explorer').toLowerCase().replace(' ', '_'),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        timeAgo: new Date(trip.created_at).toLocaleDateString(),
        content: trip.description || 'Check out my amazing trip itinerary!',
        tripDetails: {
          id: trip.id,
          title: trip.name,
          destinations: trip.starting_location,
          duration: `${trip.duration_days || 1} Days`,
          image: trip.cover_image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        likes: Number(trip.likes_count) || 0,
        comments: 0,
        liked: false, // We'd ideally check this from backend if user liked it
        saved: false
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      toast.error('Failed to load community feed');
    } finally {
      setLoading(false);
    }
  };

  const trendingTags = ['#Japan2026', '#BudgetTravel', '#SoloTravel', '#EuroSummer', '#Hiking', '#DigitalNomad'];

  const toggleLike = async (id) => {
    try {
      const res = await communityAPI.likeTrip(id);
      const isLiked = res.data.liked;
      
      setPosts(posts.map(post => {
        if (post.id === id) {
          return { 
            ...post, 
            liked: isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      }));
    } catch (error) {
      toast.error('Could not like trip');
    }
  };

  const copyTrip = async (id) => {
    try {
      const res = await communityAPI.copyTrip(id);
      toast.success('Trip copied to your dashboard!');
      navigate(`/trips/${res.data.id}`);
    } catch (error) {
      toast.error('Failed to copy trip');
    }
  };

  const [newPostText, setNewPostText] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: 'You',
        handle: '@traveler',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      timeAgo: 'Just now',
      content: newPostText,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    toast.success('Story posted to community feed!');
  };

  if (loading) {
    return <div className="loading-spinner-container"><div className="spinner"></div></div>;
  }

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
          <form className="card create-post-card mb-6" onSubmit={handleCreatePost}>
            <div className="card-body">
              <div className="create-post-input-area">
                <div className="avatar">ME</div>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Share your travel experiences or ask for advice..." 
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  style={{ borderRadius: 'var(--radius-full)' }}
                />
              </div>
              <div className="create-post-actions mt-3">
                <button type="button" className="btn btn-ghost btn-sm text-primary-600" onClick={() => toast('Select a trip to attach...')}>
                  <FiMapPin /> Attach Trip
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Post
                </button>
              </div>
            </div>
          </form>

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
            {posts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-state-icon">🌍</span>
                <h3 className="empty-state-title">No public trips yet</h3>
                <p className="empty-state-text">Be the first to share your itinerary with the community!</p>
              </div>
            ) : (
              posts.map(post => (
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
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-secondary btn-sm mt-2" onClick={() => navigate(`/trips/${post.tripDetails.id}`)}>View Itinerary</button>
                            <button className="btn btn-primary btn-sm mt-2" onClick={() => copyTrip(post.tripDetails.id)}><FiCopy /> Copy Trip</button>
                          </div>
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
                  </div>
                </div>
              ))
            )}
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
