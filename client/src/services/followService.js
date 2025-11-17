/**
 * API service for following users
 */

import axios from 'axios';

const API_URL = '/api/follows';

export const followUser = async (userId) => {
  const response = await axios.post(API_URL, { userId });
  return response.data;
};

export const unfollowUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/${userId}`);
  return response.data;
};

export const getFollowers = async () => {
  const response = await axios.get(`${API_URL}/followers`);
  return response.data;
};

export const getFollowing = async () => {
  const response = await axios.get(`${API_URL}/following`);
  return response.data;
};

export const getFollowingFeed = async () => {
  const response = await axios.get(`${API_URL}/feed`);
  return response.data;
};
