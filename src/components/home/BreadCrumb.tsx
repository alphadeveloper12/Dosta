import { ChevronLeft } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
 const location = useLocation();

 const pathnames = location.pathname.split("/").filter((x) => x);

 return (
  <nav className="text-sm text-gray-600 py-4">
   <ol className="flex items-center space-x-2">
    <li>
     <Link
      to="/"
      className="flex items-center gap-1 tracking-[0.1px] font-[700] text-neutral-gray-dark hover:text-primary transition-colors">
      <ChevronLeft className="w-4 h-4" />
      Home
     </Link>
    </li>

    {pathnames.map((segment, index) => {
     const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
     const isLast = index === pathnames.length - 1;

     return (
      <React.Fragment key={segment}>
       <span className="mx-1 text-gray-400 tracking-[0.1px] font-[700]">/</span>
       {isLast ? (
        <span className="text-gray-500 tracking-[0.1px] capitalize font-[700]">
         {segment}
        </span>
       ) : (
        <Link
         to={routeTo}
         className="text-neutral-gray-dark tracking-[0.1px] font-[700] capitalize hover:text-primary transition-colors">
         {segment}
        </Link>
       )}
      </React.Fragment>
     );
    })}
   </ol>
  </nav>
 );
};

export default Breadcrumbs;
