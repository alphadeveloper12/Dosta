// src/components/catering/BudgetSelection.tsx
import React from "react";
import { Button } from "../ui/button";

interface BudgetSelectionProps {
 selectedBudget: string | null;
 setSelectedBudget: React.Dispatch<React.SetStateAction<string | null>>;
 budgetOptions: { id: string; title: string; price: string }[];
 handleGoBack: () => void;
 handleContinue: () => void;
}

const BudgetSelection: React.FC<BudgetSelectionProps> = ({
 selectedBudget,
 setSelectedBudget,
 budgetOptions,
 handleGoBack,
 handleContinue,
}) => {
 return (
  <div
   className="bg-neutral-white border rounded-2xl p-6 md:px-6 md:py-5"
   style={{ border: "1px solid #EDEEF2" }}>
   <div className="flex items-center mb-6 gap-4">
    <div
     className="w-10 h-10 rounded-full flex items-center justify-center"
     style={{ backgroundColor: "hsl(var(--primary))" }}>
     <span className="text-primary-foreground font-bold">6</span>
    </div>
    <h2 className="text-primary-text text-2xl font-bold">
     What's the Budget you have in Mind?
    </h2>
   </div>

   <div className="ml-12">
    <div className="grid md:grid-cols-4 gap-6 max-w-5xl">
     {budgetOptions.map((budget) => (
      <Button
       key={budget.id}
       onClick={() => setSelectedBudget(budget.id)}
       style={{
        fontSize: "16px",
        height: "80px",
        backgroundColor: selectedBudget === budget.id ? "#EAF5FF" : "#fff",
        color: "#2B2B43",
        fontWeight: "400",
        borderRadius: "16px",
        padding: "16px",
        width: "245px",
        border:
         selectedBudget === budget.id
          ? "1px solid #054A86"
          : "1px solid #C7C8D2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
       }}>
       <span style={{ fontWeight: "400", fontSize: "16px" }}>
        {budget.title}
       </span>
       <span style={{ fontWeight: "400", fontSize: "16px" }}>
        {budget.price}
       </span>
      </Button>
     ))}
    </div>
   </div>

   <div className="flex justify-between mt-8">
    <Button
     onClick={handleGoBack}
     style={{
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "700",
      color: "#054A86",
      border: "1px solid #054A86",
      backgroundColor: "#fff",
     }}>
     Go Back
    </Button>
    <Button
     onClick={handleContinue}
     disabled={!selectedBudget}
     className={`bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70 ${
      !selectedBudget ? "cursor-not-allowed" : ""
     }`}
     style={{
      padding: "12px 24px",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0px 8px 20px 0px #4E60FF29",
     }}>
     Continue
    </Button>
   </div>
  </div>
 );
};

export default BudgetSelection;
