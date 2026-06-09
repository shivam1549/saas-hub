"use client";
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import { Layers, ArrowRight, Mail, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import api from '@/api/axios';
import Loader from '@/components/Loader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Add a state to track the initial auth check
  const [isChecking, setIsChecking] = useState(true); 
  
  const router = useRouter();

  // 3. THE ROUTE GUARD: Check auth immediately on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // If they have a token, instantly route them away
      router.push('/dashboard');
    } else {
      // If no token, turn off the checking state and show the login form
      setIsChecking(false);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); 

    try {
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      const { access_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/dashboard');

    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setIsLoading(false); 
    }
  };

  // 4. PREVENT THE UI FLASH
  // If we are still checking local storage, just show the loader!
  if (isChecking) {
    return <Loader text="Verifying session..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
      
      {isLoading && <Loader text="Authenticating..." />}

      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-blue-600 rounded-xl items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <Layers className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to CollabHub</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access your workspace</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                  disabled={isLoading} 
                  className="w-full pl-10 text-slate-900 placeholder-slate-500 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full pl-10 text-slate-900 placeholder-slate-500 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}