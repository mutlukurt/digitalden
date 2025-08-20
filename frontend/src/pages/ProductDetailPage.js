import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Download, 
  Eye, 
  Check,
  ArrowLeft,
  Badge as BadgeIcon,
  Calendar,
  FileText,
  Palette,
  Users,
  ThumbsUp
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { products } from '../data/products';
import { creators } from '../data/creators';
import { reviews } from '../data/reviews';
import { formatPrice, formatDate, generateStars, getRelatedProducts } from '../lib/utils';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isInCart } = useCart();

  const product = products.find(p => p.slug === slug);
  
  if (!product) {
    return <Navigate to="/" replace />;
  }

  const creator = creators.find(c => c.id === product.creatorId);
  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = getRelatedProducts(product, products, 4);
  const stars = generateStars(product.rating);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 dark:hover:text-blue-400">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">{product.title}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div 
              className="aspect-video rounded-2xl overflow-hidden bg-white shadow-lg"
              layoutId="product-image"
            >
              <img
                src={product.images[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-blue-500 shadow-lg' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>

            {/* Preview Button */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(product.previewUrl, '_blank')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Live Preview
            </Button>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {product.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                {product.featured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <BadgeIcon className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {product.trending && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    🔥 Trending
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {product.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                {product.description}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {stars.map((star, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      star === 'full' 
                        ? 'text-yellow-400 fill-current' 
                        : star === 'half'
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {product.rating}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({product.reviewCount} reviews)
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                • {product.salesCount} sales
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Save {product.discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Creator */}
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator?.avatar} alt={creator?.name} />
                    <AvatarFallback>{creator?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {creator?.name}
                      </h3>
                      {creator?.verified && (
                        <Badge variant="secondary" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {creator?.rating}
                      </div>
                      <div>{creator?.productCount} products</div>
                      <div>{creator?.salesCount} sales</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/creators/${creator?.handle}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleAddToCart}
                disabled={isInCart(product.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-4 rounded-2xl ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleShare}
                className="px-6 py-4 rounded-2xl"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Download className="w-4 h-4 mr-2" />
                {product.fileSize}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4 mr-2" />
                {product.fileFormat.join(', ')}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                Updated {formatDate(product.updatedAt)}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                {product.salesCount} buyers
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="includes">What's Included</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-8">
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Product Details
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed mb-6">
                      {product.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="mt-8">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {productReviews.map((review) => (
                  <Card key={review.id} className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.userName}
                              </h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  ✓ Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.date)}
                            </span>
                          </div>
                          
                          <div className="flex items-center mb-3">
                            {generateStars(review.rating).map((star, index) => (
                              <Star
                                key={index}
                                className={`w-4 h-4 ${
                                  star === 'full' 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                            {review.title}
                          </h5>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {review.content}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="flex items-center hover:text-blue-600">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Helpful ({review.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-8">
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Specifications
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="includes" className="mt-8">
              <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    What's Included
                  </h3>
                  <div className="space-y-4">
                    {product.whatIncludes.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Related Products
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;