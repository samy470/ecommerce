import type { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

function Home(): JSX.Element {
  const navigate = useNavigate();

  const features = [
    { Icon: ShoppingBag, title: 'Wide Selection', text: 'Thousands of products to choose from' },
    { Icon: Truck, title: 'Fast Delivery', text: 'Free shipping on orders over $50' },
    { Icon: ShieldCheck, title: 'Secure Payment', text: '100% secure transactions' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700 text-white py-20 md:py-24 mb-8 flex items-center justify-center relative">
        <div className="z-10 px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent leading-tight">Welcome to E-Shop</h1>
          <p className="text-white text-lg mb-8 max-w-lg mx-auto">Discover amazing products at great prices</p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/products')}
              className="bg-white text-indigo-700 py-3 px-8 rounded-lg font-semibold transition hover:bg-cyan-50 hover:-translate-y-1 hover:shadow-lg"            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ Icon, title, text }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <Icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">{title}</h3>
              <p className="text-gray-500">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;