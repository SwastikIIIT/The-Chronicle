import React from "react";
import { motion } from "framer-motion";
import { Shield, Key, Lock, Users, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const featuresList = [
  {
    icon: <Shield className="text-purple-500 w-6 h-6" />,
    title: "AES-256 Encryption",
    description:
      "Sensitive keys and 2FA secrets are encrypted at rest using the AES-256-CBC algorithm with unique initialization vectors.",
  },
  {
    icon: <Lock className="text-purple-500 w-6 h-6" />,
    title: "Adaptive Hashing",
    description: "Passwords and recovery codes are irreversibly secured using Bcrypt with salt rounds optimized for hardware resistance.",
  },
  {
    icon: <Key className="text-purple-500 w-6 h-6" />,
    title: "TOTP 2FA Integration",
    description:
      "Time-based One-Time Passwords compatible with Google Authenticator, enforcing a second layer of defense.",
  },
  {
    icon: <Zap className="text-purple-500 w-6 h-6" />,
    title: "Secure Recovery Flows",
    description: "Cryptographically generated emergency backup codes ensure account access is never permanently lost.",
  },
  {
    icon: <Users className="text-purple-500 w-6 h-6" />,
    title: "Identity Verification",
    description: "Automated SMTP email challenges with short-lived, hashed tokens to validate user ownership.",
  },
  {
    icon: <Clock className="text-purple-500 w-6 h-6" />,
    title: "Anti-Spam Rate Limiting",
    description:
      "Intelligent throttling on verification endpoints prevents brute-force attacks and abuse.",
  },
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="w-full bg-black pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Enhanced background gradient with base layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

      {/* Multiple purple glow effects with different sizes and positions */}
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]"></div>
      <div className="absolute bottom-1/3 left-1/3 h-80 w-80 rounded-full bg-purple-700/15 blur-[120px]"></div>
      <div className="absolute top-1/2 right-1/2 h-72 w-72 rounded-full bg-purple-500/10 blur-[90px]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-block py-1 px-3 text-xs font-medium tracking-wider text-purple-400 uppercase bg-purple-900/30 rounded-full mb-4">
              Features
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600"
          >
            Core Security Architecture
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-300 text-xl max-w-3xl mx-auto"
          >
            A zero-trust security system built with military-grade AES encryption, adaptive hashing, and multi-layered identity verification.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuresList.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={cn(
                "p-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1",
                "bg-white/5 backdrop-blur-xl border border-white/10",
                "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
              )}
            >
              <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-6 group-hover:bg-purple-900/40 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
