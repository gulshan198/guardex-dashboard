import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import OperationsPage from './pages/operations/OperationsPage';
import CompliancePage from './pages/compliance/CompliancePage';
import SecurityPage from './pages/security/SecurityPage';
import ReportsPage from './pages/reports/ReportsPage';
import AlertsPage from './pages/alerts/AlertsPage';
import AIAssistantPage from './pages/ai-assistant/AIAssistantPage';
import CamerasPage from './pages/cameras/CamerasPage';
import SettingsPage from './pages/settings/SettingsPage';
import StockPage from './pages/stock/StockPage';
import CleanlinessPage from './pages/cleanliness/CleanlinessPage';
import VmsPage from './pages/vms/VmsPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route element={<Layout />}>
            <Route path='/operations' element={<OperationsPage />} />
            <Route path='/compliance' element={<CompliancePage />} />
            <Route path='/security' element={<SecurityPage />} />
            <Route path='/stock' element={<StockPage />} />
            <Route path='/cleanliness' element={<CleanlinessPage />} />
            <Route path='/reports' element={<ReportsPage />} />
            <Route path='/alerts' element={<AlertsPage />} />
            <Route path='/ai-assistant' element={<AIAssistantPage />} />
            <Route path='/vms' element={<VmsPage />} />
            <Route path='/cameras' element={<CamerasPage />} />
            <Route path='/settings' element={<SettingsPage />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
