import React, { useState, useEffect } from 'react';
import dataService from '../data/dataService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function RatingsPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [allRatings, setAllRatings] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const { ratings, stats: ratingStats } = await dataService.getRatings();
      setAllRatings(ratings || []);
      setStats(ratingStats || { average: 4.5, total: 0 });
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a rating');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await dataService.createRating({
        rating,
        comment,
        userName: user.name || user.displayName || 'Anonymous',
        userEmail: user.email || 'unknown@local',
        userId: user._id || user.uid || null,
      });
      toast.success('Thank you for your rating!');
      setRating(0);
      setComment('');
      fetchRatings();
    } catch (err) {
      toast.error('Failed to submit rating');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await dataService.deleteRating(ratingId);
      toast.success('Rating deleted successfully');
      fetchRatings();
    } catch (err) {
      toast.error(err.message || 'Failed to delete rating');
      console.error(err);
    }
  };

  const renderStars = (ratingValue, interactive = false, onHover = null, onClick = null) => {
    const displayRating = interactive && hoverRating > 0 ? hoverRating : ratingValue;
    
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onMouseEnter={interactive ? () => onHover && onHover(star) : undefined}
            onMouseLeave={interactive ? () => onHover && onHover(0) : undefined}
            onClick={interactive ? () => onClick && onClick(star) : undefined}
            disabled={!interactive}
            className={`text-4xl transition-all duration-150 ${
              star <= displayRating
                ? 'text-yellow-400 drop-shadow-lg'
                : 'text-gray-300'
            } ${interactive ? 'hover:scale-125 cursor-pointer transform' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (ratingValue) => {
    switch(ratingValue) {
      case 5: return '⭐ Excellent!';
      case 4: return '😊 Very Good!';
      case 3: return '🙂 Good';
      case 2: return '😐 Fair';
      case 1: return '😞 Needs Improvement';
      default: return 'Click to rate';
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map(r => ({
    rating: r,
    count: allRatings.filter(rating => rating.rating === r).length
  }));

  const filteredRatings = filterRating === 0 ? allRatings : allRatings.filter(r => r.rating === filterRating);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-20 shadow-xl">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-orange-200 text-lg font-semibold mb-2 uppercase tracking-wider">Customer Feedback</p>
            <h1 className="text-5xl md:text-6xl font-black mb-4">Share Your Experience</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Your honest reviews help us improve and serve you better. Share your feedback and inspire other customers!
            </p>
          </div>

          {/* Overall Rating Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center md:border-r border-white/20">
                <p className="text-orange-200 text-sm font-semibold mb-2 uppercase">Overall Rating</p>
                <div className="text-6xl font-black mb-2">{stats.average.toFixed(1)}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {renderStars(Math.round(stats.average))}
                </div>
              </div>
              
              <div className="text-center md:border-r border-white/20">
                <p className="text-orange-200 text-sm font-semibold mb-2 uppercase">Total Reviews</p>
                <div className="text-5xl font-black">{stats.total}</div>
                <p className="text-sm mt-2 opacity-90">{stats.total === 1 ? 'review' : 'reviews'} submitted</p>
              </div>

              <div className="text-center md:border-r border-white/20">
                <p className="text-orange-200 text-sm font-semibold mb-2 uppercase">5 Star Ratings</p>
                <div className="text-5xl font-black">{ratingDistribution[0].count}</div>
                <p className="text-sm mt-2 opacity-90">Excellent experiences</p>
              </div>

              <div className="text-center">
                <p className="text-orange-200 text-sm font-semibold mb-2 uppercase">Response Rate</p>
                <div className="text-5xl font-black">100%</div>
                <p className="text-sm mt-2 opacity-90">We value your feedback</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Submit Rating Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-20 border-l-4 border-orange-500">
              <h2 className="text-3xl font-black text-gray-900 mb-6">Submit Your Rating</h2>
              
              {user ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Rate Your Experience *</label>
                    <div className="mb-4">
                      {renderStars(rating, true, setHoverRating, setRating)}
                    </div>
                    <p className="text-lg font-bold text-orange-600 h-8">
                      {getRatingText(hoverRating || rating)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Your Review</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="5"
                      maxLength="500"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 font-medium transition resize-none"
                      placeholder="Share your honest feedback... (optional)"
                    />
                    <p className="text-xs text-gray-500 mt-2">{comment.length}/500 characters</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? '⏳ Submitting...' : '✓ Submit Rating'}
                  </button>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-700">
                      <span className="font-bold">💡 Tip:</span> Detailed reviews help other customers and us improve!
                    </p>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🔐</div>
                  <p className="text-gray-600 mb-6 text-lg font-medium">Login to submit a rating</p>
                  <a 
                    href="/login" 
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Login Now
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Reviews & Statistics */}
          <div className="lg:col-span-2">
            {/* Rating Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-black text-gray-900 mb-8">Rating Distribution</h3>
              <div className="space-y-6">
                {ratingDistribution.map(({ rating: r, count }) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={r} className="flex items-center gap-4">
                      <button
                        onClick={() => setFilterRating(filterRating === r ? 0 : r)}
                        className={`min-w-32 text-left px-4 py-2 rounded-lg font-bold transition-all ${
                          filterRating === r
                            ? 'bg-orange-100 text-orange-600 border-2 border-orange-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                        }`}
                      >
                        {r} ★ ({count})
                      </button>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-gray-600 font-bold min-w-12 text-right">{percentage.toFixed(0)}%</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-gray-900">
                  Recent Reviews {filterRating > 0 && `(${filterRating} ★)`}
                </h3>
                {filterRating > 0 && (
                  <button
                    onClick={() => setFilterRating(0)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold transition-all"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              <div className="space-y-6 max-h-[700px] overflow-y-auto">
                {filteredRatings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4 opacity-50">📭</div>
                    <p className="text-xl text-gray-600 font-semibold">
                      {filterRating > 0 ? 'No reviews with this rating' : 'No reviews yet'}
                    </p>
                    <p className="text-gray-500 mt-2">Be the first to rate us!</p>
                  </div>
                ) : (
                  filteredRatings.map((r) => (
                    <div 
                      key={r._id} 
                      className="border-b border-gray-200 pb-6 last:border-0 hover:bg-gray-50 -mx-8 px-8 py-6 rounded transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {r.userName[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{r.userName}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(r.createdAt).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {renderStars(r.rating)}
                            </div>
                          </div>
                        </div>
                        
                        {user && user.email === r.userEmail && (
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-all transform hover:scale-105"
                            title="Delete your rating"
                          >
                            ✕ Delete
                          </button>
                        )}
                      </div>

                      {r.comment && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-400">
                          <p className="text-gray-800 leading-relaxed">{r.comment}</p>
                        </div>
                      )}

                      {/* Verified Badge */}
                      <div className="mt-3">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                          ✓ Verified Review
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 mt-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-4">Help Us Serve You Better</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Your feedback drives our continuous improvement. Share your thoughts and help us create an even better experience.
          </p>
          <button
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-orange-600 px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105 shadow-lg"
          >
            ↑ Leave a Review
          </button>
        </div>
      </div>
    </div>
  );
}
