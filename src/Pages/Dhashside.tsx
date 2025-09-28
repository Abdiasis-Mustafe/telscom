import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { FaChevronRight, FaHotel } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { links } from '../components/ui/Yumm';
import { useStateContext } from '../components/ui/ContextProvider';
import { AppDispatch, RootState } from '@/Redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { getOneCompanayFN } from '@/Redux/Slice/GetOneCompanaySlice';

const DhashSide = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();
  const dispatch = useDispatch<AppDispatch>();
  const GetOneCompanayState = useSelector((state: RootState) => state.GetOneCompanay);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => { dispatch(getOneCompanayFN()); }, [dispatch]);

  const handleCloseSideBar = () => { if (activeMenu && screenSize! <= 1020) setActiveMenu(false); };

  // Default brand color, fallback if company doesn't provide one
  const brandColor = '#605bff';
  const secondaryColor = '#3a3799';

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    closed: { x: -320, opacity: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {activeMenu && screenSize! <= 1020 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleCloseSideBar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed md:relative h-screen z-50  shadow-2xl 
          backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50`}
        style={{
          width: isHovered ? '300px' : '260px',
          minWidth: '260px',
          background: `linear-gradient(to bottom, #fdfbfb, #ebedee)`,
        }}
        variants={sidebarVariants}
        initial="closed"
        animate={activeMenu ? 'open' : 'closed'}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-xl flex items-center justify-center shadow-xl"
                style={{ background: `linear-gradient(135deg, ${brandColor}, ${secondaryColor})` }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
              >
                <FaHotel className="text-white text-xl" />
              </motion.div>
              <motion.div
                className="absolute -inset-1 rounded-xl blur opacity-30"
                style={{ background: `radial-gradient(circle, ${brandColor} 0%, ${secondaryColor} 100%)` }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                {GetOneCompanayState.data.company_name || 'Company Name'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setActiveMenu(!activeMenu)}
            className="text-xl rounded-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hidden md:block"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
          >
            <MdOutlineCancel />
          </motion.button>
        </div>

        {/* Menu */}
        <div className="mt-8 px-4 h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
          {links.map((item) => (
            <motion.div key={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center justify-between w-full p-3 rounded-xl text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider group transition-all duration-200">
                <span>{item.title}</span>
              </div>
              <div className="overflow-hidden">
                {item.links.map((link) => {
                  const isActive = location.pathname === `/Dashboard/${link.name}`;
                  return (
                    <motion.div key={link.name} whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 300 }}>
                      <NavLink
                        to={`/Dashboard/${link.name}`}
                        onClick={handleCloseSideBar}
                        className={({ isActive }) =>
                          isActive
                            ? `flex items-center gap-4 pl-4 py-3 rounded-xl text-white font-medium mx-2 
                               bg-gradient-to-r from-[${brandColor}] to-[${secondaryColor}] shadow-lg shadow-[${brandColor}]/40 
                               transform transition-transform duration-200 scale-[1.02] relative overflow-hidden`
                            : `flex items-center gap-4 pl-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 
                               font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 
                               mx-2 transition-all duration-200 ease-in-out group relative overflow-hidden`
                        }
                      >
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full"
                            style={{ background: `linear-gradient(to bottom, ${brandColor}, ${secondaryColor})` }}
                            layoutId="activeIndicator"
                          />
                        )}
                        <motion.div
                          className="text-lg text-gray-600 dark:text-gray-400 group-hover:text-[#605bff] dark:group-hover:text-[#605bff]"
                          whileHover={{ scale: 1.2 }}
                        >
                          {link.icon}
                        </motion.div>
                        <span className="font-medium capitalize flex-1">{link.name}</span>
                        <motion.div className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                          <FaChevronRight className="text-xs text-gray-400" />
                        </motion.div>
                      </NavLink>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-gray-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        ></motion.div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, ${brandColor}, ${secondaryColor}); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, darken(${brandColor},20%), darken(${secondaryColor},20%)); 
        }
        .dark-theme .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, ${brandColor}, ${secondaryColor});
        }
      `}</style>
    </>
  );
};

export default DhashSide;
