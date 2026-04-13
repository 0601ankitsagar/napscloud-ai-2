import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { FileUpload } from "./components/FileUpload";
import { AnalysisResult } from "./components/AnalysisResult";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Sparkles, FileText, Type as TypeIcon, ArrowRight, RotateCcw, Cloud } from "lucide-react";
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
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 text-zinc-900">
              Verify Document <span className="text-blue-600">Integrity</span>
            </h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto leading-relaxed">
              Distinguish between human creativity and AI-generated content with our advanced linguistic pattern analysis.
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input-section"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-zinc-100 p-1 rounded-xl">
                  <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
                    <TypeIcon className="w-4 h-4" />
                    Paste Text
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0">
                  <FileUpload onFileSelect={handleFileSelect} isProcessing={isAnalyzing} />
                </TabsContent>

                <TabsContent value="paste" className="mt-0">
                  <div className="space-y-4">
                    <div className="relative">
                      <Textarea
                        placeholder="Paste your text here for analysis..."
                        className="min-h-[300px] p-6 text-lg border-zinc-200 rounded-2xl focus:ring-blue-500 focus:border-blue-500 resize-none bg-white shadow-sm"
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                      />
                      <div className="absolute bottom-4 right-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        {pastedText.length} Characters
                      </div>
                    </div>
                    <Button
                      onClick={handleAnalyzePastedText}
                      disabled={isAnalyzing || !pastedText.trim()}
                      className="w-full py-6 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing Patterns...
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
                >
                  <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-bold">Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Sparkles, title: "Linguistic Analysis", desc: "Detects subtle patterns unique to AI language models." },
                  { icon: FileText, title: "Multi-Format", desc: "Supports PDF, DOCX, and raw text uploads seamlessly." },
                  { icon: ArrowRight, title: "Instant Score", desc: "Get a clear authenticity percentage in seconds." }
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                    <feature.icon className="w-6 h-6 text-blue-600 mb-4" />
                    <h3 className="font-bold text-zinc-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-black tracking-tight">Analysis Result</h3>
                <Button 
                  variant="outline" 
                  onClick={reset}
                  className="rounded-xl border-zinc-200 hover:bg-zinc-50 font-bold flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Analysis
                </Button>
              </div>
              
              <AnalysisResult result={result} />
              
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-800 font-medium leading-relaxed">
                  <strong>Note:</strong> While Naps Cloud uses state-of-the-art linguistic models to detect AI patterns, no system is 100% foolproof. Use these results as a guide alongside your own judgment.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full py-12 px-4 border-t border-zinc-100 mt-20 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900">Naps Cloud</span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            © 2024 Naps Cloud. Ensuring transparency in the age of AI.
          </p>
          <div className="flex gap-6 text-sm font-bold text-zinc-400">
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
