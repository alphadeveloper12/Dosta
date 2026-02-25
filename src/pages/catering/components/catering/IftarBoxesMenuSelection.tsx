import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import LazyLoad from "@/components/ui/LazyLoad";
import Shrimmer from "@/components/ui/Shrimmer";
import ImageWithShimmer from "@/components/ui/ImageWithShimmer";

interface IftarBoxesMenuSelectionProps {
 selectedServiceStyles: {
  id: number;
  name: string;
  description?: string;
 } | null;
 selectedBudget: {
  id: string | null;
  label: string | null;
  price_range: string | null;
 };
 handleGoBack: () => void;
 handleContinue: () => void;
 setSelectedMenuDescription: React.Dispatch<
  React.SetStateAction<string | null>
 >;
}

const IftarBoxesMenuSelection: React.FC<IftarBoxesMenuSelectionProps> = ({
 selectedServiceStyles,
 selectedBudget,
 handleGoBack,
 handleContinue,
 setSelectedMenuDescription,
}) => {
 const [menu, setMenu] = useState<any>(null);
 const [loading, setLoading] = useState<boolean>(true);
 const [error, setError] = useState<string | null>(null);

 const baseUrl = import.meta.env.VITE_API_URL;
 const authToken =
  sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

 useEffect(() => {
  const fetchIftarBoxMenu = async () => {
   try {
    if (!selectedServiceStyles?.id || !selectedBudget?.id) {
     setError("Missing service style or budget selection.");
     setLoading(false);
     return;
    }

    // Fetch menus filtering by budget option
    const response = await axios.get(
     `${baseUrl}/api/catering/iftar-box-menus/`,
     {
      params: {
       budget_option_id: selectedBudget.id,
       is_active: true,
      },
      headers: { Authorization: `Token ${authToken}` },
     },
    );

    const menus = response.data;

    if (menus.length > 0) {
     const listMenu = menus[0];
     setMenu(listMenu);
     setSelectedMenuDescription(listMenu.name || "Iftar Box Menu");
    } else {
     setError("No menu image uploaded for this selection.");
    }
   } catch (err) {
    console.error("Error fetching Iftar Box menu:", err);
    setError("Failed to load menu image.");
   } finally {
    setLoading(false);
   }
  };

  fetchIftarBoxMenu();
 }, [
  baseUrl,
  authToken,
  selectedServiceStyles,
  selectedBudget,
  setSelectedMenuDescription,
 ]);

 if (loading) {
  return (
   <div className="w-full h-[400px] flex items-center justify-center">
    <Shrimmer />
   </div>
  );
 }

 if (error || !menu || !menu.image_url) {
  return (
   <div className="flex flex-col items-center justify-center p-8 bg-neutral-white border rounded-2xl">
    <p className="text-red-500 mb-4">{error || "Menu image not found"}</p>
    <Button onClick={handleGoBack} variant="outline">
     Go Back
    </Button>
   </div>
  );
 }

 return (
  <LazyLoad>
   <div className="bg-neutral-white border rounded-2xl md:p-6 p-4 md:px-6 md:py-5 w-full border-[#EDEEF2]">
    <div className="flex items-center mb-6 gap-4">
     <div
      className="md:w-8 md:h-8 w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
      style={{ backgroundColor: "hsl(var(--primary))" }}>
      <span className="text-primary-foreground font-bold">5</span>
     </div>
     <div>
      <h2 className="text-primary-text md:text-2xl text-xl font-bold">
       {menu.name || "Iftar Box Menu"}
      </h2>
      <p className="text-neutral-gray text-sm mt-1">
       This is the menu for your selected budget.
      </p>
     </div>
    </div>

    <div className="flex flex-col items-center justify-center w-full">
     <div className="w-full max-w-4xl min-h-[400px] rounded-xl overflow-hidden border">
      <ImageWithShimmer
       src={menu.image_url}
       alt="Iftar Box Menu"
       className="w-full object-contain"
       wrapperClassName="w-full"
       onError={(e: any) => {
        if (!e.target.src.includes("placehold.co")) {
         e.target.src = "https://placehold.co/800x600?text=Menu+Image+Missing";
        }
       }}
      />
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
      className="bg-[#054A86] text-white hover:bg-[#054A86] hover:bg-opacity-70"
      style={{
       padding: "12px 16px",
       borderRadius: "8px",
       fontSize: "16px",
       fontWeight: "600",
       boxShadow: "0px 8px 20px 0px #4E60FF29",
      }}>
      Continue
     </Button>
    </div>
   </div>
  </LazyLoad>
 );
};

export default IftarBoxesMenuSelection;
