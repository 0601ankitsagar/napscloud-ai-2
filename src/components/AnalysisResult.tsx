import { CheckCircle2, AlertCircle, Info, BrainCircuit, User, Layers, ShieldCheck, Fingerprint } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult as AnalysisResultType } from "@/src/lib/gemini";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
  result: AnalysisResultType;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 50) return "bg-amber-600";
    return "bg-red-600";
  };

  const getLabelIcon = (label: string) => {
    switch (label) {
      case "Human":
        return <User className="w-4 h-4" />;
      case "AI":
        return <BrainCircuit className="w-4 h-4" />;
      case "Mixed":
        return <Layers className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getLabelBadgeColor = (label: string) => {
    switch (label) {
      case "Human":
        return "bg-green-50 text-green-700 border-green-100";
      case "AI":
        return "bg-red-50 text-red-700 border-red-100";
      case "Mixed":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Score & Label */}
        <Card className="md:col-span-4 border-zinc-100 shadow-sm bg-white rounded-[24px] overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-8">Authenticity Index</span>
            
            <div className="relative mb-8">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-zinc-50"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={464.7}
                  strokeDashoffset={464.7 - (464.7 * result.score) / 100}
                  className={cn("transition-all duration-1000 ease-out", getScoreColor(result.score).replace('text-', 'stroke-'))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-5xl font-black tracking-tighter", getScoreColor(result.score))}>
                  {result.score}
                </span>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Percent</span>
              </div>
            </div>

            <Badge variant="outline" className={cn("px-4 py-1.5 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-none shadow-sm", getLabelBadgeColor(result.label))}>
              {getLabelIcon(result.label)}
              {result.label} Origin
            </Badge>
          </CardContent>
        </Card>

        {/* Reasoning & Indicators */}
        <Card className="md:col-span-8 border-zinc-100 shadow-sm bg-white rounded-[24px]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Analysis Summary</CardTitle>
              <Fingerprint className="w-5 h-5 text-zinc-200" />
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            <p className="text-lg font-medium text-zinc-800 leading-relaxed">
              {result.reasoning}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-zinc-100" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Linguistic Markers</span>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keyIndicators.map((indicator, idx) => (
                  <div 
                    key={idx} 
                    className="px-3 py-1.5 bg-zinc-50 text-zinc-600 rounded-lg text-xs font-bold border border-zinc-100"
                  >
                    {indicator}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confidence & System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-zinc-100 shadow-sm bg-white rounded-[24px]">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-zinc-900" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Model Confidence</span>
                <span className="text-sm font-black text-zinc-900">{(result.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-900 transition-all duration-1000"
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-sm bg-white rounded-[24px]">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="p-4 bg-zinc-50 rounded-2xl">
              <Info className="w-6 h-6 text-zinc-900" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Pattern Verification</h4>
              <p className="text-xs text-zinc-400 font-medium mt-1">Linguistic depth and syntax variety checked.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
