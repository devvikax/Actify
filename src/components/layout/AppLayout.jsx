import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AppLayout.css';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const location = useLocation();
   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
   const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="app-main">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="app-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
    </div>
  );
}
