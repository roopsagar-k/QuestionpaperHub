import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  BadgePlus,
  BookOpenCheck,
  BookmarkPlus,
  BrainCircuit,
  PencilRuler,
} from "lucide-react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 py-0 md:py-5 lg:py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          // href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-primary/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle className="text-black dark:text-white flex gap-2">
              {idx === 0 && (
                <BrainCircuit
                  size={24}
                  className="shrink-0 text-primary"
                />
              )}
              {idx === 1 && (
                <BadgePlus
                  size={24}
                  className="shrink-0 text-primary"
                />
              )}
              {idx === 2 && (
                <BookOpenCheck
                  size={24}
                  className="shrink-0 text-primary"
                />
              )}
              {idx === 3 && (
                <PencilRuler
                  size={24}
                  className="shrink-0 text-primary"
                />
              )}
              {idx === 4 && (
                <BookmarkPlus
                  size={24}
                  className="shrink-0 text-primary"
                />
              )}
              {item.title}
            </CardTitle>
            <CardDescription className="text-gray-800 dark:text-white font-medium">
              {item.description}
            </CardDescription>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden shadow-lg bg-[#f1f5f9] dark:bg-[#2b3a52] border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
