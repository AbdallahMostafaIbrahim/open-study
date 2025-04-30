"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Logo } from "~/components/logo";
import { NAME } from "~/lib/constants";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="mx-auto max-w-3xl px-4 md:mt-8"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, translateY: -20, scale: 0.96 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {/* Main Content */}
      <div className="bg-background overflow-hidden rounded-2xl border border-neutral-800/40 shadow-xl backdrop-blur-md">
        <div className="relative p-6 md:p-8">
          {/* Decorative Elements - Circuit-like patterns */}
          <div className="absolute top-0 right-0 h-40 w-40 opacity-10 md:h-60 md:w-60">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              className="h-full w-full text-neutral-500"
            >
              <path
                d="M10,30 L40,30 L40,10 L70,10 L70,40 L90,40 L90,70 L60,70 L60,90 L30,90 L30,60 L10,60 Z"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="40" cy="30" r="2" fill="currentColor" />
              <circle cx="70" cy="10" r="2" fill="currentColor" />
              <circle cx="70" cy="40" r="2" fill="currentColor" />
              <circle cx="90" cy="70" r="2" fill="currentColor" />
              <circle cx="60" cy="90" r="2" fill="currentColor" />
              <circle cx="30" cy="60" r="2" fill="currentColor" />
            </svg>
          </div>

          <div className="absolute bottom-0 left-0 h-40 w-40 opacity-10 md:h-60 md:w-60">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              className="h-full w-full text-neutral-500"
            >
              <path
                d="M90,20 L60,20 L60,40 L40,40 L40,60 L20,60 L20,80 L50,80 L50,60 L70,60 L70,40 L90,40 Z"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              <circle cx="60" cy="20" r="2" fill="currentColor" />
              <circle cx="60" cy="40" r="2" fill="currentColor" />
              <circle cx="40" cy="40" r="2" fill="currentColor" />
              <circle cx="40" cy="60" r="2" fill="currentColor" />
              <circle cx="20" cy="60" r="2" fill="currentColor" />
              <circle cx="20" cy="80" r="2" fill="currentColor" />
              <circle cx="50" cy="80" r="2" fill="currentColor" />
            </svg>
          </div>

          {/* Hero Section with Logo */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
            >
              <div className="relative">
                {/* Enhanced pulse effect with better gradients */}
                <motion.div
                  className="absolute -inset-3 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-40 blur-md"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400/30 to-indigo-500/30 opacity-50 blur-sm"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    delay: 0.5,
                    ease: "easeInOut",
                  }}
                />

                <Logo className="fill-primary" size={80} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
              exit={{ opacity: 0, y: 40 }}
              className="relative"
            >
              <h1 className="mb-2 text-2xl font-bold text-white md:text-4xl">
                <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                  {NAME} AI
                </span>
              </h1>

              <motion.div
                className="mx-auto my-3 h-1 w-16 rounded-full bg-white bg-gradient-to-r md:w-24"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />

              <motion.p
                className="mx-auto max-w-lg text-base text-neutral-300 md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                exit={{ opacity: 0 }}
              >
                Your{" "}
                <span className="bg-gradient-to-r from-blue-300 to-indigo-400 bg-clip-text font-semibold text-transparent">
                  digital buddy
                </span>{" "}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
