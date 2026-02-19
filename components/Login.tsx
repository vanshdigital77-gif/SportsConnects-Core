
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Mail, Lock, LogIn, Chrome, Activity } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('ATHLETE');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || email.split('@')[0],
      email: email,
      role: role,
      subscriptionStatus: 'FREE',
      joinedAt: new Date().toISOString()
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-yellow-100 rounded-full blur-[100px] opacity-50"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white">
        <div className="bg-[#1D3D76] p-8 text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4 border border-white/10">
            <Activity className="text-[#E6C264] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sports<span className="text-[#E6C264]">Connects</span>
          </h1>
          <p className="text-blue-200 text-sm mt-1">Unlock your peak performance potential</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button
              onClick={() => setRole('ATHLETE')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'ATHLETE' ? 'bg-white text-[#1D3D76] shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Athlete
            </button>
            <button
              onClick={() => setRole('COACH')}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                role === 'COACH' ? 'bg-white text-[#1D3D76] shadow-md' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Coach / Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1D3D76] outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm text-gray-900 focus:ring-2 focus:ring-[#1D3D76] outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1D3D76] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-blue-900 transition-all shadow-lg active:scale-[0.98] mt-4"
            >
              <LogIn size={20} />
              <span>Get Started</span>
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
            </div>
          </div>

          <button className="w-full border border-gray-200 bg-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all text-gray-600">
            <Chrome size={20} />
            <span>Google Workspace</span>
          </button>

          <p className="mt-8 text-center text-xs text-gray-400">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
