export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 block">
              NexusCommerce
            </span>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium tech accessories for the modern digital nomad. Quality, style, and performance in every detail.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">All Products</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Gift Cards</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 NexusCommerce. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
