import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';
import ReviewSkeleton from './ReviewSkeleton';
import {
  reviewsApi,
  type Review,
  type SummarizeResponse,
} from '@/api/review.api';
import { summaryApi, type Summary } from '@/api/summary.api';

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  const reviewsQuery = useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  const summaryQuery = useQuery<Summary>({
    queryKey: ['summary', productId],
    queryFn: () => summaryApi.fetchSummary(productId),
  });

  if (summaryQuery.isLoading || reviewsQuery.isLoading)
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );

  if (summaryQuery.isError || reviewsQuery.isError)
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;

  if (!reviewsQuery.data?.length) return null;

  const currentSummary =
    summaryQuery.data?.content ?? summaryMutation.data?.summary;

  return (
    <div className="flex flex-col gap-4">
      {currentSummary ? (
        <div className=" text-gray-700">{currentSummary}</div>
      ) : (
        <>
          {!summaryMutation.isPending ? (
            <Button
              onClick={() => summaryMutation.mutate()}
              className="w-fit cursor-pointer"
              disabled={summaryMutation.isPending}
            >
              <HiSparkles /> Summarize
            </Button>
          ) : (
            <ReviewSkeleton />
          )}
          {summaryMutation.isError && (
            <p className="text-red-500">
              Could not summarize reviews. Try again!
            </p>
          )}
        </>
      )}
      <div>
        <div className="flex flex-col gap-4">
          {reviewsQuery.data?.map((review) => (
            <div key={review.id}>
              <div className="font-semibold">{review.author}</div>
              <StarRating value={review.rating} />
              <p className="py-2">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
