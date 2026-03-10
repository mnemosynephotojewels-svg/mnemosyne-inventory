import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner';
import loginBg from '../../assets/login.png';
import { User, Lock, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { 
  login, 
  requestPasswordReset,
  resetPasswordWithCode,
  validateUsername, 
  validatePassword,
  validateEmail 
} from '../services/authService';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  
  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'success'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Load remembered username on mount
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('mnemosyne_remember_username');
    if (rememberedUsername) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setErrors({ username: usernameValidation.error });
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.error });
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ username, password });

      if (response.success) {
  // Store remember me preference
  if (rememberMe) {
    localStorage.setItem('mnemosyne_remember_username', username);
  } else {
    localStorage.removeItem('mnemosyne_remember_username');
  }

  // Save authentication state to localStorage
  localStorage.setItem('mnemosyne_authenticated', 'true');
  console.log('🔐 Authentication saved to localStorage');

  toast.success(`Welcome back, ${response.user?.username}!`);
  onLoginSuccess();
  
  }    
      } else {
        setErrors({ username: response.error || 'Login failed' });
        toast.error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [demoCode, setDemoCode] = useState<string>('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    const emailValidation = validateEmail(resetEmail);
    if (!emailValidation.valid) {
      toast.error(emailValidation.error || 'Invalid email');
      return;
    }

    setResetLoading(true);
    setDemoCode(''); // Clear any previous demo code

    try {
      const response = await requestPasswordReset(resetEmail);

      if (response.success && response.verificationCodeSent) {
        setResetStep('code');
        
        // Check if we have a demo mode code
        const demoCode = sessionStorage.getItem('mnemosyne_demo_reset_code');
        if (demoCode || response.verificationCode) {
          const codeToDisplay = demoCode || response.verificationCode;
          setDemoCode(codeToDisplay);
          
          // Show prominent console message
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4af37; font-weight: bold;');
          console.log('%c🔐 VERIFICATION CODE (Email Service Failed)', 'color: #dc3545; font-size: 18px; font-weight: bold;');
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4af37; font-weight: bold;');
          console.log('%c' + codeToDisplay, 'color: #fff; font-size: 48px; font-weight: bold; background: #dc3545; padding: 20px; border-radius: 10px; letter-spacing: 8px; display: block; text-align: center;');
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4af37; font-weight: bold;');
          console.log('%c⚠️ EmailJS is not working - Code displayed on screen', 'color: #ffc107; font-size: 14px; font-weight: bold;');
          console.log('%c💡 Check the yellow alert box on the screen!', 'color: #17a2b8; font-size: 14px;');
          console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4af37; font-weight: bold;');
          
          toast.warning('Email service unavailable - Code displayed on screen', {
            duration: 10000,
            description: 'Check the yellow box for your verification code',
          });
        } else {
          toast.success(response.message || 'Verification code sent to your email!', {
            description: 'Please check your inbox and spam folder.',
          });
        }
      } else if (response.success) {
        toast.info(response.message || 'If an account exists, a code was sent.');
        setResetStep('code');
      } else {
        // Show detailed error with helpful guidance
        const errorMessage = response.error || 'Failed to send verification code';
        
        if (errorMessage.includes('temporarily unavailable') || 
            errorMessage.includes('service incident') ||
            response.error?.includes('412')) {
          toast.error('Email service temporarily unavailable', {
            description: 'EmailJS is recovering from a service incident. Please wait 10-15 minutes and try again.',
            duration: 8000,
          });
        } else if (errorMessage.includes('configuration error') || 
                   errorMessage.includes('permissions')) {
          toast.error('Email service needs reconfiguration', {
            description: 'Administrator action required. Check browser console (F12) for detailed instructions.',
            duration: 8000,
          });
        } else {
          toast.error(errorMessage, {
            duration: 6000,
          });
        }
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send verification code', {
        description: 'Please try again or contact administrator.',
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!verificationCode || verificationCode.trim().length !== 6) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      toast.error(passwordValidation.error || 'Invalid password');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setResetLoading(true);

    try {
      const response = await resetPasswordWithCode(resetEmail, verificationCode.trim(), newPassword);

      if (response.success) {
        setResetStep('success');
        toast.success(response.message || 'Password reset successfully!');
      } else {
        toast.error(response.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setResetStep('email');
    setResetEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 mt-48"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[500px] border border-white/20"
          >
            {resetStep === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
                  <p className="text-white/80 text-sm">
                    Enter your email to receive a verification code
                  </p>
                </div>

                {/* Process Steps */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-white/20">
                  <p className="text-white/90 font-semibold text-sm">Reset Process:</p>
                  <div className="space-y-2 text-xs text-white/80">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-secondary font-bold">1</span>
                      </div>
                      <span>Enter your email address below</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <span>Receive 6-digit verification code via email</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <span>Enter code and create new password</span>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2 relative">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-6 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                      disabled={resetLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Sending Code...
                    </span>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>

                {/* Back to Login */}
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex items-center justify-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </form>
            )}

            {resetStep === 'code' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldCheck className="text-secondary" size={32} />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Enter Verification Code</h2>
                  <p className="text-white/80 text-sm">
                    We sent a 6-digit code to <span className="font-semibold">{resetEmail}</span>
                  </p>
                </div>

                {/* Demo Mode Alert - Show verification code prominently */}
                {demoCode && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-6 border-4 border-amber-300 shadow-2xl"
                  >
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                        <AlertCircle size={20} />
                        <span>DEMO MODE - EMAIL NOT SENT</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border-2 border-amber-600">
                        <p className="text-xs text-amber-900 font-semibold mb-2">YOUR VERIFICATION CODE:</p>
                        <p className="text-5xl font-black tracking-[0.5em] text-amber-900 font-mono">
                          {demoCode}
                        </p>
                      </div>
                      <p className="text-xs text-amber-950 font-medium leading-relaxed">
                        Copy this code and paste it below. Email service is not configured.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          // Use try-catch for clipboard API (may fail due to permissions)
                          // Note: clipboard.writeText returns a Promise, so we need async/await
                          try {
                            await navigator.clipboard.writeText(demoCode);
                            toast.success('Code copied to clipboard!');
                          } catch (error) {
                            // Fallback: Just show a message if clipboard fails
                            console.log('Clipboard API not available, code already visible on screen');
                            toast.info('Code is displayed above - copy it manually');
                          }
                        }}
                        className="w-full bg-white/90 hover:bg-white text-amber-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        📋 Copy Code to Clipboard
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Verification Code Input */}
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-semibold">Verification Code</label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-6 py-6 text-center text-2xl font-bold tracking-widest border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-400 backdrop-blur-sm"
                    disabled={resetLoading}
                    maxLength={6}
                    autoFocus
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-semibold">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                      disabled={resetLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-white/90 text-sm font-semibold">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                      disabled={resetLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg disabled:opacity-50"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      Resetting Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </Button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => setResetStep('email')}
                  className="w-full flex items-center justify-center gap-2 text-white hover:text-white/80 transition-colors text-sm font-medium"
                  disabled={resetLoading}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              </form>
            )}

            {resetStep === 'success' && (
              <div className="space-y-6 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="flex justify-center"
                >
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="text-green-400" size={48} />
                  </div>
                </motion.div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">Password Reset!</h2>
                  <p className="text-white/80 text-sm">
                    Your password has been successfully reset.
                  </p>
                  <p className="text-white/70 text-xs mt-4">
                    You can now log in with your new password.
                  </p>
                </div>

                {/* Back to Login */}
                <Button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Login
                  </span>
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 mt-48"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div className="space-y-2 relative">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({});
                  }}
                  className="w-full pl-12 pr-6 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-600 text-sm text-center font-semibold"
                >
                  {errors.username}
                </motion.div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2 relative">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                  className="w-full pl-12 pr-6 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-600 text-sm text-center font-semibold"
                >
                  {errors.password}
                </motion.div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <label 
                  htmlFor="remember-me" 
                  className="text-white/90 text-sm font-medium cursor-pointer select-none"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-secondary hover:text-secondary/80 transition-colors text-sm font-semibold"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg disabled:opacity-50"
            >
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}