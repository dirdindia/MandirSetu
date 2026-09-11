import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Settings, X, ChevronLeft, ChevronRight, Landmark, UserPlus, ChevronDown, FolderOpen, Hotel, Utensils, Home, UserCheck, LogOut, Lock, UserCircle, ShoppingCart, Package, Tags, Ticket, ShoppingBag, PieChart, Undo2, MessageSquare } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) {
  const location = useLocation();
  const navigate = useNavigate();
  // State to manage expanded accordion menus
  const [expandedMenus, setExpandedMenus] = useState({
    'Directories': false,
    'Onboarding': false,
    'E-Commerce': false
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef(null);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      setCanScrollDown(Math.ceil(scrollTop + clientHeight) < scrollHeight - 2); // 2px buffer
    }
  };

  useEffect(() => {
    // Small delay to allow DOM to update after menu expands
    const timer = setTimeout(checkScroll, 300);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [expandedMenus, isOpen, isCollapsed]);

  const userName = localStorage.getItem('user-name') || 'Staff User';
  const userEmail = localStorage.getItem('user-email') || 'staff@mandirsetu.com';

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-email');
    navigate('/login');
  };

  const toggleMenu = (menuName) => {
    if (isCollapsed) {
      toggleCollapse(); // Expand sidebar if trying to open a submenu while collapsed
    }
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { 
      name: 'E-Commerce', 
      icon: <ShoppingCart size={20} />, 
      subItems: [
        { name: 'Overview', path: '/ecommerce/overview', icon: <PieChart size={16} /> },
        { name: 'Products', path: '/ecommerce/products', icon: <Package size={16} /> },
        { name: 'Categories', path: '/ecommerce/categories', icon: <Tags size={16} /> },
        { name: 'Coupons', path: '/ecommerce/coupons', icon: <Ticket size={16} /> },
        { name: 'Orders', path: '/ecommerce/orders', icon: <ShoppingBag size={16} /> },
        { name: 'Customers', path: '/ecommerce/customers', icon: <Users size={16} /> },
        { name: 'Returns', path: '/ecommerce/returns', icon: <Undo2 size={16} /> },
        { name: 'Feedback', path: '/ecommerce/feedback', icon: <MessageSquare size={16} /> }
      ]
    },
    { 
      name: 'Directories', 
      icon: <FolderOpen size={20} />, 
      subItems: [
        
        { name: 'Hotels', path: '/directories/hotels', icon: <Hotel size={16} /> },
        { name: 'Restaurants', path: '/directories/restaurants', icon: <Utensils size={16} /> },
        { name: 'Ashrams', path: '/directories/ashrams', icon: <Home size={16} /> },
        
        
      ]
    },
    { 
      name: 'Onboarding', 
      icon: <UserPlus size={20} />, 
      subItems: [
        
        { name: 'Hotel', path: '/onboarding/hotel', icon: <Hotel size={16} /> },
        { name: 'Restaurant', path: '/onboarding/restaurant', icon: <Utensils size={16} /> },
        { name: 'Ashram', path: '/onboarding/ashram', icon: <Home size={16} /> },
       
      ]
    },
    { name: 'Group Bookings', icon: <CalendarDays size={20} />, path: '/group-bookings' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-maroon-darker/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 bg-premium dark:bg-slate-900 border-r border-gold/20 text-maroon-darker/70 transform transition-all duration-300 ease-in-out z-30 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-gold/20 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gold/30 p-1 flex items-center justify-center shadow-md shrink-0">
                <img src="/logo1.png" alt="dird" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-maroon truncate tracking-wide">
                STAFF PANEL
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white border border-gold/30 p-1 flex items-center justify-center shadow-md">
              <img src="/logo1.png" alt="dird" className="w-full h-full object-contain" />
            </div>
          )}
          
          <button onClick={toggleSidebar} className="lg:hidden text-maroon-darker/50 hover:text-maroon ml-2 cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Toggle Collapse Button (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-end p-2">
          <button 
            onClick={toggleCollapse} 
            className="p-1.5 rounded-lg bg-white border border-gold/20 hover:bg-gold/10 text-maroon-darker/50 hover:text-maroon transition-colors shadow-sm cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <nav 
            ref={navRef}
            onScroll={checkScroll}
            className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden hide-scrollbar"
          >
          {menuItems.map((item) => {
            // Check if any sub-item is active
            const isSubItemActive = item.subItems?.some(sub => location.pathname.startsWith(sub.path));
            
            if (item.subItems) {
              return (
                <div key={item.name} className="flex flex-col">
                  {/* Parent Menu Item */}
                  <button
                    onClick={() => toggleMenu(item.name)}
                    title={isCollapsed ? item.name : ''}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all cursor-pointer ${
                      isSubItemActive && !expandedMenus[item.name]
                        ? 'bg-gradient-to-r from-maroon/10 to-transparent text-maroon font-bold shadow-sm border border-maroon/10'
                        : 'hover:bg-gold/10 hover:text-maroon font-semibold text-maroon-darker/70'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={isCollapsed ? 'mx-auto' : ''}>
                        {item.icon}
                      </div>
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-300 ${expandedMenus[item.name] ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </button>

                  {/* Submenus */}
                  {(!isCollapsed && expandedMenus[item.name]) && (
                    <div className="flex flex-col mt-2 ml-6 pl-4 border-l-2 border-gold/20 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                              isActive 
                                ? 'bg-maroon/5 text-maroon font-bold' 
                                : 'text-maroon-darker/60 hover:bg-gold/5 hover:text-maroon font-semibold'
                            }`
                          }
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ''}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-maroon/10 to-transparent text-maroon font-bold shadow-sm border border-maroon/10' 
                      : 'hover:bg-gold/10 hover:text-maroon font-semibold text-maroon-darker/70'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                <div className={isCollapsed ? 'mx-auto' : ''}>
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
          </nav>
          {canScrollDown && !isCollapsed && (
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-center pb-2 bg-gradient-to-t from-premium to-transparent pointer-events-none z-10">
              <ChevronDown size={20} className="text-maroon-darker/40 animate-bounce drop-shadow-md" />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gold/20 relative">
          {userMenuOpen && !isCollapsed && (
            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border border-gold/20 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              <button onClick={() => { setUserMenuOpen(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-maroon-darker/70 hover:bg-gold/10 hover:text-maroon transition-colors cursor-pointer">
                <UserCircle size={16} /> Profile
              </button>
              <button onClick={() => { setUserMenuOpen(false); navigate('/settings'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-maroon-darker/70 hover:bg-gold/10 hover:text-maroon transition-colors border-t border-gold/10 cursor-pointer">
                <Lock size={16} /> Change Password
              </button>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gold/10 font-medium cursor-pointer">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          <div 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`rounded-xl flex items-center cursor-pointer transition-colors ${isCollapsed ? 'justify-center hover:bg-gold/10 p-2' : 'gap-3 bg-premium hover:bg-gold/10 p-3 border border-gold/20'}`}
          >
            <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-maroon-darker truncate">{userName}</p>
                <p className="text-xs text-maroon-darker/60 truncate">{userEmail}</p>
              </div>
            )}
            {!isCollapsed && <ChevronDown size={16} className={`text-maroon-darker/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />}
          </div>
        </div>
      </div>
    </>
  );
}
