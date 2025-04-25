import axios from 'axios';

const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY || '';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

const imageCache: { [key: string]: string } = {};

export const getImage = async (imageId: string): Promise<string> => {
  // Check cache first
  if (imageCache[imageId]) {
    return imageCache[imageId];
  }

  try {
    const response = await axios.get<PixabayResponse>(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        id: imageId,
      },
    });

    if (response.data.hits.length > 0) {
      const imageUrl = response.data.hits[0].largeImageURL;
      imageCache[imageId] = imageUrl;
      return imageUrl;
    }

    throw new Error('Image not found');
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
};

// Map of our image identifiers to Pixabay image IDs
export const IMAGE_IDS = {
  hero: '4324711',
  ecoLiving: '931706',
  renewable: '1869902',
  sustainable: '1850181',
};