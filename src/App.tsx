import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import ShopView from './components/ShopView';
import CategoriesView from './components/CategoriesView';
import DealsView from './components/DealsView';
import Cart from './components/Cart';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import { Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './constants';
import { ShoppingBag, ArrowRight, Zap, Shield, Truck, Star } from 'lucide-react';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logout, 
  onAuthStateChanged, 
  collection, 
  onSnapshot, 
  doc, 
  getDoc,
  setDoc, 
  addDoc, 
  serverTimestamp,
  getDocs,
  handleFirestoreError,
  OperationType
} from './firebase';

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          let userData = userDoc.exists() ? userDoc.data() : null;
          
          const isAdminEmail = currentUser.email === "mk.rabbani.cse@gmail.com";
          const defaultRole = isAdminEmail ? 'admin' : 'customer';

          if (!userData) {
            userData = {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: defaultRole
            };
            await setDoc(userRef, userData);
          } else if (isAdminEmail && userData.role !== 'admin') {
            // Force admin role for the specific email if it's not set
            userData.role = 'admin';
            await setDoc(userRef, { role: 'admin' }, { merge: true });
          }

          setUser({ uid: currentUser.uid, ...userData });
        } catch (error) {
          console.error('Error syncing user:', error);
          handleFirestoreError(error, OperationType.WRITE, 'users/' + currentUser.uid);
          // Fallback to basic auth user if Firestore fails
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch Products
  useEffect(() => {
    console.log('Setting up products listener...');
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      console.log(`Received products snapshot: ${snapshot.size} documents`);
      if (!snapshot.empty) {
        const fetchedProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        setProducts(fetchedProducts);
      } else {
        console.warn('No products found in Firestore, using mock data.');
        setProducts(MOCK_PRODUCTS);
      }
    }, (error) => {
      console.error('Error fetching products:', error);
      handleFirestoreError(error, OperationType.GET, 'products');
    });
    return () => unsubscribe();
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = async (formData: any) => {
    if (!user) {
      alert('Please sign in to complete your purchase.');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartTotal,
        status: 'pending',
        shippingInfo: formData,
        createdAt: serverTimestamp()
      });
      setCartItems([]);
      return true; // Success
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      return false;
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                          (p.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-bold animate-pulse">Initializing NexusCommerce...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'admin' && user?.role === 'admin') {
    return <AdminDashboard onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={signInWithGoogle}
        onLogoutClick={logout}
        onNavigate={handleNavigate}
        onSearch={(query) => {
          setSearchQuery(query);
          if (query && currentView !== 'shop') {
            setCurrentView('shop');
          }
        }}
        user={user}
      />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          if (!user) {
            alert('Please sign in to checkout');
            signInWithGoogle();
          } else {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }
        }}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotal}
        onConfirm={handleCheckout}
      />

      <main className="pt-16">
        <AnimatePresence mode="wait">
          {selectedProduct ? (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProductDetails 
                product={selectedProduct} 
                onAddToCart={addToCart} 
                onBack={() => setSelectedProduct(null)} 
              />
            </motion.div>
          ) : currentView === 'shop' ? (
            <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ShopView 
                products={products} 
                onProductClick={setSelectedProduct} 
                onAddToCart={addToCart} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </motion.div>
          ) : currentView === 'categories' ? (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CategoriesView 
                products={products} 
                onCategorySelect={(cat) => { 
                  setActiveCategory(cat); 
                  setCurrentView('shop'); 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            </motion.div>
          ) : currentView === 'deals' ? (
            <motion.div key="deals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DealsView 
                products={products} 
                onProductClick={setSelectedProduct} 
                onAddToCart={addToCart} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="relative overflow-hidden bg-white py-20 lg:py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#ecfdf5,transparent)]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-bold mb-6">
                        <Zap size={16} />
                        <span>New Season Arrivals</span>
                      </div>
                      <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
                        Elevate Your <span className="text-emerald-600">Digital</span> Lifestyle.
                      </h1>
                      <p className="text-xl text-gray-600 mb-10 max-w-lg">
                        Discover our curated collection of premium tech accessories designed to enhance your productivity and style.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => handleNavigate('shop')}
                          className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center space-x-2 group"
                        >
                          <span>Shop Collection</span>
                          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleNavigate('categories')}
                          className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:border-emerald-600 hover:text-emerald-600 transition-all"
                        >
                          Browse Categories
                        </button>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                        <img 
                          src="https://picsum.photos/seed/tech/1000/1000" 
                          alt="Hero" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Shield size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">Secure Payments</p>
                            <p className="text-xs text-gray-500">100% encrypted checkout</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping on orders over $100' },
                      { icon: Shield, title: 'Secure Shopping', desc: 'Your data is always protected' },
                      { icon: Zap, title: 'Instant Support', desc: '24/7 customer service access' }
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                          <feature.icon size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{feature.title}</h3>
                          <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Trending Categories */}
              <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Trending Categories</h2>
                    <p className="text-gray-500">Discover what's hot right now in the world of tech.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { name: 'Electronics', img: 'https://picsum.photos/seed/electronics/400/400', color: 'bg-blue-500' },
                      { name: 'Wearables', img: 'https://picsum.photos/seed/wearables/400/400', color: 'bg-purple-500' },
                      { name: 'Home Office', img: 'https://picsum.photos/seed/office/400/400', color: 'bg-green-500' },
                      { name: 'Computing', img: 'https://picsum.photos/seed/computing/400/400', color: 'bg-orange-500' }
                    ].map((cat, i) => (
                      <motion.div
                        key={cat.name}
                        whileHover={{ y: -8 }}
                        onClick={() => { setActiveCategory(cat.name); handleNavigate('shop'); }}
                        className="group cursor-pointer relative aspect-square rounded-[2rem] overflow-hidden shadow-lg"
                      >
                        <img 
                          src={cat.img} 
                          alt={cat.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-sm font-bold opacity-80 mb-1">Explore</p>
                          <h3 className="text-xl font-black">{cat.name}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Flash Sale Banner */}
              <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-3xl rounded-full translate-x-1/3" />
                    <div className="relative z-10 max-w-xl text-center md:text-left">
                      <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-bold mb-6">
                        <Zap size={16} className="text-yellow-400" />
                        <span>Limited Time Flash Sale</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        Get <span className="text-emerald-200 italic">40% OFF</span> on Nexus Pro.
                      </h2>
                      <p className="text-lg text-emerald-100 mb-8">
                        Our best-selling noise-cancelling headphones are now at their lowest price ever. Offer ends soon!
                      </p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-black">12</p>
                          <p className="text-xs uppercase font-bold text-emerald-200">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black">45</p>
                          <p className="text-xs uppercase font-bold text-emerald-200">Mins</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-black">22</p>
                          <p className="text-xs uppercase font-bold text-emerald-200">Secs</p>
                        </div>
                      </div>
                    </div>
                    <div className="relative z-10 w-full max-sm:max-w-sm">
                      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                        <img 
                          src="https://picsum.photos/seed/headphones/600/600" 
                          alt="Nexus Pro" 
                          className="w-full h-auto rounded-2xl mb-6 shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-sm font-bold text-emerald-200">Nexus Pro Headphones</p>
                            <p className="text-2xl font-black">$249.99 <span className="text-sm font-normal line-through opacity-50">$299.99</span></p>
                          </div>
                          <button 
                            onClick={() => {
                              const p = products.find(p => p.id === '1');
                              if (p) addToCart(p);
                            }}
                            className="bg-white text-emerald-600 p-4 rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg"
                          >
                            <ShoppingBag size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Product Grid */}
              <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-500 max-w-md">Explore our most popular items, hand-picked for quality and innovation.</p>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Electronics', 'Wearables', 'Home Office', 'Computing'].map((cat) => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                          cat === activeCategory ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                      <ProductCard 
                        product={product} 
                        onAddToCart={(p) => {
                          addToCart(p);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                      <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">What Our <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">Nexus Club</span> Members Say.</h2>
                      <p className="text-gray-500 text-lg">Join over 50,000 satisfied customers who have elevated their digital lifestyle with NexusCommerce.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                        <p className="text-3xl font-black">4.9/5</p>
                        <p className="text-xs font-bold uppercase tracking-wider">Average Rating</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                        <p className="text-3xl font-black">50k+</p>
                        <p className="text-xs font-bold uppercase tracking-wider">Happy Users</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: 'Alex Rivera', role: 'Tech Reviewer', text: 'The Nexus Pro headphones are a game changer. The ANC is incredible and the sound quality is unmatched at this price point.', img: 'https://i.pravatar.cc/150?u=alex' },
                      { name: 'Sarah Chen', role: 'Software Engineer', text: 'I love the Zenith keyboard. The tactile feel is perfect for long coding sessions, and the RGB customization is a nice touch.', img: 'https://i.pravatar.cc/150?u=sarah' },
                      { name: 'Marcus Thorne', role: 'Digital Nomad', text: 'NexusCommerce is my go-to for all my travel tech. Fast shipping and the customer support is actually helpful!', img: 'https://i.pravatar.cc/150?u=marcus' }
                    ].map((t, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 relative"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
                          <div>
                            <h4 className="font-bold text-gray-900">{t.name}</h4>
                            <p className="text-xs text-gray-500 font-medium">{t.role}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed italic">"{t.text}"</p>
                        <div className="mt-6 flex text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Brands Showcase */}
              <section className="py-12 bg-gray-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.3em] mb-10">Trusted by Industry Leaders</p>
                  <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    {['TECHCRUNCH', 'WIRED', 'THE VERGE', 'FORBES', 'ENGADGET'].map(brand => (
                      <span key={brand} className="text-2xl font-black text-gray-900 tracking-tighter">{brand}</span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Newsletter */}
              <section className="py-20 bg-gray-900 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/10 blur-3xl rounded-full translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Join the Nexus Club</h2>
                  <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">
                    Subscribe to our newsletter and get 10% off your first order, plus early access to new drops.
                  </p>
                  <form className="max-w-md mx-auto flex gap-4" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                      Subscribe
                    </button>
                  </form>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
