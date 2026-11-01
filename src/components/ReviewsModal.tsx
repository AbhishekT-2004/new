import React, { useState } from 'react';
import { Star, X, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { Review } from '../types';

interface ReviewsModalProps {
  productId: string;
  productTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (newReview: Review) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  productId,
  productTitle,
  isOpen,
  onClose,
  onReviewAdded
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      setError('Please provide your name and review comments.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const created = await api.submitReview({
        productId,
        userName: userName.trim(),
        rating,
        title: title.trim() || 'Verified Customer Review',
        comment: comment.trim()
      });
      onReviewAdded(created);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-lg text-stone-900 font-serif-luxury">Write a Product Review</h3>
            <p className="text-xs text-stone-500 line-clamp-1">{productTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-stone-600 ml-2">
                {rating === 5 ? 'Excellent 5/5' : rating === 4 ? 'Good 4/5' : rating === 3 ? 'Average 3/5' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Stunning craftsmanship, transforms the room"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-amber-600 outline-none"
            />
          </div>

          {/* Reviewer Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-amber-600 outline-none"
            />
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Detailed Feedback
            </label>
            <textarea
              rows={4}
              placeholder="Describe the texture, weight, how well it matches your decor, and your delivery experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-amber-600 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Review will appear with a Verified Buyer badge upon submission.</span>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-stone-900 hover:bg-amber-700 text-white rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
