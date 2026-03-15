import React from "react";
import { motion } from "framer-motion";
import { MoveRightIcon, LineChart } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CTA = () => {
  return (
    <section className="w-full bg-black py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] [500px]rounded-full bg-purple-700/10 blur-[150px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          viewport={{ once: true }}
          className={cn(
            "relative rounded-3xl overflow-hidden",
            "bg-white/5 backdrop-blur-xl border border-white/10",
            "shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 sm:p-12 items-center relative z-10">
           
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden border border-purple-500/20 bg-black/50 group flex items-center justify-center shadow-2xl"
            >
              
              <Image
                src="/crypto.png"
                alt="CryptoLens Application Dashboard"
                fill
                className="object-cover object-center opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>

            <div className="flex flex-col items-start space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500"></span>
                </span>
                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Crypto Tracker
                </span>
              </motion.div>

              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-bold text-white leading-tight"
              >
                Track the Markets with <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                  CryptoLens
                </span>
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-lg leading-relaxed max-w-md"
              >
                Take your statistical analysis to the next level. Get real-time data, news-feed, deep market insights, and interactive graphs for any cryptocurrency in one unified dashboard.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-2"
              >
                <a
                    href="http://crypto-app-rose-mu.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center px-8 h-14 text-base font-medium text-white bg-purple-600 rounded-xl shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:bg-purple-500 hover:shadow-[0_0_25px_rgba(147,51,234,0.6)] transition-all duration-300 transform hover:-translate-y-1"
                >
                    Visit CryptoLens
                  <MoveRightIcon className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                </a>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;