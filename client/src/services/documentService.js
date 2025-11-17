/**
 * API service for documents
 */

import axios from 'axios';

const API_URL = '/api/documents';

export const getDocuments = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getDocumentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const downloadDocument = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/download`, {
    responseType: 'blob'
  });
  return response;
};

export const deleteDocument = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
