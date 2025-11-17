/**
 * API service for bookmarks
 */

import axios from 'axios';

const API_URL = '/api/bookmarks';

export const getBookmarks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addBookmark = async (documentId) => {
  const response = await axios.post(API_URL, { documentId });
  return response.data;
};

export const removeBookmark = async (documentId) => {
  const response = await axios.delete(`${API_URL}/${documentId}`);
  return response.data;
};
