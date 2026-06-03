import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone } from "lucide-react";

interface DownloadAppModalProps {
 isOpen: boolean;
 onClose: () => void;
}

const DownloadAppModal: React.FC<DownloadAppModalProps> = ({
 isOpen,
 onClose,
}) => {
 const appBadges = [
  {
   src: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
   alt: "Download on App Store",
   link: "https://apps.apple.com/us/app/dosta-kitchen/id6760654080",
   label: "iOS Version",
  },
  {
   src: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
   alt: "Get it on Google Play",
   link: "https://play.google.com/store/apps/details?id=com.dosta.app",
   label: "Android Version",
  },
 ];

 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}>
     {/* Backdrop */}
     <motion.div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
     />

     {/* Modal Container */}
     <motion.div
      className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[420px] mx-auto overflow-hidden border border-gray-100"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}>
      
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-[#054A86] to-[#0768B8] p-6 pb-8 text-white text-center relative">
       <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
        <X className="w-4 h-4 text-white" />
       </button>
       <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3 animate-pulse">
        <Smartphone className="w-7 h-7 text-white" />
       </div>
       <h2 className="text-[22px] font-[800] leading-tight mb-1">
        Get the Dosta App
       </h2>
       <p className="text-[14px] text-white/80 font-[400]">
        Manage your deliveries from anywhere, anytime
       </p>
      </div>

      {/* Body */}
      <div className="p-6 -mt-4 bg-white rounded-t-[24px] relative">
       <p className="text-[15px] text-[#545563] font-[500] text-center leading-[22px] mb-6">
        Download the app today to get chef-prepared meals, live tracking, and unlock exclusive discounts.
       </p>

       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {appBadges.map((badge, idx) => (
         <a
          key={idx}
          href={badge.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-4 rounded-xl border border-[#EDEEF2] bg-[#FAFAFD] hover:bg-[#F0F4F8] hover:border-[#054A86]/30 transition-all duration-200 group active:scale-98">
          <span className="text-[11px] font-bold text-[#83859C] mb-2 uppercase tracking-wide group-hover:text-[#054A86] transition-colors">
           {badge.label}
          </span>
          <img
           src={badge.src}
           alt={badge.alt}
           className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
          />
         </a>
        ))}
       </div>

       <p className="text-center text-[12px] text-[#83859C] mt-6">
        Available free on both Google Play and Apple App Store
       </p>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default DownloadAppModal;
