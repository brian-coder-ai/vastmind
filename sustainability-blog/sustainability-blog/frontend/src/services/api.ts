import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
}

export interface Author {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  author: Author;
  category: Category;
  tags: Tag[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
  is_featured?: boolean;
  status?: 'draft' | 'published';
}

interface ListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: number;
  is_featured?: boolean;
}

const api = {
  posts: {
    list: (params: ListParams = {}) => 
      apiClient.get<ListResponse<Post>>('/posts/', { params }),
    get: (slug: string) => 
      apiClient.get<Post>(`/posts/${slug}/`),
  },
  categories: {
    list: () => 
      apiClient.get<ListResponse<Category>>('/categories/'),
  },
  tags: {
    list: () => 
      apiClient.get<ListResponse<Tag>>('/tags/'),
  },
};

export default api;