import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import StarRating from './StarRating';

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

const ReviewList = ({ productId }: Props) => {
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

  console.log(JSON.stringify(summaryData, null, 2));

  if (isLoadingSummary || isLoadingReviews)
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton width={150} />
            <Skeleton width={100} />
            <Skeleton count={2} />
          </div>
        ))}
      </div>
    );

  if (isErrorSummary || isErrorReviews)
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;

  if (!reviewData.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {summaryData?.content ? (
        <div className=" text-gray-700">{summaryData.content}</div>
      ) : (
        <Button className="w-fit">
          <HiSparkles /> Summarize
        </Button>
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
