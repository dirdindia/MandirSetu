import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  return (
    <div className="pt-20 pb-20 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
          <ShoppingCart size={32} /> Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-12 text-center border border-slate-100 dark:border-slate-800">
            <ShoppingCart size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">Your cart is empty</h2>
            <Link to="/services?type=shops" className="inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.product.displayImage} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">₹{item.product.sellingPrice || item.product.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold">-</button>
                        <span className="font-bold text-slate-700 dark:text-slate-300 w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-600 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-4">
                <button onClick={clearCart} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold underline">
                  Clear Cart
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm p-6 border border-slate-100 dark:border-slate-800 sticky top-24">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-lg font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 pt-4 mb-8">
                  <span>Total</span>
                  <span className="text-orange-600 dark:text-orange-500">₹{cartTotal}</span>
                </div>
                <Link to="/checkout" className="w-full inline-block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
