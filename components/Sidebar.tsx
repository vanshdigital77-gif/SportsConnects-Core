
import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  BarChart2, 
  Settings, 
  LogOut,
  Trophy,
  Users
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab, onLogout }) => {
  const menuItems = role === 'ATHLETE' ? [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'training', label: 'Training Log', icon: <PlusCircle size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
    { id: 'achievements', label: 'Badges', icon: <Trophy size={20} /> },
  ] : [
    { id: 'dashboard', label: 'Team Overview', icon: <Users size={20} /> },
    { id: 'reports', label: 'Global Reports', icon: <BarChart2 size={20} /> },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1D3D76] text-white min-h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">
          Sports<span className="text-[#E6C264]">Connects</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-blue-200 mt-1 font-semibold opacity-75">Performance Tracker</p>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
              ? 'bg-[#E6C264] text-[#1D3D76] font-bold shadow-lg' 
              : 'hover:bg-white/10 text-blue-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-blue-200 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
