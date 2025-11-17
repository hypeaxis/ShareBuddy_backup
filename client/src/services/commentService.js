/**
 * API service for comments
 */

import axios from 'axios';

const API_URL = '/api/comments';

export const getDocumentComments = async (documentId) => {
  const response = await axios.get(`${API_URL}/document/${documentId}`);
  return response.data;
};

export const addComment = async (commentData) => {
  const response = await axios.post(API_URL, commentData);
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
