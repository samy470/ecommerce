import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string | number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3 sm:col-span-2">
          <img
            src={item.image || 'https://via.placeholder.com/100'}
            alt={item.name}
            className="w-full h-auto rounded"
          />
        </div>

        <div className="col-span-9 sm:col-span-4">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">${item.price}</p>
        </div>

        <div className="col-span-6 sm:col-span-3 flex items-center">
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (Number.isInteger(value) && value > 0) {
                onUpdateQuantity(value);
              }
            }}
            className="w-[60px] mx-2 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="col-span-4 sm:col-span-2 font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <button
            onClick={onRemove}
            className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;