import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ShoppingBag, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (product) setActiveImage(product.displayImage);
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const handleAddToCart = () => {
    addToCart(product, 1);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/ecommerce/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">Product Not Found</h2>
        <Link to="/" className="text-orange-500 hover:underline">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {product.mandir_id ? (
          <Link to={`/mandir/${product.mandir_id._id}`} className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mb-6 transition-colors">
            &larr; Back to {product.mandir_id.name}
          </Link>
        ) : product.dham_id ? (
          <Link to={`/dham/${product.dham_id._id}`} className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mb-6 transition-colors">
            &larr; Back to {product.dham_id.name}
          </Link>
        ) : (
          <Link to="/" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold mb-6 transition-colors">
            &larr; Back
          </Link>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div 
                className="w-full h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-zoom-in relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src={activeImage || product.displayImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain bg-white dark:bg-slate-800 transition-transform duration-200"
                  style={zoomStyle}
                />
              </div>
              {product.gallery && product.gallery.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div 
                    className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border cursor-pointer ${activeImage === product.displayImage ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-200 dark:border-slate-700'}`}
                    onClick={() => setActiveImage(product.displayImage)}
                  >
                    <img src={product.displayImage} alt="Main" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                  </div>
                  {product.gallery.map((img, idx) => (
                    <div 
                      key={idx} 
                      className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border cursor-pointer ${activeImage === img ? 'border-orange-500 ring-2 ring-orange-500' : 'border-slate-200 dark:border-slate-700'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category?.name || 'Store'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">{product.name}</h1>
              
              <div className="flex items-end gap-4 mb-6">
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-500 flex items-baseline gap-2">
                  ₹{product.sellingPrice || product.price}
                  {product.unit && (
                    <span className="text-xl font-medium text-slate-500 dark:text-slate-400">/ {product.unit}</span>
                  )}
                </span>
                {product.sellingPrice && product.sellingPrice < product.price && (
                  <span className="text-xl text-slate-400 line-through mb-1">
                    ₹{product.price}
                  </span>
                )}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-8 flex items-center gap-2 font-medium">
                <CheckCircle size={20} />
                {product.stock > 0 ? `In Stock` : 'Out of Stock'}
              </div>

              <div className="space-y-4 mb-8">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={24} />
                  Add to Cart
                </button>
                {showToast && (
                  <div className="bg-green-100 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
                    <CheckCircle size={20} />
                    Item added to your cart successfully!
                  </div>
                )}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {product.description || 'No detailed description provided for this product.'}
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="text-blue-500" size={24} />
                  <span>100% Authentic Product from Temple</span>
                </div>
                {(product.mandir_id || product.dham_id) && (
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <MapPin className="text-orange-500" size={24} />
                    <span>
                      Sourced from: {product.mandir_id?.name || product.dham_id?.name}
                    </span>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setIsModalOpen(false)}>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-orange-500 p-2 z-50 bg-black/50 rounded-full"
          >
            <X size={32} />
          </button>
          <img 
            src={activeImage || product.displayImage} 
            alt="Full View" 
            className="max-w-full max-h-[90vh] object-contain cursor-zoom-out" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
