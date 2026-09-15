import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Settings, X, ChevronLeft, ChevronRight, Landmark, UserPlus, List, ChevronDown, FolderOpen, ShoppingCart, Package, Tags, Ticket, ShoppingBag, PieChart, Undo2, MessageSquare } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) {
  const location = useLocation();
  // State to manage expanded accordion menus
  const [expandedMenus, setExpandedMenus] = useState({
    'Directories': false,
    'Onboarding': false,
    'E-Commerce': false
  });

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
        { name: 'Mandirs List', path: '/mandirs', icon: <Landmark size={16} /> },
        { name: 'Dhams List', path: '/dhams', icon: <Landmark size={16} /> },
        { name: 'Sevadar List', path: '/staff', icon: <Users size={16} /> },
        { name: 'Sevadar Requests', path: '/sevadar-requests', icon: <UserPlus size={16} /> },
        { name: 'Events List', path: '/events', icon: <CalendarDays size={16} /> }
      ]
    },
    { 
      name: 'Onboarding', 
      icon: <UserPlus size={20} />, 
      subItems: [
        { name: 'Onboard Mandir', path: '/onboard-mandir', icon: <Landmark size={16} /> },
        { name: 'Onboard Dham', path: '/onboard-dham', icon: <Landmark size={16} /> },
        { name: 'Hire Staff', path: '/hire-staff', icon: <Users size={16} /> },
        { name: 'Create Event', path: '/create-event', icon: <CalendarDays size={16} /> }
      ]
    },
    { name: 'Bookings', icon: <CalendarDays size={20} />, path: '/bookings' },
    { name: 'Group Bookings', icon: <Users size={20} />, path: '/group-bookings' },
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
        className={`fixed lg:static inset-y-0 left-0 bg-premium border-r border-gold/20 text-maroon-darker/70 transform transition-all duration-300 ease-in-out z-30 flex flex-col font-sans
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-gold/20 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-gold/30 flex items-center justify-center shadow-sm p-1 shrink-0">
                <img src="/logo1.png" alt="MandirSetu Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-serif font-black text-maroon truncate tracking-widest uppercase">
                MANDIRSETU
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white border border-gold/30 flex items-center justify-center shadow-sm p-1 shrink-0">
              <img src="/logo1.png" alt="MandirSetu Logo" className="w-full h-full object-contain" />
            </div>
          )}
          
          <button onClick={toggleSidebar} className="lg:hidden text-maroon-darker/50 hover:text-maroon ml-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Toggle Collapse Button (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-end p-3">
          <button 
            onClick={toggleCollapse} 
            className="p-1.5 rounded-lg bg-white border border-gold/20 hover:bg-gold/10 text-maroon-darker/50 hover:text-maroon transition-all shadow-sm"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
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
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
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
                        className={`transition-transform duration-300 ${expandedMenus[item.name] ? 'rotate-180 text-gold' : ''}`} 
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

        <div className="p-4 border-t border-gold/20">
          <div className={`rounded-xl flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-3 bg-white p-3 border border-gold/20 shadow-sm'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon to-[#4a0f0d] flex items-center justify-center text-premium font-serif font-bold shrink-0 shadow-inner">
              A
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-maroon truncate font-serif">Admin User</p>
                <p className="text-xs text-maroon-darker/50 truncate font-semibold">admin@mandirsetu.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
