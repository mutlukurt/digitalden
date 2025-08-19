import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useCart } from '../contexts/CartContext';
import { formatPrice, generateStars } from '../lib/utils';
import { creators } from '../data/creators';

const ProductCard = ({ product, featured = false }) => {
  const { addToCart, isInCart } = useCart();
  const creator = creators.find(c => c.id === product.creatorId);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const stars = generateStars(product.rating);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        featured ? 'lg:col-span-2 lg:row-span-2' : ''
      }`}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64 lg:h-80' : 'h-48'}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white">
              -{product.discount}%
            </Badge>
          )}

          {/* Featured Badge */}
          {product.featured && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Featured
            </Badge>
          )}

          {/* Trending Badge */}
          {product.trending && (
            <Badge className="absolute top-12 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              🔥 Trending
            </Badge>
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white text-gray-900"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(product.previewUrl, '_blank');
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddToCart}
              disabled={isInCart(product.id)}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {isInCart(product.id) ? 'Added' : 'Add'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs">
              {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Creator */}
          <div className="flex items-center mb-3">
            <img
              src={creator?.avatar}
              alt={creator?.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              by {creator?.name}
            </span>
            {creator?.verified && (
              <Badge variant="secondary" className="ml-2 text-xs">
                ✓
              </Badge>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-2">
              {stars.map((star, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    star === 'full' 
                      ? 'text-yellow-400 fill-current' 
                      : star === 'half'
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {product.salesCount} sales
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;