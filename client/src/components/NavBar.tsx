import {
  ArrowUpRight,
  BikeIcon,
  ChevronDownIcon,
  LogOutIcon,
  MapPinIcon,
  MenuIcon,
  Package2Icon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "lucide-react";

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const NavBar = () => {
  // Replace this placeholder with your existing authentication state.
  const user: any = {
    name: "Sanket Hajare",
    email: "sankethajare@gmail.com",
    isAdmin: true,
  };

  // Replace these placeholders with your existing cart context.
  const { cartCount, setIsCartOpen } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMenus = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-app-border bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-2 text-[22px] font-medium"
        >
          <BikeIcon size={24} />
          InstaCart
        </Link>

        {/* Navigation, Search and Actions */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:gap-8">
          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
            <Link to="/" className="transition-colors hover:text-app-orange">
              Home
            </Link>

            <Link
              to="/products"
              className="transition-colors hover:text-app-orange"
            >
              Products
            </Link>

            <Link to="/deals" className="text-app-orange transition-colors">
              Deals
            </Link>
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden min-w-0 max-w-sm flex-1 text-sm sm:flex"
          >
            <div className="relative w-full">
              <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />

              <input
                type="search"
                placeholder="Search for groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full bg-orange-50 p-2 pl-8 outline-none ring ring-app-orange/15 focus:ring-app-orange/30"
              />
            </div>
          </form>

          {/* Right Actions: Cart, User/Sign In and Mobile Menu */}
          <div className="flex shrink-0 items-center gap-3">
            {/* Cart: ONE cart button, visible before and after login */}
            <button
              type="button"
              className="relative p-1"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="size-5 text-zinc-900" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-app-orange text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User / Desktop Sign In: ONE section */}
            <div className="relative">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen((open) => !open);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 p-1"
                  aria-label="User account"
                  aria-expanded={userMenuOpen}
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-950 text-white">
                    {user.name?.charAt(0).toUpperCase() || (
                      <UserIcon size={17} />
                    )}
                  </div>

                  <ChevronDownIcon className="size-3 text-zinc-500" />
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="hidden items-center gap-2 rounded-full bg-green-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-900 md:flex"
                >
                  <UserIcon size={16} />
                  Sign In
                </Link>
              )}

              {/* User Dropdown: only one */}
              {user && userMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setUserMenuOpen(false)}
                  />

                  <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-lg border border-app-border bg-white shadow-lg">
                    {/* User Information */}
                    <div className="border-b border-app-border px-4 py-3">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-zinc-500">
                        {user.email}
                      </p>
                    </div>

                    {/* My Orders */}
                    <Link
                      to="/orders"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50"
                    >
                      <Package2Icon size={16} />
                      My Orders
                    </Link>

                    {/* Addresses */}
                    <Link
                      to="/addresses"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50"
                    >
                      <MapPinIcon size={16} />
                      Addresses
                    </Link>

                    {/* Products */}
                    <Link
                      to="/products"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50"
                    >
                      <ArrowUpRight size={16} />
                      Products
                    </Link>

                    {/* Deals */}
                    <Link
                      to="/deals"
                      onClick={closeMenus}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-orange-50"
                    >
                      <ArrowUpRight size={16} />
                      Deals
                    </Link>

                    {/* Admin Panel */}
                    {user.isAdmin && (
                      <Link
                        to="/admin/products"
                        onClick={closeMenus}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-app-orange-dark hover:bg-orange-50"
                      >
                        <ShieldIcon size={16} />
                        Admin Panel
                      </Link>
                    )}

                    {/* Logout */}
                    <div className="border-t border-app-border">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-app-error transition-colors hover:bg-red-50"
                      >
                        <LogOutIcon size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger: only before login */}
            {!user && (
              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((open) => !open)}
                  className="flex items-center justify-center p-1 text-zinc-900"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <XIcon className="size-6" />
                  ) : (
                    <MenuIcon className="size-6" />
                  )}
                </button>

                {/* Mobile Dropdown */}
                {mobileMenuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close mobile menu"
                      className="fixed inset-0 top-16 z-40 cursor-default bg-black/20"
                      onClick={() => setMobileMenuOpen(false)}
                    />

                    <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-app-border bg-white shadow-lg">
                      <Link
                        to="/"
                        onClick={closeMenus}
                        className="block px-4 py-3 text-sm text-zinc-700 hover:bg-orange-50"
                      >
                        Home
                      </Link>

                      <Link
                        to="/products"
                        onClick={closeMenus}
                        className="block px-4 py-3 text-sm text-zinc-700 hover:bg-orange-50"
                      >
                        Products
                      </Link>

                      <Link
                        to="/deals"
                        onClick={closeMenus}
                        className="block px-4 py-3 text-sm text-app-orange hover:bg-orange-50"
                      >
                        Deals
                      </Link>

                      <Link
                        to="/login"
                        onClick={closeMenus}
                        className="flex items-center gap-3 border-t border-app-border px-4 py-3 text-sm font-medium text-green-950 hover:bg-orange-50"
                      >
                        <UserIcon size={16} />
                        Sign In
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
