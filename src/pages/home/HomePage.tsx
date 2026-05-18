import LoginPage from '@/components/LoginPage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const loginMode = localStorage.getItem('loginMode');
    // Redirect to operations dashboard
    if (loginMode) {
      navigate('/operations');
    }
  }, [navigate]);

  return (
    <>
      {/* <div className='flex flex-col items-center justify-center min-h-screen p-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 mb-4'>
            Redirecting to Operations Dashboard...
          </h1>
        </div>
      </div> */}
      <LoginPage />
    </>
  );
}