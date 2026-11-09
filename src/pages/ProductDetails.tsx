
import type { JSX } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowLeft, Star, StarHalf } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';

interface Product {
  _id?: string;
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  category?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function RatingStars({ value }: { value: number }): JSX.Element {
  return (
    <div className="flex" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        if (value >= n) {
          return <Star key={n} className="w-5 h-5 fill-amber-400 text-amber-400" />;
        }
        if (value >= n - 0.5) {
          return (
            <span key={n} className="relative w-5 h-5">
              <Star className="absolute w-5 h-5 text-gray-300" />
              <StarHalf className="absolute w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
          );
        }
        return <Star key={n} className="w-5 h-5 text-gray-300" />;
      })}
    </div>
  );
}

function ProductDetails(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/getproducts/${id}`);
        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          setError(data.message);
          return;
        }

        setProduct({
          ...data,
          id: data._id || data.id,
        });
      } catch {
        if (active) setError('Unable to connect to the server');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">
          {error || 'Product not found'}
        </h2>
        <button
          onClick={() => navigate('/products')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Back to Products
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-3 py-2 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Product Image */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-center">
            <img
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full max-h-[450px] object-contain"
            />
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="text-sm font-medium text-indigo-600 uppercase mb-3">
                {product.category}
              </p>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center mb-5">
              <RatingStars value={product.rating ?? 0} />
              <span className="ml-2 text-sm text-slate-500">
                ({product.reviews ?? 0} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-indigo-600 mb-5">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <p className={`text-sm font-medium mb-6 ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.stock > 0
                ? `${product.stock} available in stock`
                : 'Out of Stock'}
            </p>

            <hr className="border-slate-200 mb-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => dispatch(addToCart({...product,id: product._id ?? product.id}))}
                disabled={product.stock === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Add to Cart
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
