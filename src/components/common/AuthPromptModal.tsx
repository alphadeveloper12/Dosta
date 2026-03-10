import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, UserPlus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";

interface AuthPromptModalProps {
 isOpen: boolean;
 onClose: () => void;
 message?: string;
}

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  {...props}>
  <path
   d="M3.02388 16.4312L6.38721 13.8593C6.1949 13.2751 6.09091 12.6503 6.09091 12.0003C6.09091 11.3503 6.1949 10.7254 6.38721 10.1413L3.02388 7.56934C2.36791 8.90299 2 10.4066 2 12.0003C2 13.594 2.36791 15.0976 3.02388 16.4312Z"
   fill="#FBBC05"
  />
  <path
   d="M6.38677 10.141C7.16276 7.78407 9.37681 6.09091 11.9996 6.09091C13.4086 6.09091 14.6814 6.59091 15.6814 7.40909L18.5905 4.5C16.8177 2.95455 14.545 2 11.9996 2C8.04779 2 4.65001 4.2621 3.02344 7.56906L6.38677 10.141Z"
   fill="#EA4335"
  />
  <path
   d="M11.9999 21.9999C8.04707 21.9999 4.6485 19.7366 3.02246 16.4281L6.38442 13.8506C7.15795 16.2119 9.37411 17.909 11.9999 17.909C13.2848 17.909 14.4233 17.6064 15.3249 17.0374L18.5179 19.5094C16.77 21.1346 14.439 21.9999 11.9999 21.9999Z"
   fill="#34A853"
  />
  <path
   d="M12 10.1816H21.3182C21.4545 10.7725 21.5455 11.4089 21.5455 11.9998C21.5455 15.2591 20.3531 17.803 18.5179 19.5093L15.325 17.0373C16.369 16.3785 17.0953 15.3624 17.3636 14.0453H12V10.1816Z"
   fill="#4285F4"
  />
 </svg>
);

const AuthPromptModal = ({
 isOpen,
 onClose,
 message = "Please log in to your account to add items to your cart.",
}: AuthPromptModalProps) => {
 const navigate = useNavigate();
 const baseUrl = import.meta.env.VITE_API_URL;

 const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
   try {
    const res = await axios.post(`${baseUrl}/api/google/`, {
     access_token: tokenResponse.access_token,
    });
    const tokenToken = res.data.key ?? res.data.token;
    const userData = JSON.stringify(res.data.user);

    localStorage.setItem("authToken", tokenToken);
    localStorage.setItem("user", userData);
    sessionStorage.setItem("authToken", tokenToken);
    sessionStorage.setItem("user", userData);

    toast.success("Logged in successfully!");
    const guestCartData = localStorage.getItem("guestCart");
    if (guestCartData) {
     const payload = JSON.parse(guestCartData);
     payload.clear_all = true;
     await axios.post(`${baseUrl}/api/vending/cart/`, payload, {
      headers: { Authorization: `Token ${tokenToken}` },
     });
     localStorage.removeItem("guestCart");
    }

    onClose();
    window.location.reload();
   } catch (err) {
    console.error("Google Login Error:", err);
    toast.error("Failed to sign in with Google.");
   }
  },
  onError: () => toast.error("Google Login Failed"),
 });

 const handleSignIn = () => {
  onClose();
  navigate("/signin");
 };

 const handleSignUp = () => {
  onClose();
  navigate("/signup");
 };

 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     className="fixed inset-0 z-[9999] flex items-center justify-center"
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

     {/* Modal */}
     <motion.div
      className="relative bg-white rounded-[24px] shadow-2xl w-full max-w-[420px] mx-4 overflow-hidden"
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
       <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-3">
        <ShoppingCart className="w-7 h-7 text-white" />
       </div>
       <h2 className="text-[22px] font-[800] leading-tight mb-1">
        Login Required
       </h2>
       <p className="text-[14px] text-white/80 font-[400]">
        Sign in to unlock your cart
       </p>
      </div>

      {/* Body */}
      <div className="p-6 -mt-4 bg-white rounded-t-[24px] relative">
       <p className="text-[15px] text-[#545563] font-[400] text-center leading-[22px] mb-6">
        {message}
       </p>

       <div className="space-y-3">
        <button
         onClick={() => googleLogin()}
         className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-[#2B2B43] font-[700] text-[15px] py-3 rounded-[12px] border border-[#EDEEF2] shadow-sm transition-all">
         <GoogleIcon />
         Continue with Google
        </button>

        <button
         onClick={handleSignIn}
         className="w-full flex items-center justify-center gap-2 bg-[#054A86] hover:bg-[#0768B8] text-white font-[700] text-[15px] py-3 rounded-[12px] transition-colors">
         <LogIn className="w-4 h-4" />
         Sign In to My Account
        </button>

        <button
         onClick={handleSignUp}
         className="w-full flex items-center justify-center gap-2 bg-white hover:bg-[#F7F7F9] text-[#054A86] font-[700] text-[15px] py-3 rounded-[12px] border-2 border-[#054A86] transition-colors">
         <UserPlus className="w-4 h-4" />
         Create New Account
        </button>
       </div>

       <p className="text-center text-[12px] text-[#83859C] mt-4">
        Your selections will be saved when you return
       </p>
      </div>
     </motion.div>
    </motion.div>
   )}
  </AnimatePresence>
 );
};

export default AuthPromptModal;
