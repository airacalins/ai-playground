import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
  productId: number;
};

type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  productId: number;
};

type Summary = {
  content: string;
};

type SummarizeResponse = {
  summary: string;
};

const ReviewList = ({ productId }: Props) => {
  const summarizeReviews = async () => {
    const { data } = await axios.post<SummarizeResponse>(
      `/api/products/${productId}/reviews/summarize`
    );
    return data;
  };

  const fetchReviews = async () => {
    const { data } = await axios.get<Review[]>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

  const fetchSummary = async () => {
    const { data } = await axios.get<Summary>(
      `/api/products/${productId}/summary`
    );
    return data;
  };

  const {
    mutate: handleSummarize,
    isPending: isSummaryLoading,
    isError: isSummaryError,
    data: summarizeResponse,
  } = useMutation<SummarizeResponse>({
    mutationFn: () => summarizeReviews(),
  });

  const {
    isLoading: isLoadingReviews,
    data: reviewData,
    isError: isErrorReviews,
  } = useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: fetchReviews,
  });

  const {
    isLoading: isLoadingSummary,
    data: summaryData,
    isError: isErrorSummary,
  } = useQuery<Summary>({
    queryKey: ['summary', productId],
    queryFn: fetchSummary,
  });

  if (isLoadingSummary || isLoadingReviews)
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );

  if (isErrorSummary || isErrorReviews)
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;

  if (!reviewData.length) return null;

  const currentSummary = summaryData?.content ?? summarizeResponse?.summary;

  return (
    <div className="flex flex-col gap-4">
      {currentSummary ? (
        <div className=" text-gray-700">{currentSummary}</div>
      ) : (
        <>
          {!isSummaryLoading ? (
            <Button
              onClick={() => handleSummarize()}
              className="w-fit cursor-pointer"
            >
              <HiSparkles /> Summarize
            </Button>
          ) : (
            <ReviewSkeleton />
          )}
          {isSummaryError && (
            <p className="text-red-500">
              Could not summarize reviews. Try again!
            </p>
          )}
        </>
      )}
      <div>
        <div className="flex flex-col gap-4">
          {reviewData?.map((review) => (
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
