
import type { JSX } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { setCategory, fetchProducts } from '../redux/productSlice';
import type { RootState, AppDispatch } from '../redux/store';
import type { Product } from '../components/ProductCard';

function Products(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, searchQuery, category } = useSelector(
    (state: RootState) => state.products
  ) as {
    products: Product[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    category: string;
  };

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, category]);

  const filteredProducts = products.filter((product) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(q) ||
      product.description?.toLowerCase().includes(q);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-5 py-4" role="alert">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Our Products
          </h1>
          <p className="text-slate-500">
            Explore our collection and find exactly what you need.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Browse Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Filter by category
              </p>
            </div>

            <div className="flex flex-col min-w-[220px]">
              <label htmlFor="category" className="text-sm font-medium text-slate-600 mb-2">
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="border border-slate-200 rounded-lg px-4 py-3 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id ?? product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="mt-10 flex justify-center items-center gap-2">
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                      n === page
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm py-16 px-4 text-center">
            <ShoppingBag className="w-14 h-14 text-indigo-300 mx-auto mb-5" />

            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              No products found
            </h2>

            <p className="text-slate-500 max-w-sm mx-auto">
              We couldn't find any products matching your search. Try another search or category.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}

export default Products;
