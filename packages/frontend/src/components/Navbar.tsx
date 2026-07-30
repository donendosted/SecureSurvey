import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { ClipboardList, Plus, BarChart3, LogOut, Wallet, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected, address, connect, disconnect } = useWallet();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: ClipboardList },
    { to: '/surveys/new', label: 'New Survey', icon: Plus },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary-600" />
              <span className="text-lg font-bold">Midnight Survey</span>
            </Link>
            <div className="flex items-center gap-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {connected ? (
              <button onClick={disconnect} className="btn-ghost btn-sm">
                <Wallet className="h-4 w-4 mr-1 text-green-500" />
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </button>
            ) : (
              <button onClick={connect} className="btn-outline btn-sm">
                <Wallet className="h-4 w-4 mr-1" />
                Connect Wallet
              </button>
            )}
            {user && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  {user.name ?? user.email}
                </div>
                <button onClick={logout} className="btn-ghost btn-sm text-red-500">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
