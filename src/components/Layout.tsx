
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute right-4 top-4">
            <button onClick={toggleMenu} className="rounded-full p-2 hover:bg-gray-200">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="absolute inset-y-0 left-0 w-3/4 max-w-sm bg-white p-6 shadow-lg">
            <Link to="/dashboard" className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded-md block" onClick={closeMenu}>
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link to="/appointments" className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded-md block" onClick={closeMenu}>
              <Calendar className="h-5 w-5" />
              <span>Appointments</span>
            </Link>
            <Link to="/scanner" className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded-md block" onClick={closeMenu}>
              <Search className="h-5 w-5" />
              <span>Scanner</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-gray-800 text-white">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-lg font-semibold">Vet Clinic App</span>
        </div>
        <nav className="flex-1 px-2 py-4">
          <Link to="/dashboard" className={cn("flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md", location.pathname === "/dashboard" ? "bg-gray-700" : "")}>
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/appointments" className={cn("flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md", location.pathname === "/appointments" ? "bg-gray-700" : "")}>
            <Calendar className="h-5 w-5" />
            <span>Appointments</span>
          </Link>
          <Link to="/scanner" className={cn("flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md", location.pathname === "/scanner" ? "bg-gray-700" : "")}>
            <Search className="h-5 w-5" />
            <span>Scanner</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
            </h2>
            <button onClick={toggleMenu} className="md:hidden rounded-full p-2 hover:bg-gray-200">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
