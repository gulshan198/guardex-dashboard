import { Sidebar } from './Sidebar';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { DashboardAlertsProvider } from '@/contexts/DashboardAlertsContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export function Layout() {
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const loginMode = localStorage.getItem('loginMode');
  const isLoginPage = location.pathname === '/';

  // Handle redirect for unauthenticated users
  useEffect(() => {
    // Only redirect if we're not already on the home page
    if (!loginMode && location.pathname !== '/') {
      setShouldRedirect(true);
    }
  }, [location.pathname, loginMode]);

  // Show dialog after successful login
  useEffect(() => {
    if (loginMode && !isLoginPage) {
      // Only show if not previously dismissed
      const dialogDismissed = sessionStorage.getItem('demoDialogDismissed');
      if (!dialogDismissed) {
        setShowDemoDialog(true);
      }
    }
  }, [loginMode, isLoginPage]);

  if (shouldRedirect) {
    return <Navigate to='/' replace />;
  }

  const handleCloseDialog = () => {
    setShowDemoDialog(false);
    // Remember that user dismissed the dialog for this session
    sessionStorage.setItem('demoDialogDismissed', 'true');
  };

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {!isLoginPage && <Sidebar />}
      <main className='relative min-h-0 flex-1 overflow-auto pt-0 md:pt-0'>
        <DashboardAlertsProvider>
          <Outlet />
        </DashboardAlertsProvider>
        
        {/* Demo Notice Dialog */}
        {showDemoDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
              <button
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-6 w-6 text-yellow-500" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Demo Notice</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      This is a demo dashboard. Actual factory data is confidential, so the visuals shown are for illustration only.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      type="button"
                      className="w-full justify-center bg-red-400 hover:bg-red-500"
                      onClick={handleCloseDialog}
                    >
                      I understand
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
