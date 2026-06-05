import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Settings, X, ChevronLeft, ChevronRight, Landmark, UserPlus, List, ChevronDown, FolderOpen } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }) {
  const location = useLocation();
  // State to manage expanded accordion menus
  const [expandedMenus, setExpandedMenus] = useState({
    'Directories': true,
    'Onboarding': true
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
      name: 'Directories', 
      icon: <FolderOpen size={20} />, 
      subItems: [
        { name: 'Mandirs List', path: '/mandirs', icon: <Landmark size={16} /> },
        { name: 'Staff List', path: '/staff', icon: <Users size={16} /> }
      ]
    },
    { 
      name: 'Onboarding', 
      icon: <UserPlus size={20} />, 
      subItems: [
        { name: 'Onboard Mandir', path: '/onboard-mandir', icon: <Landmark size={16} /> },
        { name: 'Hire Staff', path: '/hire-staff', icon: <Users size={16} /> }
      ]
    },
    { name: 'Bookings', icon: <CalendarDays size={20} />, path: '/bookings' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transform transition-all duration-300 ease-in-out z-30 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30 shrink-0">
                <Landmark size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent truncate tracking-wide">
                MANDIRSETU
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Landmark size={20} strokeWidth={2.5} />
            </div>
          )}
          
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600 ml-2">
            <X size={24} />
          </button>
        </div>

        {/* Toggle Collapse Button (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-end p-2">
          <button 
            onClick={toggleCollapse} 
            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
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
                    className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all ${
                      isSubItemActive && !expandedMenus[item.name]
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-bold shadow-sm'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium text-slate-600 dark:text-slate-400'
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
                    <div className="flex flex-col mt-1 ml-4 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1 animate-in slide-in-from-top-2 fade-in duration-200">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                              isActive 
                                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-bold' 
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
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
                  `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-bold shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium text-slate-600 dark:text-slate-400'
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

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className={`rounded-xl flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-800'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
              A
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">Admin User</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@gmail.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
