import type { JSX } from 'react/jsx-runtime';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/cartSlice';
import CartItem from '../components/CartItem';
import { createOrder } from '../redux/cartSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { CartItem as CartItemType } from '../redux/cartSlice';

function Cart(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems) as CartItemType[];
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = (): void => {
    if (user) {
      dispatch(createOrder({
        address: user.address,
        paymentMethod: 'Cash on Delivery',
      }));
    } else {
      navigate('/login', { state: { from: '/cart' } });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center bg-slate-50">
        <h2 className="text-2xl mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium uppercase tracking-wide px-6 py-2 rounded shadow transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => dispatch(removeFromCart(item.id))}
                  onUpdateQuantity={(quantity: number) =>
                    dispatch(updateQuantity({ id: item.id, quantity }))
                  }
                />
              ))}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="border border-red-200 text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:sticky md:top-20">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Order Summary</h2>
              <div className="my-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between text-xl font-bold text-slate-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-sm transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;