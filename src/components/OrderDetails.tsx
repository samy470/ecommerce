
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface OrderDetailsProps {
  orderId: string;
  onClose: () => void;
}

function OrderDetails({ orderId, onClose }: OrderDetailsProps) {
  const [order, setOrder] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/getorderdetails/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message);
          return;
        }

        setOrder(data);
      } catch {
        setMessage('Unable to connect to the server');
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between mb-5">
          <h2 className="text-xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-slate-500">✕</button>
        </div>

        {message && <p className="text-red-600">{message}</p>}

        {!order && !message && <p>Loading order...</p>}

        {order && (
          <>
            <p>Order ID: {order._id}</p>
            <p>Status: {order.status}</p>
            <p>Address: {order.shippingAddress}</p>
            <p>Payment: {order.paymentMethod}</p>

            <hr className="my-4" />

            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between py-2">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <hr className="my-4" />

            <p className="text-xl font-bold text-right">
              Total: ${order.total.toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
