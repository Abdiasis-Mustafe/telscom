// import React from 'react'
// import {
//     Sheet,
//     SheetContent,
//     SheetDescription,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
//   } from "@/components/ui/sheet"
// import { RiMenu2Fill } from 'react-icons/ri'
  

// const SHEET_SIDES = ["top", "left"] as const
 
// type SheetSide = (typeof SHEET_SIDES)[number]

// function SideParsm() {
//   return (
//     <div>
//            {SHEET_SIDES.map((side) => ( 

//                <Sheet key={side}>
//     <SheetTrigger><RiMenu2Fill/></SheetTrigger>
//     <SheetContent key={side} className="w-[400px] sm:w-[540px] bg-white">
//       <SheetHeader>
//         <SheetTitle>Are you absolutely sure?</SheetTitle>
//         <SheetDescription>
//           This action cannot be undone. This will permanently delete your account
//           and remove your data from our servers.
//         </SheetDescription>
//       </SheetHeader>
//     </SheetContent>
//   </Sheet>
//         ))}
//   </div>
//   )
// }

// export default SideParsm

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { RiMenuFold2Fill } from 'react-icons/ri';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaHotel, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { links } from '../components/ui/Yumm';
import { useStateContext } from './ui/ContextProvider';

const SHEET_SIDES = ['left', 'top'] as const;
type SheetSide = (typeof SHEET_SIDES)[number];

const SideParsm = () => {
  const [selectedSide] = useState<SheetSide>('left');
  const { currentColor, activeMenu, setActiveMenu, screenSize } = useStateContext();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') document.body.classList.add('DarkSide');
    else document.body.classList.remove('DarkSide');
  }, []);

  const handleCloseSideBar = () => {
    if (activeMenu && screenSize! <= 1024) setActiveMenu(false);
  };

  const activeLink = `flex items-center gap-4 pl-4 py-3 rounded-xl text-white font-medium 
    mx-2 bg-gradient-to-r from-[#605bff] to-[#3a3799] shadow-lg shadow-[#605bff]/30 
    transform transition-transform duration-200 scale-[1.02] relative overflow-hidden`;

  const normalLink = `flex items-center gap-4 pl-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 
    font-medium hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 
    mx-2 transition-all duration-200 ease-in-out relative overflow-hidden`;

  const linkMotion = {
    hover: { scale: 1.05, x: 5 },
    tap: { scale: 0.95 },
  };

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          <div className="text-2xl cursor-pointer dark:text-white p-2 hover:text-[#605bff] transition-all">
            <RiMenuFold2Fill />
          </div>
        </SheetTrigger>
        <SheetContent side={selectedSide} className="w-[280px] border-none p-0">
          <div
            className={`h-screen bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-800
              backdrop-blur-lg shadow-2xl relative`}
            style={{ width: isHovered ? '300px' : '280px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <Link
                to="/"
                onClick={handleCloseSideBar}
                className="flex items-center gap-3 text-xl font-bold dark:text-white text-gray-900"
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#605bff] to-[#3a3799] flex items-center justify-center shadow-xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 5 }}
                >
                  <FaHotel className="text-white text-lg" />
                </motion.div>
                <span>telesom Company</span>
              </Link>
            </div>

            {/* Menu Links */}
            <div className="mt-10 overflow-y-auto h-[calc(100%-80px)] custom-scrollbar px-2">
              {links.map((item) => (
                <div key={item.title}>
                  <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase text-xs font-semibold tracking-wider">
                    {item.title}
                  </p>
                  {item.links.map((link) => {
                    const isActive = location.pathname === `/Dashboard/${link.name}`;
                    return (
                      <motion.div
                        key={link.name}
                        whileHover={linkMotion.hover}
                        whileTap={linkMotion.tap}
                      >
                        <NavLink
                          to={`/Dashboard/${link.name}`}
                          onClick={handleCloseSideBar}
                          className={({ isActive }) => (isActive ? activeLink : normalLink)}
                          style={{ backgroundColor: isActive ? currentColor : '' }}
                        >
                          <div className="text-lg text-gray-600 dark:text-gray-400 group-hover:text-[#605bff]">
                            {link.icon}
                          </div>
                          <span className="capitalize flex-1">{link.name}</span>
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-1/2 w-1 h-8 bg-gradient-to-b from-[#605bff] to-[#3a3799] rounded-r-full"
                              layoutId="activeIndicator"
                            />
                          )}
                          <motion.div className="opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <FaChevronRight className="text-xs text-gray-400" />
                          </motion.div>
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #605bff, #3a3799); border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #4a45d5, #2a2777); 
        }
        .DarkSide .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #605bff, #8b87ff);
        }
      `}</style>
    </div>
  );
};

export default SideParsm;
