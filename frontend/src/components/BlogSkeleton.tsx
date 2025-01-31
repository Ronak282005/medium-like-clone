import { motion } from "framer-motion";

const Shimmer = ({ className }: { className: string }) => (
  <motion.div
    className={`bg-gray-300 animate-pulse ${className}`}
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  ></motion.div>
);

const BlogSkeleton = () => {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-12 px-10 w-full max-w-screen-xl pt-12">
        <div className="col-span-8">
          <Shimmer className="h-10 w-3/4" />
          <Shimmer className="h-4 w-1/2 mt-2" />
          <Shimmer className="h-24 w-full mt-4" />
        </div>
        <div className="col-span-4">
          <Shimmer className="h-6 w-16" />
          <div className="flex w-full mt-2">
            <Shimmer className="h-16 w-16 rounded-full" />
            <div className="ml-4">
              <Shimmer className="h-6 w-24" />
              <Shimmer className="h-4 w-32 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;