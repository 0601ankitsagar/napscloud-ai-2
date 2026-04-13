import { Cloud, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between border-b border-zinc-100 bg-white/70 backdrop-blur-xl sticky top-0 z-50">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="bg-zinc-900 p-2 rounded-xl shadow-lg shadow-zinc-200">
          <Cloud className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tighter text-zinc-900 leading-none">Naps Cloud</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mt-1">Authenticator</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex items-center gap-8"
      >
        <nav className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <a href="#" className="hover:text-zinc-900 transition-colors">Platform</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Security</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Docs</a>
        </nav>
        <div className="h-4 w-px bg-zinc-200" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-full border border-zinc-100">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-wider">Verified System</span>
        </div>
      </motion.div>
    </header>
  );
}
