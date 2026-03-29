import { Star, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm">
            {product.category}
          </span>
          {product.discountPrice && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm text-center">
              Sale
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center text-amber-400">
            <Star size={14} fill="currentColor" />
            <span className="ml-1 text-xs font-bold text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {product.discountPrice ? (
              <>
                <span className="text-xl font-black text-emerald-600">
                  ${(product.discountPrice || 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ${(product.price || 0).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-gray-900">
                ${(product.price || 0).toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors duration-300"
          >
            <ShoppingBag size={18} />
            <span className="text-sm font-bold">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
