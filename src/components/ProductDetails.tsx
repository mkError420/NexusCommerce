import { Star, ShoppingBag, ArrowLeft, Shield, Truck, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

export default function ProductDetails({ product, onAddToCart, onBack }: ProductDetailsProps) {
  if (!product) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back to Shop</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-100 cursor-pointer hover:border-emerald-600 transition-colors">
                <img 
                  src={`https://picsum.photos/seed/${product.id}-${i}/400/400`} 
                  alt={`${product.name} view ${i}`} 
                  className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-emerald-600 text-sm font-bold mb-2">
              <span>{product.category}</span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center text-amber-400">
                <Star size={14} fill="currentColor" />
                <span className="ml-1 text-gray-600">{product.rating} ({product.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-emerald-600">${(product.price || 0).toLocaleString()}</p>
          </div>

          <div className="prose prose-emerald max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
            <p className="text-gray-500">
              Experience the pinnacle of design and functionality. This product is crafted with premium materials and cutting-edge technology to ensure durability and top-tier performance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Quantity</p>
                <div className="flex items-center space-x-4 bg-gray-100 rounded-xl p-2 w-fit">
                  <button className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm disabled:opacity-50">
                    -
                  </button>
                  <span className="font-bold px-4">1</span>
                  <button className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
                    +
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 mb-2">Availability</p>
                <p className="text-green-600 font-bold flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                  <span>{product.stock} in stock</span>
                </p>
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center space-x-3 active:scale-[0.98]"
            >
              <ShoppingBag size={24} />
              <span>Add to Shopping Bag</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                <Truck size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Free Shipping</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                <RefreshCw size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">30-Day Returns</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                <Shield size={20} />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Secure Payment</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
