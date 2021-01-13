import axios from "axios";

const http = axios.create({
  baseURL: "https://api.stackexchange.com",
});

export default {
  async search({ q, page }) {
    const { data } = await http.get(`/2.2/search/advanced`, {
      params: {
        page,
        order: "desc",
        sort: "relevance",
        q,
        site: "stackoverflow",
      },
    });
    return data;
  },
  async getAnswers(questionId) {
    const { data } = await http.get(`/2.2/questions/${questionId}/answers`, {
      params: {
        order: "desc",
        filter: "!--1nZy5L4.V1",
        site: "stackoverflow",
      },
    });
    return data;
  },
};
