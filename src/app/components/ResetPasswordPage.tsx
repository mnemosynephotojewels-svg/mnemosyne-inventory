import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import loginBg from 'figma:asset/473aaf84d6443a80cc9292d8effea3843f8869a6.png';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2, Shield, AlertCircle, Check, X } from 'lucide-react';
import { resetPasswordWithToken, verifyResetToken, validatePassword } from '../services/authService';

// Fallback background color if image fails
const FALLBACK_BG = '#0a2647';

export function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [token, setToken] = useState<string>('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
    checks: {
      length: boolean;
      hasLetter: boolean;
      hasNumber: boolean;
      hasSpecial: boolean;
    };
  }>({
    score: 0,
    label: 'Weak',
    color: '#ef4444',
    checks: {
      length: false,
      hasLetter: false,
      hasNumber: false,
      hasSpecial: false,
    },
  });

  console.log('🔐 ResetPasswordPage: Component mounted/rendered');

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let score = 0;
    let label = 'Weak';
    let color = '#ef4444';

    if (password.length === 0) {
      score = 0;
      label = '';
      color = '#e5e7eb';
    } else if (passedChecks === 1) {
      score = 25;
      label = 'Weak';
      color = '#ef4444';
    } else if (passedChecks === 2) {
      score = 50;
      label = 'Fair';
      color = '#f59e0b';
    } else if (passedChecks === 3) {
      score = 75;
      label = 'Good';
      color = '#10b981';
    } else if (passedChecks === 4) {
      score = 100;
      label = 'Strong';
      color = '#059669';
    }

    return { score, label, color, checks };
  };

  // Update password strength when password changes
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength({
        score: 0,
        label: '',
        color: '#e5e7eb',
        checks: {
          length: false,
          hasLetter: false,
          hasNumber: false,
          hasSpecial: false,
        },
      });
    }
  }, [newPassword]);

  useEffect(() => {
    console.log('🔐 ResetPasswordPage: Component mounted');
    console.log('🔐 Full URL:', window.location.href);
    console.log('🔐 Search params:', window.location.search);
    
    // Extract token from URL
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');

    console.log('🔐 Token extraction:', { 
      hasSearchParams: window.location.search.length > 0,
      allParams: Array.from(params.entries()),
      resetToken: resetToken,
      tokenLength: resetToken?.length || 0
    });

    if (!resetToken) {
      console.error('❌ No token found in URL');
      console.error('❌ URL:', window.location.href);
      toast.error('Invalid reset link - no token provided', {
        description: 'Please use the link from your email',
        duration: 5000,
      });
      setTokenValid(false);
      setIsValidating(false);
      return;
    }

    console.log('✅ Token found:', resetToken.substring(0, 10) + '... (length: ' + resetToken.length + ')');
    setToken(resetToken);

    // Verify the token
    const checkToken = async () => {
      console.log('🔍 Verifying token with server...');
      try {
        const result = await verifyResetToken(resetToken);
        console.log('🔍 Token verification result:', result);
        
        setTokenValid(result.valid);
        setIsValidating(false);
        
        if (!result.valid) {
          console.error('❌ Token validation failed:', result.error);
          toast.error(result.error || 'Invalid or expired reset link', {
            description: 'Please request a new password reset link',
            duration: 5000,
          });
        } else {
          console.log('✅ Token is valid! User can now reset password');
          toast.success('Reset link verified!', {
            description: 'Please enter your new password',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('❌ Error verifying token:', error);
        setTokenValid(false);
        setIsValidating(false);
        toast.error('Failed to verify reset link', {
          description: 'Please try again or request a new link',
          duration: 5000,
        });
      }
    };

    checkToken();
  }, []);

  // Handle password reset
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setErrors({ newPassword: passwordValidation.error });
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Attempting password reset...');
      const result = await resetPasswordWithToken(token, newPassword);
      console.log('🔐 Password reset result:', result);

      if (result.success) {
        console.log('✅ Password reset successful!');
        toast.success('Password reset successfully!', {
          description: 'You can now login with your new password',
          duration: 4000,
        });
        setIsSuccess(true);

        // Start countdown
        setCountdown(3);
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        console.error('❌ Password reset failed:', result.error);
        toast.error(result.error || 'Failed to reset password');
        setErrors({ newPassword: result.error });
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Common container style with background image
  const containerStyle: React.CSSProperties = {
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={containerStyle}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 border border-white/20 w-[450px]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center">
              <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Verifying Reset Link</h2>
              <p className="text-white/80 text-sm">
                Please wait while we validate your password reset request...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={containerStyle}
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
            className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20"
          >
            <div className="space-y-6 text-center">
              {/* Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="flex justify-center"
              >
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-400" size={48} />
                </div>
              </motion.div>

              {/* Error Message */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Invalid Reset Link</h2>
                <p className="text-white/80 text-sm">
                  This password reset link is invalid or has expired.
                </p>
                <p className="text-white/70 text-xs mt-4">
                  Please request a new password reset link.
                </p>
              </div>

              {/* Back to Login */}
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg"
              >
                Back to Login
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        style={containerStyle}
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
            className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20"
          >
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
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-white">Password Reset!</h2>
                <p className="text-white/80 text-base">
                  Your password has been successfully updated.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mt-6">
                  <p className="text-white/90 text-sm mb-2">
                    You can now login with your new password
                  </p>
                  <div className="flex items-center justify-center gap-2 text-secondary">
                    <Loader2 className="animate-spin" size={18} />
                    <span className="text-lg font-bold">
                      Redirecting in {countdown}...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={containerStyle}
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
          className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-[450px] border border-white/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Reset Password</h2>
              <p className="text-white/80 text-sm">
                Enter your new password below
              </p>
            </div>

            {/* Progress Steps */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-1">
                    <CheckCircle2 className="text-green-400" size={16} />
                  </div>
                  <p className="text-white/70 text-xs">Email Sent</p>
                </div>
                <div className="flex-1 h-0.5 bg-green-500/30 -mt-5"></div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center mx-auto mb-1">
                    <CheckCircle2 className="text-green-400" size={16} />
                  </div>
                  <p className="text-white/70 text-xs">Link Clicked</p>
                </div>
                <div className="flex-1 h-0.5 bg-secondary/50 -mt-5"></div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-secondary/40 border-2 border-secondary flex items-center justify-center mx-auto mb-1">
                    <span className="text-secondary font-bold text-xs">3</span>
                  </div>
                  <p className="text-white/90 text-xs font-semibold">Set Password</p>
                </div>
                <div className="flex-1 h-0.5 bg-white/20 -mt-5"></div>
                <div className="flex-1 text-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-1">
                    <span className="text-white/50 font-bold text-xs">4</span>
                  </div>
                  <p className="text-white/50 text-xs">Login</p>
                </div>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-3 relative">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setErrors({});
                  }}
                  className="w-full pl-12 pr-12 py-6 text-base border-2 border-white/40 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  {/* Strength Bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength.score}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: passwordStrength.color }}
                      />
                    </div>
                    {passwordStrength.label && (
                      <span
                        className="text-sm font-semibold min-w-[60px]"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>

                  {/* Password Requirements Checklist */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        {passwordStrength.checks.length ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span className={passwordStrength.checks.length ? 'text-white' : 'text-white/60'}>
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.checks.hasLetter ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span className={passwordStrength.checks.hasLetter ? 'text-white' : 'text-white/60'}>
                          Contains letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.checks.hasNumber ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span className={passwordStrength.checks.hasNumber ? 'text-white' : 'text-white/60'}>
                          Contains number
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {passwordStrength.checks.hasSpecial ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <X size={14} className="text-red-400" />
                        )}
                        <span className={passwordStrength.checks.hasSpecial ? 'text-white' : 'text-white/60'}>
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {errors.newPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-600 text-sm text-center font-semibold"
                >
                  {errors.newPassword}
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 relative">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({});
                  }}
                  className={`w-full pl-12 pr-12 py-6 text-base border-2 rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/30 bg-white/60 placeholder:text-gray-600 backdrop-blur-sm ${
                    confirmPassword && newPassword === confirmPassword
                      ? 'border-green-400'
                      : confirmPassword && newPassword !== confirmPassword
                      ? 'border-red-400'
                      : 'border-white/40'
                  }`}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 text-sm font-medium ${
                    newPassword === confirmPassword ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {newPassword === confirmPassword ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Passwords match!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </motion.div>
              )}

              {errors.confirmPassword && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border-2 border-red-300 rounded-lg p-3 text-red-600 text-sm text-center font-semibold"
                >
                  {errors.confirmPassword}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                passwordStrength.score < 50
              }
              className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Resetting Password...
                </span>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Reset Password
                </>
              )}
            </Button>

            {/* Helper text for submit button */}
            {(!newPassword || !confirmPassword || newPassword !== confirmPassword || passwordStrength.score < 50) && (
              <p className="text-white/60 text-xs text-center -mt-2">
                {!newPassword || !confirmPassword
                  ? 'Please fill in all fields'
                  : newPassword !== confirmPassword
                  ? 'Passwords must match'
                  : passwordStrength.score < 50
                  ? 'Password must be at least "Fair" strength'
                  : ''}
              </p>
            )}
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
