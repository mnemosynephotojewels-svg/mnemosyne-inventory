import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, AlertCircle, Check, X } from 'lucide-react';
import { resetPasswordWithToken, verifyResetToken, validatePassword } from '../services/authService';

export function ResetPasswordPageSimple() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string>('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);

  console.log('🔐 ResetPasswordPageSimple: Component rendered');

  useEffect(() => {
    console.log('🔐 ResetPasswordPageSimple: useEffect running');
    console.log('🔐 URL:', window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');

    console.log('🔐 Token from URL:', resetToken);

    if (!resetToken) {
      console.error('❌ No token found');
      toast.error('Invalid reset link');
      setTokenValid(false);
      setIsValidating(false);
      return;
    }

    setToken(resetToken);

    const checkToken = async () => {
      console.log('🔍 Verifying token...');
      const result = await verifyResetToken(resetToken);
      console.log('🔍 Result:', result);
      
      setTokenValid(result.valid);
      setIsValidating(false);
      
      if (result.valid) {
        toast.success('Reset link verified!');
      } else {
        toast.error(result.error || 'Invalid reset link');
      }
    };

    checkToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPasswordWithToken(token, newPassword);

      if (result.success) {
        toast.success('Password reset successfully!');
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        toast.error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple loading state
  if (isValidating) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20 w-[450px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-secondary" size={40} />
            <h2 className="text-2xl font-bold text-white">Verifying Reset Link</h2>
            <p className="text-white/80 text-sm text-center">
              Please wait while we validate your password reset request...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token
  if (tokenValid === false) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20">
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-400" size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Invalid Reset Link</h2>
              <p className="text-white/80 text-sm mt-2">
                This password reset link is invalid or has expired.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-secondary hover:bg-secondary/90 text-white py-6"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-primary">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20">
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-400" size={48} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Password Reset!</h2>
              <p className="text-white/80 text-base mt-2">
                Your password has been successfully updated.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main reset form
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-primary">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Reset Password</h2>
            <p className="text-white/80 text-sm">Enter your new password below</p>
          </div>

          {/* New Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-6 text-base"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-6 text-base"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className={`text-sm ${newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
              {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-secondary hover:bg-secondary/90 text-white py-6 text-lg font-bold"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
