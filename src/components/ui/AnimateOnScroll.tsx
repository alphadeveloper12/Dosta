import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface AnimateOnScrollProps {
 children: ReactNode;
 className?: string;
 delay?: number;
 direction?: "up" | "down" | "left" | "right" | "none";
 duration?: number;
 once?: boolean;
 "data-lenis-prevent"?: boolean | "true" | "false" | string;
}

/**
 * Wraps children with scroll-triggered entrance animation.
 * Does NOT modify any styling — purely an animation wrapper.
 */
const AnimateOnScroll = ({
 children,
 className,
 delay = 0,
 direction = "up",
 duration = 0.6,
 once = true,
 ...rest
}: AnimateOnScrollProps) => {
 const ref = useRef(null);
 const isInView = useInView(ref, { once, margin: "-60px" });

 const directions = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
  none: { x: 0, y: 0 },
 };

 const { x, y } = directions[direction];

 return (
  <motion.div
   ref={ref}
   className={className}
   initial={{ opacity: 0, x, y }}
   animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
   transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
   {...rest}>
   {children}
  </motion.div>
 );
};

export default AnimateOnScroll;

/**
 * Wraps children with staggered scroll-triggered animation.
 * Good for grids/lists — each child animates with increasing delay.
 */
export const AnimateStaggerItem = ({
 children,
 className,
 index = 0,
 direction = "up",
 duration = 0.5,
}: {
 children: ReactNode;
 className?: string;
 index?: number;
 direction?: "up" | "down" | "left" | "right" | "none";
 duration?: number;
}) => {
 const ref = useRef(null);
 const isInView = useInView(ref, { once: true, margin: "-60px" });

 const directions = {
  up: { y: 35, x: 0 },
  down: { y: -35, x: 0 },
  left: { x: -35, y: 0 },
  right: { x: 35, y: 0 },
  none: { x: 0, y: 0 },
 };

 const { x, y } = directions[direction];

 return (
  <motion.div
   ref={ref}
   className={className}
   initial={{ opacity: 0, x, y }}
   animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
   transition={{
    duration,
    delay: index * 0.1,
    ease: [0.22, 1, 0.36, 1],
   }}>
   {children}
  </motion.div>
 );
};
