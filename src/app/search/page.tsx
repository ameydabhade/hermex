'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Product } from '../../contexts/CartContext';
import ProductCard from '../../components/ProductCard';

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const productsPerPage = 12;

  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query, currentPage, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${productsPerPage}&skip=${(currentPage - 1) * productsPerPage}`);
      const data: ApiResponse = await response.json();
      
      let sortedProducts = [...data.products];
      
      // Apply sorting
      if (sortBy === 'price-low') {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        sortedProducts.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        sortedProducts.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'title') {
        sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      setProducts(sortedProducts);
      setTotalProducts(data.total);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Rating (High to Low)' },
  ];

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Products</h1>
            <p className="text-gray-600">
              Enter a search term to find products
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Results
          </h1>
          <p className="text-lg text-gray-600">
            Results for "{query}"
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Side - Results Count */}
            <div>
              <span className="text-sm text-gray-800 font-medium">
                {loading ? 'Searching...' : `Found ${totalProducts} results`}
              </span>
            </div>

            {/* Right Side - Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-gray-900 font-medium"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or browse our categories
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Beauty', 'Groceries', 'Electronics', 'Home & Garden'].map((category) => (
                <span
                  key={category}
                  className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-amber-200 transition-colors duration-200"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNumber
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 