import { motion } from "framer-motion";

const LoadingAnimation = () => (
  <div className="flex justify-center items-center h-64">
    <motion.div
      className="w-16 h-16 bg-[#094e6e]"
      animate={{
        scale: [0.5, 1, 1, 0.5, 0.5],
        rotate: [0, 0, 270, 270, 0],
        borderRadius: ["20%", "20%", "50%", "50%", "20%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </div>
);

export default LoadingAnimation;
