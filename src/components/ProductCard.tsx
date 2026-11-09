import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import type { CartItem } from '../redux/cartSlice';

export type Product = Omit<CartItem, 'quantity'> & {
  _id?: string;
  description?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  image?: string;
};

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rating = product.rating ?? 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image || 'https://via.placeholder.com/200'}
        alt={product.name}
        onClick={() => navigate(`/product/${product.id ?? product._id}`)}
        className="h-[200px] w-full object-contain p-4 bg-slate-50 cursor-pointer"
      />

      <div className="p-4 grow">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center mb-2">
          <div className="flex" aria-label={`Rated ${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-4 h-4 ${
                  rating >= n ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-500">({product.reviews || 0})</span>
        </div>
        <p className="text-xl font-bold text-indigo-600">${product.price.toFixed(2)}</p>
      </div>

      <div className="p-2">
        <button
          onClick={() => dispatch(addToCart({...product,id: product._id ?? product.id}))}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold uppercase tracking-wide py-3 rounded-lg transition-colors"        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;