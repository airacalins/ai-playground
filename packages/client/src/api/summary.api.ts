import axios from 'axios';

export type Summary = {
  content: string;
};

export const summaryApi = {
  async fetchSummary(productId: number) {
    const { data } = await axios.get<Summary>(
      `/api/products/${productId}/summary`
    );
    return data;
  },
};
