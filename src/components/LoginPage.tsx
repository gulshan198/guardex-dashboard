import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Mail, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isValidDemoEmailLogin, isValidDemoPhone } from '@/lib/demoAuth';

const LoginPage = () => {
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('email');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ssoDialogOpen, setSsoDialogOpen] = useState(false);
  const [companyCode, setCompanyCode] = useState('');
  const [ssoUsername, setSsoUsername] = useState('');
  const [ssoPassword, setSsoPassword] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (loginMode === 'phone') {
      // Validate phone number format (basic validation)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneNumber) {
        toast.error('Please enter your phone number');
        return;
      }
      if (!phoneRegex.test(phoneNumber)) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }
      if (!isValidDemoPhone(phoneNumber)) {
        toast.error('Invalid phone number. Please try again.');
        return;
      }
    } else if (loginMode === 'email') {
      if (!email || !password) {
        toast.error('Please enter both email and password');
        return;
      }
      if (!isValidDemoEmailLogin(email, password)) {
        toast.error('Invalid email or password. Please try again.');
        return;
      }
    }

    // Store login info and navigate on success
    localStorage.setItem(
      'loginMode',
      JSON.stringify({ loginMode, email, phoneNumber })
    );
    toast.success('Login successful!');
    navigate('/operations');
  };
  const handleEmailLogin = () => {
    setLoginMode('email');
  };
  const handleSSOLogin = (provider: string) => {
    if (provider === 'SSO') {
      setSsoDialogOpen(true);
    } else {
      console.log(`${provider} login`);
    }
  };

  const handleSSOSubmit = () => {
    // Validate SSO form fields
    if (!companyCode.trim()) {
      toast.error('Company code is required');
      return;
    }
    if (companyCode.length < 2) {
      toast.error('Company code must be at least 2 characters long');
      return;
    }
    if (!ssoUsername.trim()) {
      toast.error('Username is required');
      return;
    }
    if (!ssoPassword) {
      toast.error('Password is required');
      return;
    }

    // For demo purposes, show success and navigate
    // In a real app, you would validate credentials with your backend here
    setSsoDialogOpen(false);
    toast.success('SSO login successful!');
    navigate('/operations');
  };
  return (
    <div className='h-screen flex overflow-hidden'>
      {/* Left Side - Hero */}
      <div className='w-1/2 relative'>
        <img
          src='/lovable-uploads/0aded6f3-93d4-4cff-b0b6-aab7b9cb706c.png'
          alt='AI-powered video insights for industrial excellence'
          className='w-full h-full object-cover'
          loading='eager'
          //   fetchpriority='high'
          decoding='async'
        />
      </div>

      {/* Right Side - Login */}
      <div className='w-1/2 bg-gray-100 flex flex-col'>
        {/* Login Form */}
        <div className='flex-1 flex items-center justify-center px-12'>
          <div className='w-full max-w-sm'>
            {/* Logo and Header */}
            <div className='text-center mb-6'>
              <img
                src='/lovable-uploads/9282bd0c-94d9-493d-960b-b9b4d7fe23b3.png'
                alt='Guardex Logo'
                className='h-28 mx-auto mb-4'
              />
              <h2 className='text-xl font-medium text-gray-700 mb-1'>
                Use your registered
              </h2>
              <p className='text-xl font-medium text-gray-700'>
                Email or Phone to login
              </p>
            </div>

            {loginMode === 'phone' && (
              <div className='space-y-4'>
                {/* Mobile Number */}
                <div>
                  <Label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Mobile Number
                  </Label>
                  <div className='flex gap-2'>
                    <Select defaultValue='+91'>
                      <SelectTrigger className='w-24 h-10 border-gray-300 rounded-md bg-white text-sm'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='+91'>🇮🇳 +91</SelectItem>
                        <SelectItem value='+1'>🇺🇸 +1</SelectItem>
                        <SelectItem value='+44'>🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type='tel'
                      placeholder='Enter Mobile Number'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className='flex-1 h-10 border-gray-300 rounded-md text-gray-700 bg-white placeholder:text-gray-400 text-sm'
                    />
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className='w-full h-10 bg-red-400 hover:bg-red-500 text-white font-medium rounded-md text-sm'
                >
                  Next
                </Button>

                {/* Email Login Button */}
                <Button
                  variant='outline'
                  onClick={handleEmailLogin}
                  className='w-full h-10 border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm'
                >
                  Login with Email
                </Button>
              </div>
            )}

            {loginMode === 'email' && (
              <div className='space-y-4'>
                {/* Email Input */}
                <div>
                  <Label className='text-base font-medium text-gray-700 mb-2 block'>
                    Email
                  </Label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      type='email'
                      placeholder='Enter Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='h-10 pl-10 border-gray-300 rounded-md bg-white placeholder:text-gray-400 text-base'
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <Label className='text-base font-medium text-gray-700 mb-2 block'>
                    Password
                  </Label>
                  <Input
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-10 border-gray-300 rounded-md bg-white placeholder:text-gray-400 text-base'
                  />
                  <div className='text-right mt-1'>
                    <a
                      href='#'
                      className='text-xs text-red-500 hover:underline'
                    >
                      Forget Password?
                    </a>
                  </div>
                </div>

                {/* SSO Options */}
                <div className='flex gap-3'>
                  <Button
                    onClick={() => handleSSOLogin('Google')}
                    variant='outline'
                    className='flex-1 h-10 justify-center border-gray-300 bg-white rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:shadow-sm'
                  >
                    <svg className='w-4 h-4' viewBox='0 0 24 24'>
                      <path
                        fill='#4285F4'
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                      />
                      <path
                        fill='#34A853'
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                      />
                      <path
                        fill='#FBBC05'
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                      />
                      <path
                        fill='#EA4335'
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                      />
                    </svg>
                    <span className='text-gray-700'>Google</span>
                  </Button>

                  <Button
                    onClick={() => handleSSOLogin('SSO')}
                    variant='outline'
                    className='flex-1 h-10 justify-center border-gray-300 bg-white rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:shadow-sm'
                  >
                    <Key className='w-4 h-4 text-gray-600' />
                    <span className='text-gray-700'>SSO</span>
                  </Button>
                </div>

                {/* Next Button */}
                <Button
                  onClick={handleNext}
                  className='w-full h-10 bg-red-400 hover:bg-red-500 text-white font-medium rounded-md text-sm'
                >
                  Next
                </Button>

                {/* Login with Phone Button */}
                <Button
                  variant='outline'
                  onClick={() => setLoginMode('phone')}
                  className='w-full h-10 border-gray-300 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 text-sm'
                >
                  Login with Phone
                </Button>
              </div>
            )}

            {/* Support */}
            <div className='text-center mt-6'>
              <p className='text-xs text-gray-600 mb-1'>
                Facing issues in login, please write to us at:
              </p>
              <a
                href='mailto:support@guardex.ai'
                className='text-xs text-red-500 hover:underline'
              >
                support@guardex.ai
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className='p-4'></div>
      </div>

      {/* SSO Dialog */}
      <Dialog open={ssoDialogOpen} onOpenChange={setSsoDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-semibold text-gray-800 text-center mb-6'>
              Sign in to your account
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Company Code */}
            <div>
              <Input
                type='text'
                placeholder='Company Code'
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                className='h-12 border-gray-300 rounded-lg bg-white placeholder:text-gray-500 text-base px-4'
              />
            </div>

            {/* Username */}
            <div>
              <Input
                type='text'
                placeholder='Username'
                value={ssoUsername}
                onChange={(e) => setSsoUsername(e.target.value)}
                className='h-12 border-gray-300 rounded-lg bg-white placeholder:text-gray-500 text-base px-4'
              />
            </div>

            {/* Password */}
            <div>
              <Input
                type='password'
                placeholder='Password'
                value={ssoPassword}
                onChange={(e) => setSsoPassword(e.target.value)}
                className='h-12 border-gray-300 rounded-lg bg-white placeholder:text-gray-500 text-base px-4'
              />
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSSOSubmit}
              className='w-full h-12 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg text-base mt-6'
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default LoginPage;
