import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';

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

const ReviewList = ({ productId }: Props) => {
  const fetchReviews = async () => {
    const { data } = await axios.get<Review[]>(
      `/api/products/${productId}/reviews`
    );
    return data;
  };

  const {
    isLoading,
    data: reviewData,
    error,
  } = useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(),
  });

  if (isLoading)
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

  if (error) {
    return <p className="text-red-500">Could not fetch reviews. Try again!</p>;
  }

  return (
    <div>
      <p className="font-bold text-mist-700">Reviews</p>

      <div className="flex flex-col gap-4">
        {reviewData.map((review) => (
          <div key={review.id}>
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <p className="py-2">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
