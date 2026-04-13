import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { FileUpload } from "./components/FileUpload";
import { AnalysisResult } from "./components/AnalysisResult";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Loader2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Type as TypeIcon, 
  ArrowRight, 
  RotateCcw, 
  Cloud,
  ShieldCheck,
  Zap,
  Lock
} from "lucide-react";
import { analyzeText, AnalysisResult as AnalysisResultType } from "./lib/gemini";
import { extractTextFromFile } from "./lib/file-parser";

export default function App() {
  const [activeTab, setActiveTab] = useState("upload");
  const [pastedText, setPastedText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    try {
      const text = await extractTextFromFile(file);
      if (text.trim().length < 10) {
        throw new Error("The document contains too little text for analysis.");
      }
      const analysis = await analyzeText(text);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzePastedText = async () => {
    if (!pastedText.trim()) return;
    
    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeText(pastedText);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPastedText("");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left Side: Hero & Info */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3 h-3" />
                Next-Gen AI Detection
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-zinc-900 mb-6">
                Verify <span className="text-blue-600">Integrity</span> in the AI Era.
              </h2>
              <p className="text-xl text-zinc-500 leading-relaxed max-w-lg">
                Naps Cloud uses advanced linguistic pattern analysis to distinguish between human creativity and AI-generated content.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { icon: ShieldCheck, title: "Trusted Analysis", desc: "Enterprise-grade detection models." },
                { icon: Lock, title: "Privacy First", desc: "Your documents are processed securely." },
                { icon: Zap, title: "Instant Results", desc: "Real-time authenticity scoring." },
                { icon: FileText, title: "Multi-Format", desc: "PDF, DOCX, and raw text support." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-3"
                >
                  <div className="mt-1">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900">{feature.title}</h3>
                    <p className="text-xs text-zinc-500 leading-tight mt-0.5">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side: Tool Interface */}
          <div className="lg:w-1/2 w-full">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="input-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full bg-white rounded-[32px] p-8 shadow-xl shadow-zinc-200/50 border border-zinc-100"
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-50 p-1 rounded-2xl border border-zinc-100">
                      <TabsTrigger value="upload" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 py-2.5 font-bold text-sm">
                        <FileText className="w-4 h-4" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="paste" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 py-2.5 font-bold text-sm">
                        <TypeIcon className="w-4 h-4" />
                        Paste
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-0 outline-none">
                      <FileUpload onFileSelect={handleFileSelect} isProcessing={isAnalyzing} />
                    </TabsContent>

                    <TabsContent value="paste" className="mt-0 outline-none">
                      <div className="space-y-4">
                        <div className="relative group">
                          <Textarea
                            placeholder="Paste your text here for instant analysis..."
                            className="min-h-[320px] p-6 text-base border-zinc-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none bg-zinc-50/30 transition-all"
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                          />
                          <div className="absolute bottom-4 right-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-zinc-100">
                            {pastedText.length} Characters
                          </div>
                        </div>
                        <Button
                          onClick={handleAnalyzePastedText}
                          disabled={isAnalyzing || !pastedText.trim()}
                          className="w-full py-7 text-lg font-black rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              Analyze Authenticity
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <Alert variant="destructive" className="rounded-2xl border-red-100 bg-red-50/50">
                        <AlertTriangle className="h-5 w-5" />
                        <AlertTitle className="font-bold">Error</AlertTitle>
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="result-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black tracking-tight">Analysis Report</h3>
                    <Button 
                      variant="ghost" 
                      onClick={reset}
                      className="rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 font-bold flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Start Over
                    </Button>
                  </div>
                  
                  <AnalysisResult result={result} />
                  
                  <div className="mt-8 p-6 rounded-3xl bg-white border border-zinc-100 shadow-sm">
                    <div className="flex gap-4">
                      <div className="p-2 bg-blue-50 rounded-xl h-fit">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm mb-1">Transparency Guaranteed</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          Our analysis is based on statistical probability and linguistic markers. While highly accurate, it should be used as one of many tools in your verification workflow.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="w-full py-16 px-6 border-t border-zinc-100 bg-white mt-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 p-2 rounded-xl">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-zinc-900">Naps Cloud</span>
            </div>
            <p className="text-sm text-zinc-400 font-medium text-center md:text-left max-w-xs">
              Ensuring document integrity and human creativity in the age of artificial intelligence.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-8 text-sm font-bold text-zinc-400">
              <a href="#" className="hover:text-zinc-900 transition-colors">How it works</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">API Access</a>
            </div>
            <p className="text-xs text-zinc-300 font-bold uppercase tracking-widest">
              © 2024 Naps Cloud Systems
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
