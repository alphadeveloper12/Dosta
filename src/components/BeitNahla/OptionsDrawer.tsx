import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MealBoxType } from "./BeitNahlaCard";

export interface OptionItem {
 id: number;
 name: string;
 description: string;
 image_url: string | null;
 display_order: number;
}

export interface OptionCategory {
 id: number;
 name: string;
 description: string;
 display_order: number;
 items: OptionItem[];
}

interface OptionsDrawerProps {
 open: boolean;
 mealBox: MealBoxType | null;
 categories: OptionCategory[];
 initialSelections?: Record<number, number[]>;
 onClose: () => void;
 onConfirm: (selections: Record<number, number[]>) => void;
}

const OptionsDrawer: React.FC<OptionsDrawerProps> = ({
 open,
 mealBox,
 categories,
 initialSelections,
 onClose,
 onConfirm,
}) => {
 const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
 const [selections, setSelections] = useState<Record<number, number[]>>({});

 // Default: every item in every category is selected. Users can toggle off
 // individuals, but each category must keep at least one.
 const buildDefaults = (): Record<number, number[]> => {
  const map: Record<number, number[]> = {};
  categories.forEach((c) => {
   map[c.id] = c.items.map((i) => i.id);
  });
  return map;
 };

 React.useEffect(() => {
  if (open) {
   setSelections(
    initialSelections && Object.keys(initialSelections).length > 0
     ? initialSelections
     : buildDefaults(),
   );
   setActiveCategoryId(null);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [open, mealBox?.id, categories]);

 const activeCategory = useMemo(
  () => categories.find((c) => c.id === activeCategoryId) || null,
  [activeCategoryId, categories],
 );

 const totalSelected = useMemo(
  () => Object.values(selections).reduce((s, arr) => s + arr.length, 0),
  [selections],
 );

 const categoriesWithSelections = useMemo(
  () =>
   categories.filter((c) => (selections[c.id] || []).length > 0).length,
  [categories, selections],
 );

 // Names of categories that have at least one item but zero selections —
 // user must pick at least one per category to confirm.
 const emptyCategories = useMemo(
  () =>
   categories
    .filter(
     (c) => c.items.length > 0 && (selections[c.id] || []).length === 0,
    )
    .map((c) => c.name),
  [categories, selections],
 );

 const toggleItem = (categoryId: number, itemId: number) => {
  setSelections((prev) => {
   const current = prev[categoryId] || [];
   const next = current.includes(itemId)
    ? current.filter((i) => i !== itemId)
    : [...current, itemId];
   return { ...prev, [categoryId]: next };
  });
 };

 const canConfirm = emptyCategories.length === 0 && totalSelected > 0;

 if (!mealBox) return null;

 return (
  <AnimatePresence>
   {open && (
    <motion.div
     className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-sm"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     onClick={onClose}>
     <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      data-lenis-prevent="true"
      className="bg-white w-full md:px-8 md:py-4 px-4 py-6 max-w-[500px] h-full shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 md:pb-4 border-b border-gray-100 mb-4">
       <div className="flex items-center gap-2 flex-1 min-w-0">
        {activeCategory && (
         <button
          onClick={() => setActiveCategoryId(null)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
          <ChevronLeft className="w-5 h-5 text-[#054A86]" />
         </button>
        )}
        <div className="flex-1 min-w-0">
         <h2 className="text-[20px] md:text-[24px] leading-tight font-[700] text-[#2B2B43] truncate">
          {activeCategory ? activeCategory.name : mealBox.name}
         </h2>
         <p className="text-[12px] text-[#83859C] truncate">
          {activeCategory
           ? "Pick at least one"
           : `${categoriesWithSelections}/${categories.length} categories chosen`}
         </p>
        </div>
       </div>
       <button
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0">
        <X className="w-5 h-5 text-gray-500" />
       </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pr-1">
       {activeCategory === null ? (
        <div className="flex flex-col gap-3">
         {categories.map((cat) => {
          const count = (selections[cat.id] || []).length;
          const isEmpty = cat.items.length > 0 && count === 0;
          return (
           <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-[14px] border transition-all group ${
             isEmpty
              ? "border-red-300 bg-red-50/40 hover:border-red-400"
              : "border-[#EDEEF2] hover:border-[#054A86] hover:bg-[#054A86]/5"
            }`}>
            <div className="flex flex-col items-start gap-0.5 text-left flex-1 min-w-0">
             <span className="text-[15px] md:text-[16px] font-[700] text-[#2B2B43]">
              {cat.name}
             </span>
             {cat.description && (
              <span className="text-[11px] text-[#83859C] line-clamp-1">
               {cat.description}
              </span>
             )}
             {isEmpty ? (
              <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
               <AlertCircle className="w-3 h-3" /> Pick at least one
              </span>
             ) : (
              <span className="text-[11px] font-bold text-[#054A86] mt-1">
               {count} of {cat.items.length} selected
              </span>
             )}
            </div>
            <ChevronRight className="w-5 h-5 text-[#83859C] group-hover:text-[#054A86] flex-shrink-0" />
           </button>
          );
         })}
         {categories.length === 0 && (
          <div className="text-center py-12 text-[#83859C]">
           No option categories available.
          </div>
         )}
        </div>
       ) : (
        <div className="flex flex-col gap-2">
         {(selections[activeCategory.id] || []).length === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 mb-1">
           <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
           <span className="text-[12px] text-red-600 font-bold">
            Pick at least one {activeCategory.name.toLowerCase()} item.
           </span>
          </div>
         )}
         {activeCategory.items.map((item) => {
          const isSelected = (
           selections[activeCategory.id] || []
          ).includes(item.id);
          return (
           <div
            key={item.id}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-[12px] border-2 transition-all ${
             isSelected
              ? "border-[#054A86] bg-[#054A86]/5"
              : "border-[#EDEEF2]"
            }`}>
            <label
             htmlFor={`opt-${activeCategory.id}-${item.id}`}
             className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
             {item.image_url && (
              <img
               src={item.image_url}
               alt={item.name}
               className="w-12 h-12 rounded-[8px] object-cover flex-shrink-0"
              />
             )}
             <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[14px] font-[700] text-[#2B2B43] truncate">
               {item.name}
              </span>
              {item.description && (
               <span className="text-[11px] text-[#83859C] line-clamp-1">
                {item.description}
               </span>
              )}
             </div>
            </label>
            <Switch
             id={`opt-${activeCategory.id}-${item.id}`}
             checked={isSelected}
             onCheckedChange={() => toggleItem(activeCategory.id, item.id)}
             className="data-[state=checked]:bg-[#054A86] data-[state=unchecked]:bg-[#C7C8D2] ml-3 flex-shrink-0"
            />
           </div>
          );
         })}
         {activeCategory.items.length === 0 && (
          <div className="text-center py-12 text-[#83859C]">
           No items in this category.
          </div>
         )}
        </div>
       )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row gap-3 md:pb-6">
       <button
        onClick={onClose}
        className="w-full sm:w-1/3 border-2 border-[#EBEBEB] text-[#545563] hover:border-[#054A86] hover:text-[#054A86] rounded-xl py-3 font-bold transition-colors">
        Cancel
       </button>
       <button
        onClick={() => canConfirm && onConfirm(selections)}
        disabled={!canConfirm}
        title={
         emptyCategories.length > 0
          ? `Pick at least one item in: ${emptyCategories.join(", ")}`
          : ""
        }
        className={`w-full sm:flex-1 rounded-xl py-3 font-bold shadow-lg transition-transform active:scale-95 ${
         canConfirm
          ? "bg-[#054A86] text-white hover:bg-[#054A86]/90 shadow-[#054A86]/20"
          : "bg-[#C7C8D2] text-white cursor-not-allowed shadow-none"
        }`}>
        {emptyCategories.length > 0
         ? `Need ${emptyCategories.length} more — ${emptyCategories.join(", ")}`
         : `Confirm (${totalSelected} item${totalSelected === 1 ? "" : "s"})`}
       </button>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default OptionsDrawer;
