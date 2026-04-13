import { CheckCircle2, AlertCircle, Info, BrainCircuit, User, Layers } from "lucide-react";
import { motion } from "motion/react";
import { Progress } from "@/components/ui/progress";
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
        return <User className="w-5 h-5" />;
      case "AI":
        return <BrainCircuit className="w-5 h-5" />;
      case "Mixed":
        return <Layers className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getLabelBadgeColor = (label: string) => {
    switch (label) {
      case "Human":
        return "bg-green-100 text-green-700 border-green-200";
      case "AI":
        return "bg-red-100 text-red-700 border-red-200";
      case "Mixed":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <Card className="md:col-span-1 border-zinc-200 shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
              Authenticity Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-8">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                  className={cn("transition-all duration-1000 ease-out", getScoreColor(result.score).replace('text-', 'stroke-'))}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-4xl font-black tracking-tighter", getScoreColor(result.score))}>
                  {result.score}%
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Badge variant="outline" className={cn("px-3 py-1 text-sm font-bold flex items-center gap-1.5", getLabelBadgeColor(result.label))}>
                {getLabelIcon(result.label)}
                {result.label} Content
              </Badge>
              <p className="text-xs text-zinc-400 mt-2 font-medium">
                Confidence: {(result.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reasoning Card */}
        <Card className="md:col-span-2 border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-700 leading-relaxed italic">
              "{result.reasoning}"
            </p>
            
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                Key Indicators
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.keyIndicators.map((indicator, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-none px-2.5 py-1 text-xs font-medium"
                  >
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown (Optional visual) */}
      <Card className="border-zinc-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg">
                <Info className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900">Integrity Verification</h4>
                <p className="text-sm text-zinc-500">Linguistic pattern analysis complete.</p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
               <div className="flex justify-between text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">
                 <span>Human Creativity</span>
                 <span>AI Probability</span>
               </div>
               <div className="relative h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                 <div 
                   className={cn("absolute left-0 top-0 h-full transition-all duration-1000", getProgressColor(result.score))}
                   style={{ width: `${result.score}%` }}
                 />
               </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
