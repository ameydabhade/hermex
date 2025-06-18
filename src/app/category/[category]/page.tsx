'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Product } from '../../../contexts/CartContext';
import ProductCard from '../../../components/ProductCard';

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const CategoryPage = () => {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  
  const productsPerPage = 12;
  const category = params.category as string;

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category, currentPage, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `https://dummyjson.com/products/category/${category}?limit=${productsPerPage}&skip=${(currentPage - 1) * productsPerPage}`;
      const response = await fetch(url);
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
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'title', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
    { value: 'rating', label: 'Rating (High to Low)' },
  ];

  const getCategoryName = (slug: string) => {
    const categoryMap: Record<string, string> = {
      'beauty': 'Beauty',
      'groceries': 'Groceries',
      'home-decoration': 'Home & Garden',
      'smartphones': 'Electronics',
    };
    return categoryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getCategoryName(category)}
          </h1>
          <p className="text-lg text-gray-600">
            Discover our {getCategoryName(category).toLowerCase()} collection
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Side - Results Count */}
            <div>
              <span className="text-sm text-gray-500">
                Showing {products.length} of {totalProducts} products
              </span>
            </div>

            {/* Right Side - Sort */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
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

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
            <p className="text-gray-600">
              Sorry, we couldn't find any products in this category.
            </p>
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
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CategoryPage; 