import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LayoutDashboard, Activity, PlusCircle, LogOut, User } from 'lucide-react';

const Navbar = ({ onOpenLogModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo & Privacy Tag */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-lg tracking-tight block leading-none">EduRisk AI</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Academic Monitor</span>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Privacy-Friendly AI
            </span>
          </div>

          {/* Navigation Links */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-slate-100 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/risk-analysis"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/risk-analysis') ? 'bg-slate-100 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>AI Risk Analysis</span>
              </Link>
            </nav>
          )}

          {/* Actions & Profile */}
          {user ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenLogModal}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Log Behaviour</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

              {/* User badge */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800 leading-snug">{user.name}</span>
                <span className="text-xs text-slate-500">{user.department} • {user.year}</span>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm">
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
