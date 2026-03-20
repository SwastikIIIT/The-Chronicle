import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";
import { Instagram } from "lucide-react";
import { Phone } from "lucide-react";

// Create regular non-motion versions first
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black border-t border-purple-900/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">The Chronicle</h3>
            <p className="text-gray-400 max-w-md mb-6">
              Secure, scalable, and safe security system for modern applications. 
              Built by Swastik Sharma.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/SwastikIIIT" target="_blank" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.instagram.com/ghost_swastik" target="_blank" className="text-gray-400  hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://www.linkedin.com/in/swastik-sharma-943615290" target="_blank" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/SwastikIIIT/The-Chronicle" target="_blank" className="text-gray-400 hover:text-purple-400 transition-colors">Source Code</a>
              </li>
              <li>
                <a href="#" target="_blank" className="text-gray-400 hover:text-purple-400 transition-colors">System Architecture</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Security Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-4 h-4 text-purple-500 mr-2" />
                <a href="mailto:swastikiiit.05@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                  swastikiiit.05@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 text-purple-500 mr-2" />
                <a href="tel:+9163949423336" className="text-gray-400 hover:text-purple-400 transition-colors">
                  +91 63949423336
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-900/20">
          <p className="text-center text-gray-500 text-sm">
            © {currentYear} The Chronicle . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;