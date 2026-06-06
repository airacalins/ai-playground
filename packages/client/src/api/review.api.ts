import axios from 'axios';

export type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
  productId: number;
};

export type SummarizeResponse = {
  summary: string;
};

export const reviewsApi = {
  async summarizeReviews(productId: number) {
    const res = await axios.post<SummarizeResponse>(
      `/api/products/${productId}/reviews/summarize`
    );
    return res.data;
  },
  async fetchReviews(productId: number) {
    const { data } = await axios.get<Review[]>(
      `/api/products/${productId}/reviews`
    );
    return data;
  },
};
