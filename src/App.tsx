import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import VendingHome from "./pages/VendingHome"
import CateringHome from "./pages/catering/pages/Index";
import CateringPlan from "./pages/catering/pages/Catering";
import NotFound from "./pages/NotFound";
import "./index.css";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";
import VendingMenu from "./pages/VendingMenu";

const queryClient = new QueryClient();

const App = () => (
 <QueryClientProvider client={queryClient}>
  <TooltipProvider>
   <Toaster />
   <Sonner />
   <BrowserRouter>
    <Routes>
     <Route path="/" element={<Index />} />
     <Route path="/settings" element={<Settings />} />
     <Route path="/signup" element={<Signup />} />
     <Route path="/signin" element={<SignIn />} />
     <Route path="/catering" element={<CateringHome />} />
      <Route path="/catering/plan" element={<CateringPlan />} />
     <Route path="/vending-home" element={<VendingHome />} />
     <Route path="/vending-home/menu" element={<VendingMenu />} />
     {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
     <Route path="*" element={<NotFound />} />
    </Routes>
   </BrowserRouter>
  </TooltipProvider>
 </QueryClientProvider>
);

export default App;
