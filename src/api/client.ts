import axios from 'axios';

import { sdkConfig } from '../config';


export const getApiClient = () => {
  return axios.create({
    baseURL: sdkConfig.getBaseUrl(),
    headers: {
      'Content-Type': 'application/json',
      'apikey': `${sdkConfig.getApiKey()}`
    }
  })
};

/**
 * Generic method to make API calls
 * @param {string} endpoint - The API endpoint (relative to baseURL)
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - HTTP method
 * @param {object} [data] - Request body for POST/PUT requests
 * @returns {Promise<any>} - API response
 */
export const apiCall = async (endpoint: string, method = 'GET', data: any) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.request({
      url: endpoint,
      method,
      data
    });
    return response.data.result
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};
