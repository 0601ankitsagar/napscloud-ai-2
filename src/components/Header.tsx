import { Cloud } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex items-center justify-between border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
          <Cloud className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">Naps Cloud</h1>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">AI Authenticator</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex items-center gap-6"
      >
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600">
          <a href="#" className="hover:text-blue-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">API</a>
        </nav>
      </motion.div>
    </header>
  );
}
