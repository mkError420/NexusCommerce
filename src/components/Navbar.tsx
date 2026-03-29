import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, ChangeEvent } from 'react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onNavigate: (view: string) => void;
  onSearch: (query: string) => void;
  user: any;
}

export default function Navbar({ cartCount, onCartClick, onLoginClick, onLogoutClick, onNavigate, onSearch, user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NexusCommerce
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleNavClick('home')} className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Home</button>
            <button onClick={() => handleNavClick('shop')} className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Shop</button>
            <button onClick={() => handleNavClick('categories')} className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Categories</button>
            <button onClick={() => handleNavClick('deals')} className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">Deals</button>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                if (isMenuOpen) setIsMenuOpen(false);
              }}
              className={`p-2 transition-colors ${isSearchOpen ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-600'}`}
            >
              <Search size={20} />
            </button>
            <button 
              onClick={onCartClick}
              className="p-2 text-gray-400 hover:text-emerald-600 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.displayName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">My Orders</button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Settings</button>
                      <button 
                        onClick={() => {
                          onLogoutClick();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-emerald-600 transition-colors"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (isSearchOpen) setIsSearchOpen(false);
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <button onClick={() => handleNavClick('home')} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium">Home</button>
              <button onClick={() => handleNavClick('shop')} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium">Shop</button>
              <button onClick={() => handleNavClick('categories')} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium">Categories</button>
              <button onClick={() => handleNavClick('deals')} className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md font-medium">Deals</button>
              {!user && (
                <button 
                  onClick={onLoginClick}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: -20, scale: 0.95, x: '-50%' }}
              className="fixed top-20 left-1/2 w-[95%] max-w-2xl z-50 px-2"
            >
              <div className="bg-white/95 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-2 flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <Search className="text-emerald-600" size={22} />
                    <div className="w-px h-6 bg-gray-200" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, brands, or categories..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-16 pr-4 py-4 bg-transparent border-none focus:ring-0 text-xl font-medium placeholder:text-gray-400 text-gray-900"
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    onSearch('');
                  }}
                  className="p-4 bg-gray-50 hover:bg-gray-100 rounded-[1.5rem] text-gray-400 hover:text-gray-600 transition-all active:scale-95"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
