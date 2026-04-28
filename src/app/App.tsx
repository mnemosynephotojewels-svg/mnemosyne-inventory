/**
 * APPLICATION ROUTER
 * 
 * This component determines which version of the app to load:
 * - If URL has ?token=... parameter → Load lightweight Reset Password page
 * - Otherwise → Load full Mnemosyne application
 * 
 * This prevents figma:asset loading issues when accessing from email links.
 */

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Check URL for reset password token at module load time
const urlParams = new URLSearchParams(window.location.search);
const hasResetToken = urlParams.has('token');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🚀 APP ROUTER');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📍 Current URL:', window.location.href);
console.log('🎫 Has Reset Token:', hasResetToken);
console.log('🔄 Mode:', hasResetToken ? 'Reset Password' : 'Full Application');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

// Lazy load the appropriate component based on URL
const ResetPasswordStandalone = lazy(() => import('./ResetPasswordStandalone'));
const AppMain = lazy(() => import('./AppMain'));

// Single default export that routes internally
export default function App() {
  if (hasResetToken) {
    // RESET PASSWORD MODE - Lightweight
    console.log('🔐 Loading Reset Password (no figma:asset dependencies)');
    
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <div className="text-center space-y-4">
            <Loader2 className="animate-spin text-secondary mx-auto" size={48} />
            <p className="text-secondary text-lg">Loading password reset...</p>
          </div>
        </div>
      }>
        <ResetPasswordStandalone />
      </Suspense>
    );
  } else {
    // NORMAL APP MODE - Full application
    console.log('📱 Loading Full Application (all features)');
    
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-primary">
          <div className="text-center space-y-4">
            <Loader2 className="animate-spin text-secondary mx-auto" size={48} />
            <p className="text-secondary text-lg">Loading Mnemosyne...</p>
          </div>
        </div>
      }>
        <AppMain />
      </Suspense>
    );
  }
}
