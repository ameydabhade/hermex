'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  HeartIcon,
  ShareIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Product, useCart } from '../../../contexts/CartContext';

const ProductDetailPage = () => {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data: Product = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getDiscountedPrice = (price: number, discountPercentage: number) => {
    return price * (1 - discountPercentage / 100);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <StarSolid
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                      <Link href="/products" className="text-amber-600 hover:text-amber-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
                        <Link href="/products" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImage === index
                            ? 'border-amber-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 lg:p-8">
              <div className="space-y-6">
                {/* Product Title and Brand */}
                <div>
                  {product.brand && (
                    <p className="text-lg text-amber-600 font-medium mb-2">{product.brand}</p>
                  )}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="ml-2 text-lg font-medium text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.reviews.length} reviews)</span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(discountedPrice)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {product.discountPercentage.toFixed(0)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-gray-50 rounded-l-lg"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2 hover:bg-gray-50 rounded-r-lg"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-amber-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  <div className="flex space-x-4">
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <HeartIcon className="w-5 h-5" />
                      <span>Add to Wishlist</span>
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <TruckIcon className="w-6 h-6 text-green-600" />
                    <span className="text-sm text-gray-600">{product.shippingInformation}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                    <span className="text-sm text-gray-600">{product.warrantyInformation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200">
            <div className="px-6 lg:px-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {['description', 'reviews', 'specifications'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        selectedTab === tab
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="py-8">
                {selectedTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="font-medium text-gray-900">{review.reviewerName}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'specifications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">SKU:</dt>
                            <dd className="font-medium">{product.sku}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Weight:</dt>
                            <dd className="font-medium">{product.weight} kg</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Category:</dt>
                            <dd className="font-medium capitalize">{product.category}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Return Policy:</dt>
                            <dd className="font-medium">{product.returnPolicy}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Dimensions</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Width:</dt>
                            <dd className="font-medium">{product.dimensions.width} cm</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Height:</dt>
                            <dd className="font-medium">{product.dimensions.height} cm</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Depth:</dt>
                            <dd className="font-medium">{product.dimensions.depth} cm</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 