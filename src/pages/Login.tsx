import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import backgroundImage from '../assets/images/background/bg.jpg'; 
import http from '../api/http';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
  if (e) e.preventDefault(); // Prevent form reload
  setError('');
  setLoading(true);

  try {
    const response = await http.post('/Login', {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      localStorage.setItem('accessToken', response.data.accessToken); // Optional
      navigate('/dashboard');
    } else {
      setError('Invalid login');
    }
  } catch (error: any) {
    setError('Login failed');
    console.error('Login error:', error);
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    setEmailSent(true);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="w-[25%] p-5 z-10 rounded-lg hover" style={{ backgroundColor: ' #4A102A ' }}>
        <div className="flex justify-center items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center">
            <img
              src="https://img.freepik.com/premium-vector/sweet-cake-bakery-shop-logo_807399-1051.jpg"
              alt="Cake"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        <h2 className="text-center bg-amber-500 text-2xl font-semibold mb-1 text-white">Welcome!</h2>
        <form className="space-y-6 bg-amber-500">
          <div>
            <label className="block text-white mb-2">Username</label>
            <div className="flex items-center bg-white rounded-lg px-3 py-2 border">
              <User className="w-5 h-5 text-blue-400 mr-2" />
              <input
                type="text"
                placeholder="Username"
                className="w-full outline-none bg-transparent text-sm"
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-white mb-2">Password</label>
            <div className="flex items-center bg-white rounded-md px-3 py-2 border">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full outline-none bg-transparent text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              className="mr-2"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe" className="text-white text-sm">Remember Me</label>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition flex justify-center items-center"
            onClick={handleLogin}
          >
           LogIn
          </button>
          <div className="text-right text-xs text-white mt-4">
            <a href="#" className="hover:underline" onClick={() => setShowForgotPassword(true)}>
              Forgot password?
            </a>
          </div>
        </form>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-[30%] p-5 bg-white rounded-lg">
            <h2 className="text-center text-2xl font-semibold mb-4">Forgot Password</h2>
            {emailSent ? (
              <div className="text-green-500 text-sm mb-4">
                A password reset link has been sent to your email.
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full outline-none bg-transparent text-sm border px-3 py-2 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 transition flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-2 rounded-full" role="status">
                      <span className="visually-hidden"></span>
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}
            <button
              className="mt-4 text-blue-600 hover:underline"
              onClick={() => setShowForgotPassword(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;