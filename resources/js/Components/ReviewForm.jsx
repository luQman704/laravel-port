import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { StarPicker } from '@/Components/StarRating';

export default function ReviewForm({ turn14Id, onSubmitted }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    const [rating,  setRating]  = useState(0);
    const [title,   setTitle]   = useState('');
    const [body,    setBody]    = useState('');
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState(false);

    // Not logged in — show login prompt instead of form
    if (!user) {
        return (
            <div className="p-6 bg-asphalt border border-asphalt-dark rounded-xl text-center space-y-3">
                <div className="text-2xl">★</div>
                <p className="font-semibold text-pitlane">Sign in to leave a review</p>
                <p className="text-sm text-alloy">Only registered customers can write reviews.</p>
                <a
                    href="/login"
                    className="inline-block mt-1 btn btn-primary px-6 py-2 text-sm"
                >
                    Sign In
                </a>
            </div>
        );
    }

    async function submit(e) {
        e.preventDefault();
        if (rating === 0) { setError('Please select a star rating.'); return; }
        if (body.trim().length < 10) { setError('Review must be at least 10 characters.'); return; }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({
                    turn14_product_id: turn14Id,
                    rating,
                    title: title.trim() || null,
                    body: body.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message ?? 'Failed to submit review.');
                return;
            }

            setSuccess(true);
            setRating(0); setTitle(''); setBody('');
            if (onSubmitted) onSubmitted(data.review);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="p-5 bg-sector-50 border border-sector-200 rounded-xl text-center">
                <div className="text-2xl mb-2">★</div>
                <p className="font-semibold text-sector-700">Thank you for your review!</p>
                <p className="text-sm text-sector-600 mt-1">Your review has been published.</p>
                <button onClick={() => setSuccess(false)}
                    className="mt-3 text-xs text-sector-600 underline">Write another</button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="bg-asphalt rounded-xl p-5 space-y-4">
            <h4 className="font-semibold text-pitlane">Write a Review</h4>
            <p className="text-xs text-alloy -mt-2">Posting as <span className="font-medium text-pitlane">{user.name}</span></p>

            {/* Star picker */}
            <div>
                <label className="block text-xs font-medium text-alloy mb-2">Your Rating *</label>
                <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Title */}
            <div>
                <label className="block text-xs font-medium text-alloy mb-1">Headline (optional)</label>
                <input
                    type="text" value={title} onChange={e => setTitle(e.target.value)}
                    maxLength={100} placeholder="Sum it up in one line…"
                    className="w-full text-sm rounded-lg border border-asphalt-dark bg-white px-3 py-2 text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500"
                />
            </div>

            {/* Body */}
            <div>
                <label className="block text-xs font-medium text-alloy mb-1">Your Review *</label>
                <textarea
                    value={body} onChange={e => setBody(e.target.value)}
                    required minLength={10} maxLength={2000} rows={4}
                    placeholder="What did you think of this product? Include fitment notes, install experience, performance…"
                    className="w-full text-sm rounded-lg border border-asphalt-dark bg-white px-3 py-2 text-pitlane focus:outline-none focus:ring-2 focus:ring-sector-500 resize-none"
                />
                <div className="text-right text-[10px] text-alloy mt-0.5">{body.length}/2000</div>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <button
                type="submit"
                disabled={loading || rating === 0}
                className="btn btn-primary w-full py-2.5 disabled:opacity-50"
            >
                {loading ? 'Submitting…' : 'Submit Review'}
            </button>
        </form>
    );
}
