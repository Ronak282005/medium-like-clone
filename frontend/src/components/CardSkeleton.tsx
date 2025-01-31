import { motion } from "framer-motion";

const Shimmer = ({ className }: { className: string }) => (
  <motion.div
    className={`bg-gray-300 animate-pulse ${className}`}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  ></motion.div>
);

const CardSkeleton = () => {
  return (
    <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
      <div className="flex">
        <Shimmer className="h-10 w-10 rounded-full" />
        <Shimmer className="h-4 w-20 ml-2" />
        <Shimmer className="h-3 w-3 ml-2 rounded-full" />
        <Shimmer className="h-4 w-16 ml-2" />
      </div>
      <Shimmer className="h-6 w-3/4 mt-2" />
      <Shimmer className="h-4 w-full mt-2" />
      <Shimmer className="h-4 w-1/2 mt-1" />
      <Shimmer className="h-4 w-24 mt-4" />
    </div>
  );
};

export default CardSkeleton;