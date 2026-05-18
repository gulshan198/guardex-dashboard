// import { useState, useEffect } from 'react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import {
//   BarChart2,
//   Video,
//   Shield,
//   FileText,
//   Bell,
//   Camera,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
//   Menu,
//   Factory,
//   Users,
//   Truck,
//   HardHat,
//   Eye,
//   LogOut,
// } from 'lucide-react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useIsMobile } from '@/hooks/use-mobile';

// interface SidebarItem {
//   name: string;
//   icon: React.ElementType;
//   route: string;
// }

// const sidebarItems: SidebarItem[] = [
//   {
//     name: 'Operations Dashboard',
//     icon: Factory,
//     route: '/operations',
//   },
//   {
//     name: 'Compliance Dashboard',
//     icon: HardHat,
//     route: '/compliance',
//   },
//   {
//     name: 'Security Dashboard',
//     icon: Shield,
//     route: '/security',
//   },
//   {
//     name: 'Reports & Analytics',
//     icon: FileText,
//     route: '/reports',
//   },
//   {
//     name: 'Alert Management',
//     icon: Bell,
//     route: '/alerts',
//   },
//   {
//     name: 'Camera Management',
//     icon: Camera,
//     route: '/cameras',
//   },
//   {
//     name: 'System Settings',
//     icon: Settings,
//     route: '/settings',
//   },
// ];

// export function Sidebar() {
//   const location = useLocation();
//   const isMobile = useIsMobile();
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const navigate = useNavigate();

//   // Set active item based on current route
//   const getActiveItemFromPath = (path: string) => {
//     if (path === '/operations') return 'Operations Dashboard';
//     if (path === '/compliance') return 'Compliance Dashboard';
//     if (path === '/security') return 'Security Dashboard';
//     if (path === '/reports') return 'Reports & Analytics';
//     if (path === '/alerts') return 'Alert Management';
//     if (path === '/cameras') return 'Camera Management';
//     if (path === '/settings') return 'System Settings';
//     return 'Operations Dashboard';
//   };
//   const [activeItem, setActiveItem] = useState(
//     getActiveItemFromPath(location.pathname)
//   );

//   // Update active item when route changes
//   useEffect(() => {
//     setActiveItem(getActiveItemFromPath(location.pathname));
//   }, [location.pathname]);

//   // Auto-collapse on mobile
//   useEffect(() => {
//     if (isMobile) {
//       setCollapsed(true);
//       setMobileOpen(false);
//     } else {
//       setCollapsed(false);
//     }
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setMobileOpen(!mobileOpen);
//     } else {
//       setCollapsed(!collapsed);
//     }
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {isMobile && mobileOpen && (
//         <div
//           className='fixed inset-0 bg-black/50 z-40'
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Mobile menu button */}
//       {isMobile && (
//         <Button
//           variant='ghost'
//           size='icon'
//           className='fixed top-4 left-4 z-50 lg:hidden'
//           onClick={toggleSidebar}
//         >
//           <Menu size={24} />
//         </Button>
//       )}

//       <div
//         className={cn(
//           'bg-white h-screen border-r border-gray-200 transition-all duration-300 flex flex-col z-50',
//           isMobile
//             ? mobileOpen
//               ? 'fixed left-0 w-[240px]'
//               : 'fixed -left-[240px] w-[240px]'
//             : collapsed
//             ? 'w-[70px]'
//             : 'w-[240px]'
//         )}
//       >
//         <div className='p-4 border-b border-gray-200 flex items-center justify-between py-0 px-0 mx-[8px]'>
//           {!collapsed && (
//             <div className='flex items-center gap-2'>
//               <img
//                 alt='Guardex'
//                 src='/lovable-uploads/51d1dccf-6614-4504-a42f-eda602f10158.png'
//                 className='h-20 w-full object-contain'
//               />
//             </div>
//           )}
//           {collapsed && (
//             <img
//               src='/lovable-uploads/51d1dccf-6614-4504-a42f-eda602f10158.png'
//               alt='Guardex'
//               className='h-10 mx-auto'
//             />
//           )}
//           <Button
//             variant='ghost'
//             size='icon'
//             className='ml-auto'
//             onClick={toggleSidebar}
//           >
//             {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
//           </Button>
//         </div>
//         <div className='flex-grow py-4 overflow-y-auto'>
//           <nav className='px-2 space-y-1'>
//             {sidebarItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.route}
//                 className={cn(
//                   'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
//                   activeItem === item.name
//                     ? 'bg-guardai-lightgray text-guardai-red'
//                     : 'text-gray-600 hover:bg-gray-100'
//                 )}
//                 onClick={() => {
//                   setActiveItem(item.name);
//                   if (isMobile) setMobileOpen(false);
//                 }}
//               >
//                 <item.icon
//                   size={20}
//                   className={
//                     activeItem === item.name
//                       ? 'text-guardai-red'
//                       : 'text-gray-500'
//                   }
//                 />
//                 {!collapsed && <span>{item.name}</span>}
//               </Link>
//             ))}
//             <Button
//               variant='outline'
//               className='w-full'
//               onClick={() => {
//                 localStorage.removeItem('loginMode');
//                 navigate('/');
//                 if (isMobile) setMobileOpen(false);
//               }}
//             >
//               <LogOut />
//               {<span>Logout</span>}
//             </Button>
//           </nav>
//         </div>
//       </div>
//     </>
//   );
// }
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart2,
  Video,
  Shield,
  FileText,
  Bell,
  Camera,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Factory,
  Users,
  Truck,
  HardHat,
  Eye,
  Bot,
  Box,
  Brush,
  MonitorPlay,
  LogOut,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItem {
  name: string;
  icon: React.ElementType;
  route: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Operations Dashboard',
    icon: Factory,
    route: '/operations',
  },
  {
    name: 'Compliance Dashboard',
    icon: HardHat,
    route: '/compliance',
  },
  {
    name: 'Security Dashboard',
    icon: Shield,
    route: '/security',
  },
  {
    name: 'Stock Management',
    icon: Box,
    route: '/stock',
  },
  {
    name: 'Cleanliness',
    icon: Brush,
    route: '/cleanliness',
  },
  {
    name: 'Reports & Analytics',
    icon: FileText,
    route: '/reports',
  },
  {
    name: 'Live Alert Console',
    icon: Bell,
    route: '/alerts',
  },
  {
    name: 'AI Video Assistant',
    icon: Bot,
    route: '/ai-assistant',
  },
  {
    name: 'Video Management',
    icon: MonitorPlay,
    route: '/vms',
  },
];

export function Sidebar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  // Set active item based on current route
  const getActiveItemFromPath = (path: string) => {
    if (path === '/operations') return 'Operations Dashboard';
    if (path === '/compliance') return 'Compliance Dashboard';
    if (path === '/security') return 'Security Dashboard';
    if (path === '/stock') return 'Stock Management';
    if (path === '/cleanliness') return 'Cleanliness';
    if (path === '/reports') return 'Reports & Analytics';
    if (path === '/alerts') return 'Live Alert Console';
    if (path === '/ai-assistant') return 'AI Video Assistant';
    if (path === '/vms') return 'Video Management';
    return 'Operations Dashboard';
  };
  const [activeItem, setActiveItem] = useState(
    getActiveItemFromPath(location.pathname)
  );

  // Update active item when route changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setMobileOpen(false);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40'
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant='ghost'
          size='icon'
          className='fixed top-4 left-4 z-50 lg:hidden'
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </Button>
      )}

      <div
        className={cn(
          'bg-white h-screen border-r border-gray-200 transition-all duration-300 flex flex-col z-50',
          isMobile
            ? mobileOpen
              ? 'fixed left-0 w-[240px]'
              : 'fixed -left-[240px] w-[240px]'
            : collapsed
            ? 'w-[70px]'
            : 'w-[240px]'
        )}
      >
        <div className='p-4 border-b border-gray-200 flex items-center justify-between py-0 px-0 mx-[8px]'>
          {!collapsed && (
            <div className='flex items-center gap-2'>
              <img
                alt='Guardex'
                src='/logo.png'
                className='h-20 w-full object-contain'
              />
            </div>
          )}
          {collapsed && (
            <img src='/logo.png' alt='Guardex' className='h-10 mx-auto' />
          )}
          <Button
            variant='ghost'
            size='icon'
            className='ml-auto'
            onClick={toggleSidebar}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <div className='flex-grow py-4 overflow-y-auto'>
          <nav className='px-2 space-y-1'>
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.route}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  activeItem === item.name
                    ? 'bg-guardai-lightgray text-guardai-red'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
                onClick={() => {
                  setActiveItem(item.name);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <item.icon
                  size={20}
                  className={
                    activeItem === item.name
                      ? 'text-guardai-red'
                      : 'text-gray-500'
                  }
                />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                localStorage.removeItem('loginMode');
                sessionStorage.removeItem('demoDialogDismissed');
                navigate('/');
                if (isMobile) setMobileOpen(false);
              }}
            >
              <LogOut />
              {<span>Logout</span>}
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
}
