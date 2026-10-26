import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

interface Review {
  id: number;
  initials: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  helpful: number;
}

const reviews: Review[] = [
  {
    id: 1,
    initials: "KP",
    name: "Kiran P.",
    date: "15 Oct 2026",
    rating: 5,
    comment:
      "Good value for the price. Packaging was neat and delivery was on time.",
    helpful: 17,
  },
  {
    id: 2,
    initials: "ST",
    name: "Sneha T.",
    date: "22 Mar 2026",
    rating: 4,
    comment:
      "Good value for the price. Packaging was neat and delivery was on time.",
    helpful: 11,
  },
  {
    id: 3,
    initials: "AS",
    name: "Ananya S.",
    date: "8 Mar 2026",
    rating: 5,
    comment:
      "Absolutely love this product! Fresh and great quality. Will definitely order again.",
    helpful: 6,
  },
  {
    id: 4,
    initials: "ST",
    name: "Sneha T.",
    date: "23 Feb 2026",
    rating: 5,
    comment:
      "Exceeded my expectations. The taste and freshness were top-notch. Five stars!",
    helpful: 15,
  },
];

const DummyReviewSection = () => {
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>(
    Object.fromEntries(reviews.map((review) => [review.id, review.helpful])),
  );

  const handleHelpful = (reviewId: number) => {
    setHelpfulCounts((previous) => ({
      ...previous,
      [reviewId]: previous[reviewId] + 1,
    }));
  };

  return (
    <section className="w-full bg-[#fcfaf8] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Customer Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="flex items-start gap-3 sm:gap-4"
            >
              {/* Customer Avatar */}
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8eae5] text-xs font-semibold text-[#234734]">
                {review.initials}
              </div>

              {/* Review Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="text-sm font-semibold text-[#252525]">
                    {review.name}
                  </h3>

                  <span className="text-xs text-[#777777]">{review.date}</span>
                </div>

                {/* Star Rating */}
                <div
                  className="mb-2 flex items-center gap-0.5"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={14}
                      strokeWidth={1.5}
                      className={
                        index < review.rating
                          ? "fill-[#f5a623] text-[#f5a623]"
                          : "text-[#d6d6d6]"
                      }
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[13px] leading-6 text-[#414141]">
                  {review.comment}
                </p>

                {/* Helpful Button */}
                <button
                  type="button"
                  onClick={() => handleHelpful(review.id)}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#666666] transition-colors hover:text-[#267447]"
                >
                  <ThumbsUp size={12} strokeWidth={1.7} />

                  <span>Helpful ({helpfulCounts[review.id]})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DummyReviewSection;
