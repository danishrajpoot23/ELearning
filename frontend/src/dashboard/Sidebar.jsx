import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaBookOpen, 
  FaFileAlt, 
  FaChartBar, 
  FaSignOutAlt, 
  FaUserCircle,
  FaTachometerAlt,
} from 'react-icons/fa';

const Sidebar = ({ collapsed, onLogout }) => {
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/users', icon: FaUsers, label: 'Users' },
    { path: '/admin/courses', icon: FaBookOpen, label: 'Courses' },
    { path: '/admin/tests', icon: FaFileAlt, label: 'Tests' },
    { path: '/admin/results', icon: FaChartBar, label: 'Results' },
    { path: '/admin/subscriptions', icon: FaFileAlt, label: 'Subscriptions' }, // Only this item for subscriptions
  ];

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e40af] 
      text-white transition-all duration-300 ${collapsed ? 'w-20' : 'w-60'}`}
    >
      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-between">
        <nav className="flex flex-col mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 mb-1 rounded transition-colors duration-200 
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>

                {/* Tooltip */}
                {collapsed && (
                  <span
                    className="absolute left-14 top-1/2 -translate-y-1/2 
                    px-2 py-1 text-sm rounded bg-gray-900 text-white opacity-0 
                    group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50"
                  >
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer / User Info */}
        <div className="p-4 border-t border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <FaUserCircle size={20} />
              </div>
              <div className="flex flex-col">
                <p className="font-bold">{adminUser.username || 'Admin'}</p>
                <p className="text-sm text-gray-400">Administrator</p>
              </div>
            </div>
          )}

          <div className="relative group">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-gray-400 rounded hover:bg-gray-700 hover:text-white transition-colors"
            >
              <FaSignOutAlt size={20} />
              {!collapsed && <span>Logout</span>}
            </button>

            {/* Tooltip for Logout */}
            {collapsed && (
              <span
                className="absolute left-14 top-1/2 -translate-y-1/2 
                px-2 py-1 text-sm rounded bg-gray-900 text-white opacity-0 
                group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 z-50"
              >
                Logout
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;