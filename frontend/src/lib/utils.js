import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const formatFileSize = (sizeString) => {
  return sizeString;
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  while (stars.length < 5) {
    stars.push('empty');
  }
  
  return stars;
};

export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category);
  }

  // Filter by price range
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(product => product.price >= min && product.price <= max);
  }

  // Filter by rating
  if (filters.minRating) {
    filtered = filtered.filter(product => product.rating >= filters.minRating);
  }

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => b.salesCount - a.salesCount);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

export const getRelatedProducts = (currentProduct, allProducts, limit = 4) => {
  return allProducts
    .filter(product => 
      product.id !== currentProduct.id && 
      (product.category === currentProduct.category ||
       product.tags.some(tag => currentProduct.tags.includes(tag)))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getTrendingProducts = (products, limit = 6) => {
  return products
    .filter(product => product.trending)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit);
};

export const getFeaturedProducts = (products, limit = 3) => {
  return products
    .filter(product => product.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};