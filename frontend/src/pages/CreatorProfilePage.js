import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Globe, 
  Twitter, 
  Instagram, 
  ExternalLink,
  Award,
  TrendingUp,
  Users,
  Package,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import ProductCard from '../components/ProductCard';
import { creators } from '../data/creators';
import { products } from '../data/products';
import { formatDate, sortProducts } from '../lib/utils';

const CreatorProfilePage = () => {
  const { handle } = useParams();
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');

  const creator = creators.find(c => c.handle === handle);
  
  if (!creator) {
    return <Navigate to="/" replace />;
  }

  const creatorProducts = products.filter(p => p.creatorId === creator.id);
  const sortedProducts = sortProducts(creatorProducts, sortBy);

  const stats = [
    { label: 'Products', value: creator.productCount, icon: Package },
    { label: 'Sales', value: `${creator.salesCount.toLocaleString()}+`, icon: TrendingUp },
    { label: 'Rating', value: creator.rating, icon: Star },
    { label: 'Reviews', value: creator.reviewCount.toLocaleString(), icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8"
          >
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback className="text-3xl">{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {creator.verified && (
                <Badge className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full">
                  <Award className="w-4 h-4" />
                </Badge>
              )}
            </motion.div>

            {/* Creator Info */}
            <div className="flex-1 text-center lg:text-left text-white">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                <h1 className="text-4xl font-bold">{creator.name}</h1>
                {creator.verified && (
                  <Badge className="bg-white/20 text-white">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              
              <p className="text-xl text-white/90 mb-4 max-w-2xl">
                {creator.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/80 mb-6">
                {creator.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {creator.location}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Joined {formatDate(creator.joinedDate)}
                </div>

                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  {creator.rating} ({creator.reviewCount} reviews)
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                {creator.website && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    asChild
                  >
                    <a href={creator.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                
                {creator.twitter && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    asChild
                  >
                    <a href={`https://twitter.com/${creator.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                
                {creator.instagram && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    asChild
                  >
                    <a href={`https://instagram.com/${creator.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products ({creatorProducts.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({creator.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-8">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 dark:text-gray-400">
                  {sortedProducts.length} products
                </span>
                
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This creator hasn't published any products yet.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-8">
            <Card className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  About {creator.name}
                </h3>
                
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed mb-6">
                    {creator.bio}
                  </p>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {creator.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Quick Stats
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Member since</span>
                          <span>{formatDate(creator.joinedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total products</span>
                          <span>{creator.productCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total sales</span>
                          <span>{creator.salesCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Average rating</span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {creator.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Contact & Social
                      </h4>
                      <div className="space-y-3">
                        {creator.website && (
                          <a
                            href={creator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        
                        {creator.twitter && (
                          <a
                            href={`https://twitter.com/${creator.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Twitter className="w-4 h-4 mr-2" />
                            {creator.twitter}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                        
                        {creator.instagram && (
                          <a
                            href={`https://instagram.com/${creator.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            <Instagram className="w-4 h-4 mr-2" />
                            {creator.instagram}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Reviews Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creator reviews will be available in a future update.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorProfilePage;