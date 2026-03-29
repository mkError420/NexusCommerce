import { motion } from 'motion/react';
import { Product } from '../types';
import { ArrowRight, Laptop, Smartphone, Watch, Home, LayoutGrid } from 'lucide-react';

interface CategoriesViewProps {
  products: Product[];
  onCategorySelect: (category: string) => void;
}

export default function CategoriesView({ products, onCategorySelect }: CategoriesViewProps) {
  const categories = [
    { name: 'Electronics', icon: Smartphone, color: 'bg-blue-500', count: products.filter(p => p.category === 'Electronics').length },
    { name: 'Wearables', icon: Watch, color: 'bg-purple-500', count: products.filter(p => p.category === 'Wearables').length },
    { name: 'Home Office', icon: Home, color: 'bg-green-500', count: products.filter(p => p.category === 'Home Office').length },
    { name: 'Computing', icon: Laptop, color: 'bg-orange-500', count: products.filter(p => p.category === 'Computing').length },
    { name: 'All Products', icon: LayoutGrid, color: 'bg-emerald-600', count: products.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          Browse by <span className="text-emerald-600">Category</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Explore our diverse range of premium tech accessories, curated to fit your digital lifestyle perfectly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => onCategorySelect(cat.name === 'All Products' ? 'All' : cat.name)}
            className="group relative overflow-hidden bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all cursor-pointer"
          >
            <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
              <cat.icon size={32} />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-gray-900 mb-2">{cat.name}</h3>
              <p className="text-gray-500 mb-6">{cat.count} Products available</p>
              
              <div className="flex items-center text-emerald-600 font-bold group-hover:gap-2 transition-all">
                <span>Explore Collection</span>
                <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>

            {/* Decorative background element */}
            <div className={`absolute -bottom-12 -right-12 w-48 h-48 ${cat.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* Featured Category Banner */}
      <section className="mt-20 relative overflow-hidden bg-gray-900 rounded-[40px] p-12 md:p-20 text-white">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-4 py-1 bg-emerald-600 rounded-full text-sm font-bold mb-6">Featured Collection</span>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            The Future of <br /> <span className="text-emerald-400">Computing</span> is Here.
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Discover our latest mechanical keyboards, monitors, and ergonomic accessories designed for the modern professional.
          </p>
          <button 
            onClick={() => onCategorySelect('Computing')}
            className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-emerald-50 transition-colors flex items-center space-x-2"
          >
            <span>Shop Computing</span>
            <ArrowRight size={20} />
          </button>
        </div>
        
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img 
            src="https://picsum.photos/seed/computing/800/800" 
            alt="Computing" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900" />
        </div>
      </section>
    </div>
  );
}
