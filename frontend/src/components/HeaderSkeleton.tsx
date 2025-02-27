import { motion } from "framer-motion";

const Shimmer = ({ className }: { className: string }) => (
  <motion.div
    className={`bg-gray-300 animate-pulse ${className}`}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  ></motion.div>
);

const HeaderSkeleton = () => {
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Shimmer className="h-6 w-20" />
      <div className="flex">
        <Shimmer className="h-10 w-24 rounded-full mr-4" />
        <Shimmer className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
};

export default HeaderSkeleton;