import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, CircleUser, Search, Menu } from 'lucide-react';
import { setSearchQuery } from '../redux/productSlice';
import type { RootState, AppDispatch } from '../redux/store';

function Navbar({setIsLoggedIn, setUsername }: { isLoggedIn: boolean, setIsLoggedIn: (value: boolean) => void, username: string, setUsername: (value:string) => void }) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const { cartItems } = useSelector((state: RootState) => state.cart);
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    const close = (): void => {
        setProfileOpen(false);
        setMobileOpen(false);
    };

    function handleLogout() {
    setIsLoggedIn(false)
    setUsername('')
    localStorage.removeItem('token')
    localStorage.removeItem('user');
    navigate('/')
  }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
        dispatch(setSearchQuery(e.target.value));
        if (window.location.pathname !== '/products') navigate('/products');
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const menuItem = 'block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100';

    return (
        <nav className="sticky top-0 w-full z-40 bg-indigo-800 text-white backdrop-blur-md border-b border-white/10 shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <button
                        aria-label="menu"
                        className="mr-2 p-2 rounded-full hover:bg-white/10 md:hidden"
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <a href='/' className="font-sans text-xl font-bold text-white" >
                        E-Shop
                    </a>

                    <div className="relative ml-3 sm:ml-6 mr-4 rounded bg-white/15 hover:bg-white/25 w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none bg-white/10 border border-white/15 rounded-lg hover:bg-white/20" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            aria-label="search"
                            onChange={handleSearch}
                            className="bg-transparent py-2 pl-10 pr-2 w-full md:w-[20ch] placeholder-white/70 focus:outline-none"
                        />
                    </div>

                    <div className="grow" />

                    {/* Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        <button className="px-3 py-2 uppercase text-sm font-medium rounded hover:bg-white/10" onClick={() => navigate('/products')}>
                            Products
                        </button>

                        <button aria-label="cart" className="relative p-2 rounded-full hover:bg-white/10" onClick={() => navigate('/cart')}>
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-pink-600 text-xs flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button aria-label="account" className="p-2 rounded-full hover:bg-white/10" onClick={() => setProfileOpen((o) => !o)}>
                                    <CircleUser className="w-7 h-7" />
                                </button>
                                {profileOpen && (
                                    <>
                                        <div className="fixed inset-0" onClick={close} />
                                        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-1">
                                            <button className={menuItem} onClick={() => navigate('/profile')}>Profile</button>
                                            <button className={menuItem} onClick={() => navigate('/orders')}>Orders</button>
                                            <button className={menuItem} onClick={handleLogout}>Logout</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <button className="px-3 py-2 uppercase text-sm font-medium rounded hover:bg-white/10" onClick={() => navigate('/login')}>
                                    Login
                                </button>
                                <button className="px-3 py-2 uppercase text-sm font-medium rounded hover:bg-white/10" onClick={() => navigate('/register')}>
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white rounded-b shadow-lg py-1">
                    <button className={menuItem} onClick={() => navigate('/products')}>Products</button>
                    <button className={menuItem} onClick={() => navigate('/cart')}>Cart ({cartCount})</button>
                    {user ? (
                        <>
                            <button className={menuItem} onClick={() => navigate('/profile')}>Profile</button>
                            <button className={menuItem} onClick={() => navigate('/orders')}>Orders</button>
                            <button className={menuItem} onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className={menuItem} onClick={() => navigate('/login')}>Login</button>
                            <button className={menuItem} onClick={() => navigate('/register')}>Register</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;