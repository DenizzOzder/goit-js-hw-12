import axios from "axios";
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '50401137-cdbb52678a54314c233e4ec11';

export async function fetchImages(query, page=1,perPage=40) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page:perPage
  };

  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}


