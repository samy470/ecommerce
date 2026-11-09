import type { JSX } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import OrderDetails from '../components/OrderDetails';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface OrderItem {
  quantity?: number;
}

interface Order {
  _id: string;
  createdAt?: string;
  date?: string;
  total?: number;
  totalAmount?: number;
  status?: string;
  items?: OrderItem[];
}

function getStatusStyle(status?: string): string {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-amber-100 text-amber-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function Orders(): JSX.Element {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchOrders = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${API_URL}/getuserorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!active) return;

        if (!res.ok) {
          setError(data.message);
          return;
        }

        setOrders(data);

      } catch {
        if (active) setError('Unable to connect to the server');
      } finally {
        if (active) setLoading(false);
      }
    };

    setLoading(true);
    setError('');
    fetchOrders();

    return () => {
      active = false;
    };
  }, []);

  const formatDate = (date?: string): string => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return 'N/A';

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
    }).format(parsedDate);
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading your orders...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            My Orders
          </h1>
          <p className="text-slate-500 mt-2">
            Track and manage your purchases.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {orders.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wide">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items?.reduce(
                    (total, item) => total + (Number(item.quantity) || 0),
                    0
                  ) ?? 0;

                  const total = Number(order.total ?? order.totalAmount ?? 0);
                  const status = order.status || 'Unknown';

                  return (
                    <tr
                      key={order._id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-800">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      <td className="p-4 text-slate-600">
                        {formatDate(order.createdAt || order.date)}
                      </td>

                      <td className="p-4 text-slate-600">
                        {itemCount}
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        ${total.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyle(status)}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedOrderId(order._id)}
                          className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          // Empty State
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm py-16 px-4 text-center">
            <ShoppingBag className="w-14 h-14 text-indigo-300 mx-auto mb-5" />

            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No orders yet
            </h2>

            <p className="text-slate-500 mb-6">
              You haven't placed any orders yet. Start shopping!
            </p>

            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
      {selectedOrderId && (
        <OrderDetails
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </main>
  );
}

export default Orders;
