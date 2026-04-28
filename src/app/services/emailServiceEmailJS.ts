// ============================================================================
// EMAIL SERVICE - EmailJS Implementation (Alternative to Resend)
// ============================================================================
// This is a simpler, frontend-only solution that works immediately
// Perfect if Supabase Edge Functions are difficult to deploy
// ============================================================================

import emailjs from '@emailjs/browser';

// ============================================================================
// CONFIGURATION - REPLACE THESE WITH YOUR EMAILJS CREDENTIALS
// ============================================================================
// Get these from: https://dashboard.emailjs.com/
// 
// Step 1: Sign up at https://www.emailjs.com/
// Step 2: Add an email service (Gmail, Outlook, etc.)
// Step 3: Create an email template
// Step 4: Copy these IDs and paste them below
// ============================================================================

const EMAILJS_PUBLIC_KEY = 'dbbr3PM3LhbdU7D6-'; // From EmailJS Dashboard
const EMAILJS_SERVICE_ID = 'service_zrcx11y'; // Your email service ID
const EMAILJS_TEMPLATE_ID = 'template_y8ypuqa'; // Your template ID

// ============================================================================
// INITIALIZATION
// ============================================================================

let isInitialized = false;

export function initEmailService(): void {
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    console.log('⚠️ EmailJS not configured - using demo mode');
    console.log('📖 See /EMAILJS_SETUP_GUIDE.md for setup instructions');
    return;
  }

  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    isInitialized = true;
    console.log('✅ EmailJS initialized successfully');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 EmailJS Configuration:');
    console.log('   Public Key: ✓ Configured');
    console.log('   Service ID:', EMAILJS_SERVICE_ID);
    console.log('   Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 If you get "insufficient authentication scopes" error:');
    console.log('   Switch from Gmail to Personal Email service in EmailJS');
    console.log('   https://dashboard.emailjs.com/admin/services');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ EmailJS initialization failed:', error);
  }
}

export function isEmailServiceConfigured(): boolean {
  return EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
         EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && 
         EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
}

// ============================================================================
// SEND PASSWORD RESET EMAIL
// ============================================================================

export async function sendPasswordResetEmail(
  recipientEmail: string,
  recipientName: string,
  verificationCode: string
): Promise<{ success: boolean; error?: string; demoMode?: boolean }> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 EMAIL SERVICE (EmailJS): Sending verification code');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Recipient Email:', recipientEmail);
  console.log('👤 Recipient Name:', recipientName);
  console.log('🔐 Verification Code:', verificationCode);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Check if EmailJS is configured
  if (!isEmailServiceConfigured()) {
    console.log('⚠️ EmailJS not configured - using demo mode');
    console.log('🔐 Verification Code for demo:', verificationCode);
    return {
      success: true,
      demoMode: true,
      error: 'EmailJS not configured - see /EMAILJS_SETUP_GUIDE.md',
    };
  }

  // Initialize if not already done
  if (!isInitialized) {
    initEmailService();
  }

  try {
    // Template parameters that will be sent to your EmailJS template
    // Try multiple common parameter names to maximize compatibility
    const templateParams = {
      to_email: recipientEmail,      // Custom parameter
      to_name: recipientName,
      user_email: recipientEmail,    // Alternative name
      reply_to: recipientEmail,      // Alternative name
      email: recipientEmail,         // Alternative name
      recipient_email: recipientEmail, // Alternative name
      verification_code: verificationCode,
      app_name: 'Mnemosyne',
      expiry_time: '10 minutes',
    };

    console.log('📤 Sending email via EmailJS...');
    console.log('📧 Template Params:', templateParams);

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('✅ Email sent successfully!');
    console.log('📩 EmailJS Response:', response);

    return { success: true };
  } catch (error: any) {
    console.error('❌ EmailJS error:', error);
    console.error('❌ Error details:', {
      status: error.status,
      text: error.text,
      message: error.message
    });

    // Check for specific Gmail API permission errors (status 412)
    if (error.status === 412 || (error.text && error.text.includes('insufficient authentication scopes'))) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️ Gmail API Permissions Issue - ERROR 412');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 This could be due to:');
      console.log('   1. EmailJS service incident (database capacity issue)');
      console.log('   2. Gmail OAuth permissions need to be re-granted');
      console.log('');
      console.log('🔍 FIRST: Check EmailJS Status');
      console.log('   → Visit: https://dashboard.emailjs.com/admin');
      console.log('   → Look for any service incident notifications');
      console.log('   → If there\'s an active incident, wait for resolution');
      console.log('');
      console.log('🔧 IF NO INCIDENT: Reconnect Gmail');
      console.log('');
      console.log('Step 1: Go to EmailJS Dashboard');
      console.log('   → https://dashboard.emailjs.com/admin/services');
      console.log('');
      console.log('Step 2: Find Your Gmail Service');
      console.log('   → Look for service: service_zrcx11y');
      console.log('   → Click "Reconnect" or "Edit" button');
      console.log('');
      console.log('Step 3: Grant Gmail Permissions');
      console.log('   → Google popup will appear');
      console.log('   → ✅ Check "View your email address"');
      console.log('   → ✅ Check "Send email on your behalf" (IMPORTANT!)');
      console.log('   → Scroll down to see all permissions');
      console.log('   → Click "Allow"');
      console.log('');
      console.log('Step 4: Verify & Test');
      console.log('   → Status should show "Connected"');
      console.log('   → Wait a few minutes if there was a service incident');
      console.log('   → Try password reset again');
      console.log('');
      console.log('📖 Detailed Guide: See /FIX_GMAIL_PERMISSIONS.md');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('💡 TIPS:');
      console.log('   • EmailJS had a database capacity incident recently');
      console.log('   • Give it 10-15 minutes to fully recover');
      console.log('   • If you see "App not verified", click "Advanced" → "Go to EmailJS"');
      console.log('   • Make sure to grant ALL permissions Gmail asks for');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // Return failure - do NOT proceed with demo mode
    return {
      success: false,
      demoMode: false,
      error: error.status === 412 
        ? 'Email service temporarily unavailable. EmailJS may be recovering from a service incident. Please wait 10-15 minutes and try again, or check console for troubleshooting steps.'
        : `Failed to send email: ${error.text || error.message || 'Unknown error'}`,
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getEmailJSStatus(): {
  configured: boolean;
  publicKey: string;
  serviceId: string;
  templateId: string;
} {
  return {
    configured: isEmailServiceConfigured(),
    publicKey: EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ? 'Not set' : 'Configured',
    serviceId: EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ? 'Not set' : 'Configured',
    templateId: EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ? 'Not set' : 'Configured',
  };
}

export function testEmailJS(): void {
  console.log('🧪 EmailJS Configuration Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const status = getEmailJSStatus();
  
  console.log('Public Key:', status.publicKey);
  console.log('Service ID:', status.serviceId);
  console.log('Template ID:', status.templateId);
  console.log('Configured:', status.configured ? '✅ Yes' : '❌ No');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!status.configured) {
    console.log('');
    console.log('📖 Setup Instructions:');
    console.log('1. Sign up at https://www.emailjs.com/');
    console.log('2. Add an email service (Gmail, Outlook, etc.)');
    console.log('3. Create an email template');
    console.log('4. Copy your Public Key, Service ID, and Template ID');
    console.log('5. Update /src/app/services/emailServiceEmailJS.ts');
    console.log('');
    console.log('See /EMAILJS_SETUP_GUIDE.md for detailed instructions');
  }
}