import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, CreditCard, Truck, ShieldCheck, Check } from 'lucide-react';
import React, { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (formData: any) => Promise<boolean>;
}

export default function CheckoutModal({ isOpen, onClose, total, onConfirm }: CheckoutModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '**** **** **** 4242',
    expiry: '12/26',
    cvv: '***'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onConfirm(formData);
    setIsSubmitting(false);
    if (success) {
      setStep('success');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[110] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-black text-gray-900">Checkout</h2>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {step === 'form' ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Shipping Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                        <Truck size={20} />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Shipping Details</h3>
                      </div>
                      <div className="space-y-3">
                        <input 
                          required 
                          type="text" 
                          placeholder="Full Name" 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" 
                        />
                        <input 
                          required 
                          type="email" 
                          placeholder="Email Address" 
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" 
                        />
                        <input 
                          required 
                          type="text" 
                          placeholder="Shipping Address" 
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" 
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            required 
                            type="text" 
                            placeholder="City" 
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" 
                          />
                          <input 
                            required 
                            type="text" 
                            placeholder="ZIP Code" 
                            value={formData.zip}
                            onChange={e => setFormData({...formData, zip: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-600 mb-2">
                        <CreditCard size={20} />
                        <h3 className="font-bold uppercase tracking-wider text-xs">Payment Method</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="relative">
                          <input required type="text" placeholder="Card Number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors pl-12" />
                          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" />
                          <input required type="text" placeholder="CVC" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors" />
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start space-x-3">
                          <ShieldCheck className="text-emerald-600 mt-0.5" size={18} />
                          <p className="text-xs text-emerald-700 leading-relaxed">
                            Your payment is secured with 256-bit SSL encryption. We never store your full card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-3xl font-black text-gray-900">${(total || 0).toLocaleString()}</p>
                    </div>
                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Complete Purchase</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={60} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-gray-900">Order Confirmed!</h3>
                    <p className="text-gray-500 text-lg">
                      Thank you for your purchase. We've sent a confirmation email to your inbox.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl max-w-sm mx-auto border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Order Number</p>
                    <p className="text-xl font-mono font-bold text-gray-900">#NX-82941-02</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Return to Shop
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
