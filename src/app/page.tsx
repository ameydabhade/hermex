'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  ChevronRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GiftIcon
} from '@heroicons/react/24/solid';
import { Product } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; slug: string; image: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products (first 8 products)
        const response = await fetch('https://dummyjson.com/products?limit=8');
        const data: ApiResponse = await response.json();
        setFeaturedProducts(data.products);

        // Mock categories data (since API doesn't provide category images)
        setCategories([
          { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', count: 24 },
          { name: 'Groceries', slug: 'groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', count: 18 },
          { name: 'Home & Garden', slug: 'home-decoration', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', count: 12 },
          { name: 'Electronics', slug: 'smartphones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', count: 8 },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroFeatures = [
    { icon: TruckIcon, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: ShieldCheckIcon, title: 'Secure Payment', description: '100% protected' },
    { icon: CreditCardIcon, title: 'Easy Returns', description: '30-day return policy' },
    { icon: GiftIcon, title: 'Gift Cards', description: 'Available now' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-gray-800"
            >
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Discover
                <span className="block text-amber-600">Amazing Products</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-gray-700">
                Experience the best in beauty, groceries, and more with premium quality and unbeatable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/category/beauty"
                  className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 text-center"
                >
                  Shop Beauty
                </Link>
                <Link
                  href="/category/groceries"
                  className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 hover:text-white transition-all duration-300 text-center"
                >
                  Shop Groceries
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1683141052679-942eb9e77760?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Premium Shopping Experience"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Floating Product Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -right-4 top-8 bg-white rounded-xl p-4 shadow-lg max-w-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <StarIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">4.9/5 Rating</p>
                    <p className="text-sm text-gray-500">Trusted by 10k+ customers</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="absolute -left-4 bottom-8 bg-white rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TruckIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Features Bar */}
        <div className="relative bg-amber-100/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {heroFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-center space-x-3 text-gray-700"
                >
                  <feature.icon className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600">Discover our wide range of premium products</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="aspect-square">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count} products</p>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ChevronRightIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Handpicked items just for you</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/products"
              className="inline-flex items-center bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Products
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Stay in the Loop</h2>
            <p className="text-xl text-gray-700 mb-8">
              Get exclusive deals, new product alerts, and style inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border border-amber-200 focus:ring-4 focus:ring-amber-200 outline-none text-gray-900 bg-white"
              />
              <button className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
