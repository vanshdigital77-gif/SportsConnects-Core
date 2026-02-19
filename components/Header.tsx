
import React from 'react';
import { User } from '../types';
import { Bell, Search, User as UserIcon, Zap } from 'lucide-react';

interface HeaderProps {
  user: User;
  onUpgrade?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUpgrade }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search performance logs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-[#1D3D76] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user.role === 'ATHLETE' && user.subscriptionStatus === 'FREE' && (
          <button 
            onClick={onUpgrade}
            className="hidden sm:flex items-center space-x-2 bg-[#E6C264] text-[#1D3D76] px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:scale-105 transition-transform"
          >
            <Zap size={14} fill="#1D3D76" />
            <span>Go PRO</span>
          </button>
        )}

        <button className="p-2 text-gray-400 hover:text-[#1D3D76] hover:bg-gray-50 rounded-full transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end space-x-1">
              <p className="text-sm font-bold text-[#1D3D76] leading-none">{user.name}</p>
              {user.subscriptionStatus === 'PRO' && <Zap size={12} className="text-[#E6C264]" fill="#E6C264" />}
            </div>
            <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-wider">{user.role}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-[#1D3D76] overflow-hidden border-2 border-white shadow-sm">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
