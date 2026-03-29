import { motion } from 'motion/react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Zap, Tag, Timer, ArrowRight } from 'lucide-react';

interface DealsViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function DealsView({ products, onProductClick, onAddToCart }: DealsViewProps) {
  const dealProducts = products.filter(p => p.discountPrice && p.price && p.discountPrice < p.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Deals Hero */}
      <section className="relative overflow-hidden bg-emerald-600 rounded-[40px] p-12 md:p-24 text-white mb-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-3xl rounded-full translate-x-1/2" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold mb-8">
            <Zap size={16} className="text-yellow-400" />
            <span>Flash Sale - Limited Time Only</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            Unbeatable <span className="text-emerald-200 italic">Deals</span> on Premium Tech.
          </h1>
          <p className="text-xl text-emerald-100 mb-10 max-w-lg">
            Save up to 40% on our most popular items. Don't miss out on these exclusive offers.
          </p>
          
          <div className="flex flex-wrap gap-8 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Timer size={24} />
              </div>
              <div>
                <p className="text-xs text-emerald-200 uppercase font-bold tracking-widest">Ends In</p>
                <p className="text-xl font-black">12:45:22</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Tag size={24} />
              </div>
              <div>
                <p className="text-xs text-emerald-200 uppercase font-bold tracking-widest">Discount</p>
                <p className="text-xl font-black">Up to 40% OFF</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block">
          <img 
            src="https://picsum.photos/seed/deals/800/800" 
            alt="Deals" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 to-transparent" />
        </div>
      </section>

      {/* Deals Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Tag className="text-emerald-600" />
            Active Offers
          </h2>
          <p className="text-gray-500 font-bold">{dealProducts.length} Items on sale</p>
        </div>

        {dealProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {dealProducts.map((product) => (
              <div key={product.id} onClick={() => onProductClick(product)} className="cursor-pointer">
                <ProductCard 
                  product={product} 
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-2">No active deals right now</h3>
            <p className="text-gray-500">Check back later for new offers and discounts.</p>
          </div>
        )}
      </div>

      {/* Newsletter / Join Club */}
      <section className="bg-gray-50 rounded-[40px] p-12 md:p-20 text-center border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Never Miss a Deal Again</h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-lg">
          Join our exclusive Nexus Club to get early access to flash sales, member-only discounts, and special event offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center space-x-2">
            <span>Join Nexus Club</span>
            <ArrowRight size={20} />
          </button>
          <button className="px-10 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold hover:border-emerald-600 hover:text-emerald-600 transition-all">
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
