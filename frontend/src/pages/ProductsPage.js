import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import ProductCard from '../components/ProductCard';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { filterProducts, sortProducts } from '../lib/utils';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    const filters = {
      category: selectedCategory,
      priceRange: priceRange[1] < 200 ? priceRange : null,
      minRating: minRating > 0 ? minRating : null,
      searchQuery: debouncedSearch
    };

    const filtered = filterProducts(products, filters);
    return sortProducts(filtered, sortBy);
  }, [debouncedSearch, selectedCategory, sortBy, priceRange, minRating]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy !== 'popular') params.set('sort', sortBy);
    setSearchParams(params);
  }, [debouncedSearch, selectedCategory, sortBy, setSearchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, priceRange, minRating]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
    setPriceRange([0, 200]);
    setMinRating(0);
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    priceRange[1] < 200,
    minRating > 0,
    debouncedSearch
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-gray-900/30">
      {/* Page Header */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Digital Products
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Discover {filteredAndSortedProducts.length} amazing digital products from talented creators
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-24 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Category</h4>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className="w-full justify-start"
                    >
                      All Categories
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.slug)}
                        className="w-full justify-start"
                      >
                        {category.name}
                        <Badge variant="secondary" className="ml-auto">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Price Range
                  </h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={5}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}+</span>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Minimum Rating
                  </h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <Button
                        key={rating}
                        variant={minRating === rating ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                        className="w-full justify-start"
                      >
                        {rating}+ Stars
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

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

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredAndSortedProducts.length} results
                </span>
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

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categories.find(c => c.slug === selectedCategory)?.name}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSelectedCategory('all')}
                    />
                  </Badge>
                )}
                {priceRange[1] < 200 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setPriceRange([0, 200])}
                    />
                  </Badge>
                )}
                {minRating > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {minRating}+ Stars
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setMinRating(0)}
                    />
                  </Badge>
                )}
                {debouncedSearch && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{debouncedSearch}"
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            <AnimatePresence mode="wait">
              {paginatedProducts.length > 0 ? (
                <motion.div
                  key="products-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="h-full w-80 bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile filter content - same as desktop */}
                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Category</h4>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                        className="w-full justify-start"
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.slug ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedCategory(category.slug)}
                          className="w-full justify-start"
                        >
                          {category.name}
                          <Badge variant="secondary" className="ml-auto">
                            {category.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Price Range
                    </h4>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={5}
                        className="mb-4"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Minimum Rating
                    </h4>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <Button
                          key={rating}
                          variant={minRating === rating ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                          className="w-full justify-start"
                        >
                          {rating}+ Stars
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button onClick={clearFilters} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                  <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;