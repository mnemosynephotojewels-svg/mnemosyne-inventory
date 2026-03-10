/**
 * STANDALONE RESET PASSWORD PAGE
 * 
 * This is a completely isolated reset password page that:
 * - Does NOT import App.tsx (avoiding the logo image dependency)
 * - Does NOT use any figma:asset imports
 * - Can be accessed directly from email links without CORS issues
 * - Redirects to main app after successful reset
 */

import { ResetPasswordPageSimple } from './components/ResetPasswordPageSimple';
import { Toaster } from './components/ui/sonner';

export default function ResetPasswordStandalone() {
  console.log('🔐 ResetPasswordStandalone: Rendering standalone page');
  console.log('🔐 Current URL:', window.location.href);
  
  return (
    <>
      <ResetPasswordPageSimple />
      <Toaster />
    </>
  );
}
