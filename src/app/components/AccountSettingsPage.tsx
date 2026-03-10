import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Save, 
  Loader2, 
  AlertCircle,
  Shield,
  LogOut,
  CheckCircle2,
  Info
} from 'lucide-react';
import { 
  getCurrentUser, 
  logout,
  validateUsername, 
  validateEmail
} from '../services/authService';
import { supabase, isConfigured } from '../lib/supabase';
import { User as UserType } from '../services/authService';
import { 
  isEmailServiceConfigured, 
  saveResendAPIKey,
  getResendAPIKeyMasked 
} from '../services/emailService';

interface AccountSettingsPageProps {
  onLogout: () => void;
}

export function AccountSettingsPage({ onLogout }: AccountSettingsPageProps) {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  // Email service configuration
  const [resendAPIKey, setResendAPIKey] = useState('');
  const [showResendAPIKey, setShowResendAPIKey] = useState(false);
  const [isSavingEmailConfig, setIsSavingEmailConfig] = useState(false);
  
  // Email service status detection
  const [emailServiceStatus, setEmailServiceStatus] = useState<{
    working: boolean;
    error?: string;
    checked: boolean;
  }>({ working: false, checked: false });
  
  // UI states
  const [isSaving, setIsSaving] = useState(false);
  
  // Error states
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
  }>({});

  // Load current user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      if (isConfigured()) {
        // Try to get user from Supabase Auth first
        let user = await getCurrentUser();
        
        // If no auth user, check localStorage for username/password login
        if (!user) {
          const storedUsername = localStorage.getItem('mnemosyne_current_user');
          if (storedUsername) {
            console.log('🔍 Loading user from username:', storedUsername);
            
            // Get user from database by username
            const { data: userData, error } = await supabase
              .from('users')
              .select('*')
              .eq('username', storedUsername)
              .eq('is_active', true)
              .single();
            
            if (userData && !error) {
              user = userData;
              console.log('✅ Loaded user from database:', user);
            } else {
              console.log('⚠️ User not found in database, checking demo credentials');
              // If not in database but logged in, use demo user with stored username
              const storedEmail = localStorage.getItem('mnemosyne_current_email') || 'mnemosyne@gmail.com';
              if (storedUsername === 'mnemosyne') {
                user = {
                  id: 'demo-user-id',
                  username: storedUsername,
                  email: storedEmail,
                  full_name: 'Mnemosyne Admin',
                  is_active: true,
                };
                console.log('✅ Using demo user data with stored email:', storedEmail);
              }
            }
          }
        }
        
        if (user) {
          setCurrentUser(user);
          setUsername(user.username);
          setEmail(user.email);
          console.log('✅ User loaded successfully');
        } else {
          console.log('ℹ️ No active session found, using default demo data');
          // Fallback to demo mode
          const storedEmail = localStorage.getItem('mnemosyne_current_email') || 'mnemosyne@gmail.com';
          setCurrentUser({
            id: 'demo-user-id',
            username: 'mnemosyne',
            email: storedEmail,
            full_name: 'Mnemosyne Admin',
            is_active: true,
          });
          setUsername('mnemosyne');
          setEmail(storedEmail);
        }
      } else {
        // Demo mode - Supabase not configured
        console.log('ℹ️ Supabase not configured, running in demo mode');
        const storedUsername = localStorage.getItem('mnemosyne_current_user') || 'mnemosyne';
        const storedEmail = localStorage.getItem('mnemosyne_current_email') || 'mnemosyne@gmail.com';
        setCurrentUser({
          id: 'demo-user-id',
          username: storedUsername,
          email: storedEmail,
          full_name: 'Mnemosyne Admin',
          is_active: true,
        });
        setUsername(storedUsername);
        setEmail(storedEmail);
        console.log('✅ Demo mode: Loaded from localStorage - username:', storedUsername, 'email:', storedEmail);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      // On error, still provide demo user data
      const storedUsername = localStorage.getItem('mnemosyne_current_user') || 'mnemosyne';
      const storedEmail = localStorage.getItem('mnemosyne_current_email') || 'mnemosyne@gmail.com';
      setCurrentUser({
        id: 'demo-user-id',
        username: storedUsername,
        email: storedEmail,
        full_name: 'Mnemosyne Admin',
        is_active: true,
      });
      setUsername(storedUsername);
      setEmail(storedEmail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setErrors({ username: usernameValidation.error });
      toast.error(usernameValidation.error);
      return;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error });
      toast.error(emailValidation.error);
      return;
    }

    setIsSaving(true);
    console.log('💾 Saving profile changes...', { username, email });

    try {
      if (isConfigured() && currentUser && currentUser.id !== 'demo-user-id') {
        console.log('🔄 Updating user in database...');
        
        const { data, error: updateError } = await supabase
          .from('users')
          .update({
            username: username,
            email: email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id)
          .select();

        if (updateError) {
          console.error('❌ Database update error:', updateError);
          
          // Handle specific errors
          if (updateError.code === '23505') {
            if (updateError.message.includes('username')) {
              setErrors({ username: 'Username already taken' });
              toast.error('Username already exists. Please choose another.');
            } else if (updateError.message.includes('email')) {
              setErrors({ email: 'Email already in use' });
              toast.error('Email already exists. Please use another.');
            }
          } else {
            toast.error('Failed to save profile. Please try again.');
          }
          return;
        }

        console.log('✅ Profile updated in database:', data);

        // Update localStorage with new username and email
        localStorage.setItem('mnemosyne_current_user', username);
        localStorage.setItem('mnemosyne_current_email', email);

        if (email !== currentUser.email) {
          console.log('📧 Email changed, updating Supabase Auth...');
          const { error: emailError } = await supabase.auth.updateUser({
            email: email,
          });

          if (emailError) {
            console.warn('⚠️ Email update warning:', emailError);
            toast.warning('Profile updated, but email change requires verification. Check your inbox!');
          } else {
            console.log('✅ Email updated in auth');
          }
        }

        toast.success('✅ Profile saved successfully!', {
          description: 'Your changes have been saved.',
        });
        
        await loadUserData();
        console.log('✅ Profile update complete');
      } else {
        // Demo mode
        console.log('ℹ️ Demo mode: Simulating profile save...');
        
        // Update localStorage even in demo mode
        localStorage.setItem('mnemosyne_current_user', username);
        localStorage.setItem('mnemosyne_current_email', email);
        
        // Update current user state
        setCurrentUser({
          ...currentUser!,
          username: username,
          email: email,
        });
        
        // Also update the form fields to reflect the changes
        setUsername(username);
        setEmail(email);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        toast.success('✅ Profile updated in demo mode!', {
          description: 'Changes saved locally. Connect to Supabase for permanent storage.',
        });
        
        console.log('✅ Demo mode: Saved to localStorage - username:', username, 'email:', email);
      }
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };



  const handleLogout = async () => {
    try {
      console.log('👋 Logging out...');
      await logout();
      onLogout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleSaveEmailConfig = async () => {
    if (!resendAPIKey.trim()) {
      toast.error('Please fill in the Resend API key');
      return;
    }

    setIsSavingEmailConfig(true);
    console.log('💾 Saving Resend configuration...');

    try {
      saveResendAPIKey(resendAPIKey.trim());
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('✅ Email service configured!', {
        description: 'Password reset emails will now be sent via Resend.',
      });
      
      // Clear input fields
      setResendAPIKey('');
      setShowResendAPIKey(false);
      
      console.log('✅ Resend configuration saved successfully');
    } catch (error) {
      console.error('❌ Error saving email config:', error);
      toast.error('Failed to save email configuration');
    } finally {
      setIsSavingEmailConfig(false);
    }
  };

  const handleTestEmailConfig = async () => {
    if (!resendAPIKey.trim()) {
      toast.error('Please fill in the Resend API key first');
      return;
    }

    setIsSavingEmailConfig(true);
    console.log('🧪 Testing Resend configuration...');

    try {
      // Temporarily save config for testing
      const emailjs = (await import('@emailjs/browser')).default;
      emailjs.init(resendAPIKey.trim());

      const templateParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        reset_link: 'https://example.com/reset',
        from_name: 'Mnemosyne',
      };

      console.log('📤 Sending test email...');
      
      const response = await emailjs.send(
        'service_abc123',
        'template_xyz789',
        templateParams
      );

      if (response.status === 200) {
        toast.success('✅ Configuration is valid!', {
          description: 'EmailJS keys are correct. You can save them now.',
        });
      } else {
        toast.error('❌ Test failed', {
          description: response.text || 'Unknown error',
        });
      }
    } catch (error: any) {
      console.error('❌ Test failed:', error);
      
      let errorMsg = 'Configuration test failed';
      if (error.text?.includes('template ID not found')) {
        errorMsg = 'Template ID not found. Create the template in EmailJS first.';
        toast.error('❌ Template Not Found', {
          description: 'Visit https://dashboard.emailjs.com/admin/templates to create it.',
        });
      } else if (error.text?.includes('service ID not found')) {
        errorMsg = 'Service ID not found. Check your EmailJS dashboard.';
        toast.error('❌ Service Not Found', {
          description: 'Visit https://dashboard.emailjs.com/admin to verify Service ID.',
        });
      } else if (error.status === 401 || error.status === 403) {
        errorMsg = 'Invalid Public Key. Check your EmailJS account settings.';
        toast.error('❌ Invalid Public Key', {
          description: 'Visit https://dashboard.emailjs.com/admin/account to verify Public Key.',
        });
      } else {
        toast.error('❌ Test Failed', {
          description: error.text || error.message || errorMsg,
        });
      }
    } finally {
      setIsSavingEmailConfig(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0a2647] mx-auto mb-3" />
          <p className="text-gray-600">Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Account Settings</h1>
          <p className="text-gray-500 text-sm">Manage your account information</p>
        </div>

        {/* User Info Card - Minimal */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-900 truncate">{username}</h2>
              <p className="text-gray-500 text-sm truncate">{email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Active
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-base font-semibold text-gray-900">Profile Information</h3>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, username: undefined });
                  }}
                  className={`h-10 ${
                    errors.username 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="Enter username"
                />
                <AnimatePresence>
                  {errors.username && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-600 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.username}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  className={`h-10 ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-primary'
                  }`}
                  placeholder="your@email.com"
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-600 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary hover:bg-[#0d3159] text-white h-10"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Email Configuration - Simplified */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-base font-semibold text-gray-900">Email Service</h3>
              </div>
              {isEmailServiceConfigured() ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                  <CheckCircle2 size={12} />
                  Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                  <Info size={12} />
                  Not Configured
                </span>
              )}
            </div>

            {isEmailServiceConfigured() ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">Status: Active</p>
                  <p className="text-xs text-green-700 mb-3">
                    Password reset emails are sent securely via Resend from your Supabase Edge Function.
                  </p>
                  <div className="bg-white border border-green-200 rounded p-2">
                    <p className="text-xs text-gray-500 mb-0.5">API Key</p>
                    <p className="font-mono text-xs text-gray-900">{getResendAPIKeyMasked()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Setup Required</p>
                  <ol className="text-xs text-blue-700 space-y-1.5 list-decimal list-inside ml-1">
                    <li>Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">resend.com</a> (free tier available)</li>
                    <li>Get your API key (starts with <code className="bg-blue-100 px-1 rounded font-mono">re_</code>)</li>
                    <li>Add to Supabase Dashboard → Edge Functions → Secrets</li>
                    <li>Set variable: <code className="bg-blue-100 px-1 rounded font-mono">RESEND_API_KEY</code></li>
                  </ol>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                  <p className="text-xs text-amber-800">
                    <strong>Demo Mode:</strong> Password reset links will be displayed directly to users.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logout Section - Minimal */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-0.5">Log Out</h3>
                <p className="text-gray-500 text-sm">End your current session</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}