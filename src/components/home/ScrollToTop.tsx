import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
 // This hook gets the current location (URL)
 const { pathname } = useLocation();

 // This hook runs every time the 'pathname' changes
 useEffect(() => {
  window.scrollTo({
   top: 0,
   left: 0,
   behavior: "smooth",
  });
 }, [pathname]);

 // This component doesn't render anything
 return null;
}

export default ScrollToTop;
