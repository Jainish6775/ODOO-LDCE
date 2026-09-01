import { useState, useEffect, useCallback } from 'react';
import { FiHeart, FiMessageCircle, FiShare2, FiSend, FiMapPin, FiCopy, FiTrendingUp, FiAward, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { communityAPI } from '../../services/api';
import { Skeleton } from '../../components/common/Skeleton';
import './Community.css';

const defaultCommunityPosts = [
  {
    id: 101,
    author: {
      name: 'Elena Rostova',
      handle: '@elena_adventures',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      badge: 'PRO EXPLORER'
    },
    timeAgo: '2 hours ago',
    content: 'Just concluded an 8-day expedition across Kyoto and Tokyo! The bamboo forest sunrise trail in Arashiyama is a must-visit.',
    tripDetails: {
      id: 104,
      title: 'Kyoto Ancient Shrines & Tea Experience',
      destinations: 'Kyoto, Japan',
      duration: '6 Days',
      image: '/images/region_asia_1787378514027.jpg'
    },
    likes: 42,
    comments: 8,
    liked: false,
    saved: false
  },
  {
    id: 102,
    author: {
      name: 'Marcus Sterling',
      handle: '@marcus_wanders',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      badge: 'ALPINE EXPERT'
    },
    timeAgo: '1 day ago',
    content: 'Swiss Alps skiing and Glacier Express route completed! Best powder snow in Zermatt this season. Full route map linked below.',
    tripDetails: {
      id: 105,
      title: 'Swiss Alps Winter Skiing & Glacier Express',
      destinations: 'Zermatt, Switzerland',
      duration: '10 Days',
      image: '/images/region_europe_1787378498140.jpg'
    },
    likes: 89,
    comments: 14,
    liked: true,
    saved: true
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState('Trending');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostText, setNewPostText] = useState('');
  const navigate = useNavigate();

  const fetchCommunityTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await communityAPI.getPublicTrips();
      const rawTrips = Array.isArray(res.data) ? res.data : [];

      if (rawTrips.length === 0) {
        setPosts(defaultCommunityPosts);
      } else {
        const fetchedPosts = rawTrips.map(trip => ({
          id: trip.id,
          author: {
            name: trip.creator_name || 'Anonymous Explorer',
            handle: '@' + (trip.creator_name || 'explorer').toLowerCase().replace(/\s+/g, '_'),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            badge: 'VERIFIED EXPLORER'
          },
          timeAgo: new Date(trip.created_at || Date.now()).toLocaleDateString(),
          content: trip.description || 'Check out my expedition itinerary dossier on GlobeTrotter!',
          tripDetails: {
            id: trip.id,
            title: trip.name,
            destinations: trip.starting_location || 'Global Destination',
            duration: `${trip.duration_days || 1} Days`,
            image: trip.cover_image || '/images/trip_paris_1787378563287.jpg'
          },
          likes: Number(trip.likes_count) || 0,
          comments: 0,
          liked: false,
          saved: false
        }));

        setPosts([...fetchedPosts, ...defaultCommunityPosts]);
      }
    } catch {
      setPosts(defaultCommunityPosts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommunityTrips();
  }, [fetchCommunityTrips]);

  const handleLike = (id) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleForkItinerary = (tripDetails) => {
    navigate(`/trips/new?destination=${encodeURIComponent(tripDetails.destinations)}&image=${encodeURIComponent(tripDetails.image)}`);
    toast.success(`Cloning "${tripDetails.title}" into your studio!`);
  };

  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: 'You',
        handle: '@commander',
        avatar: '/images/user_profile.png',
        badge: 'COMMANDER'
      },
      timeAgo: 'Just now',
      content: newPostText,
      tripDetails: null,
      likes: 0,
      comments: 0,
      liked: false,
      saved: false
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    toast.success('Expedition intelligence published!');
  };

  return (
    <div className="intelligence-feed-page page-container">
      
      {/* Feed Header */}
      <div className="feed-header-bar">
        <div>
          <h1 className="feed-page-title">Global Travel Intelligence</h1>
          <p className="feed-page-subtitle">Exchange itineraries, route guides, and field reports with verified world explorers.</p>
        </div>

        <div className="tab-group">
          {['Trending', 'Latest', 'Verified Guides'].map((tab) => (
            <button
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="feed-grid mt-6">
        
        {/* Left Column: Post Feed */}
        <div className="feed-main-col">
          
          {/* Post Creator Box */}
          <div className="card post-creator-box">
            <form onSubmit={handlePublishPost}>
              <div className="post-creator-inner">
                <img src="/images/user_profile.png" alt="You" className="avatar avatar-sm" />
                <textarea
                  className="post-creator-textarea"
                  rows="2"
                  placeholder="Share destination field tips, hidden gems, or flight route updates..."
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                ></textarea>
              </div>
              <div className="post-creator-bottom mt-3">
                <span className="text-xs text-muted">Public Travel Exchange</span>
                <button type="submit" className="btn btn-primary btn-sm" disabled={!newPostText.trim()}>
                  <FiSend /> Broadcast
                </button>
              </div>
            </form>
          </div>

          {/* Posts Stack */}
          <div className="posts-stack mt-4">
            {loading ? (
              <div className="card p-5">
                <Skeleton variant="title" width="40%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="rect" height={80} className="mt-3" />
              </div>
            ) : posts.map(post => (
              <div key={post.id} className="card post-card mb-4">
                
                {/* Author Row */}
                <div className="post-author-row">
                  <img src={post.author.avatar} alt={post.author.name} className="avatar avatar-sm" />
                  <div className="post-author-info">
                    <div className="flex items-center gap-2">
                      <span className="author-name">{post.author.name}</span>
                      <span className="author-badge-tag">{post.author.badge || 'EXPLORER'}</span>
                    </div>
                    <span className="author-handle">{post.author.handle}</span>
                  </div>
                  <span className="post-time-ago">{post.timeAgo}</span>
                </div>

                {/* Content */}
                <p className="post-text-body mt-3">{post.content}</p>

                {/* Embedded Trip Card */}
                {post.tripDetails && (
                  <div className="embedded-itinerary-card mt-3" onClick={() => handleForkItinerary(post.tripDetails)}>
                    <img src={post.tripDetails.image} alt={post.tripDetails.title} className="embedded-thumb" />
                    <div className="embedded-details">
                      <span className="embedded-title">{post.tripDetails.title}</span>
                      <span className="embedded-meta">
                        <FiMapPin size={11} /> {post.tripDetails.destinations} • ⏱️ {post.tripDetails.duration}
                      </span>
                    </div>
                    <button className="btn btn-secondary btn-sm" title="Clone to Studio">
                      <FiCopy /> Clone
                    </button>
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="post-footer-actions mt-3">
                  <button 
                    className={`feed-action-btn ${post.liked ? 'active' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <FiHeart size={14} /> <span>{post.likes}</span>
                  </button>
                  <button className="feed-action-btn">
                    <FiMessageCircle size={14} /> <span>{post.comments}</span>
                  </button>
                  <button 
                    className="feed-action-btn ml-auto"
                    onClick={() => {
                      navigator.clipboard?.writeText?.(window.location.href);
                      toast.success('Post link copied!');
                    }}
                  >
                    <FiShare2 size={14} />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Trending Destinations & Creators */}
        <div className="feed-sidebar-col">
          
          <div className="card p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <FiTrendingUp className="text-primary-400" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Trending Coordinates</h3>
            </div>
            
            <div className="trending-stack">
              <div className="trending-row">
                <div>
                  <span className="trending-title block text-xs font-bold text-primary">Kyoto & Tokyo, Japan</span>
                  <span className="text-xs text-muted">1.2k Active Expeditions</span>
                </div>
                <span className="badge badge-emerald text-xs">+28%</span>
              </div>

              <div className="trending-row">
                <div>
                  <span className="trending-title block text-xs font-bold text-primary">Zermatt & Swiss Alps</span>
                  <span className="text-xs text-muted">840 Active Expeditions</span>
                </div>
                <span className="badge badge-blue text-xs">+15%</span>
              </div>

              <div className="trending-row">
                <div>
                  <span className="trending-title block text-xs font-bold text-primary">Santorini, Greece</span>
                  <span className="text-xs text-muted">620 Active Expeditions</span>
                </div>
                <span className="badge badge-amber text-xs">+9%</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiAward className="text-primary-400" />
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Top Field Guides</h3>
            </div>
            
            <div className="guides-stack">
              <div className="guide-row">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Elena" className="avatar avatar-sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary block">Elena Rostova</span>
                  <span className="text-xs text-muted block">48 Shared Itineraries</span>
                </div>
                <button className="btn btn-secondary btn-sm">Follow</button>
              </div>

              <div className="guide-row mt-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Marcus" className="avatar avatar-sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-primary block">Marcus Sterling</span>
                  <span className="text-xs text-muted block">32 Alpine Guides</span>
                </div>
                <button className="btn btn-secondary btn-sm">Follow</button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
