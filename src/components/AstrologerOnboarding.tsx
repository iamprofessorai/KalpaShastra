import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, ArrowLeft, CheckCircle2, 
  User, Briefcase, Award, BookOpen, Shield, Upload, X, FileText, Clock
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { toast } from 'sonner';

interface AstrologerOnboardingProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export const AstrologerOnboarding: React.FC<AstrologerOnboardingProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    expertise: '',
    yearsOfPractice: '',
    certifications: '',
    bio: '',
    lineage: '',
    documents: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.expertise.trim()) newErrors.expertise = "Expertise is required";
      if (!formData.yearsOfPractice) newErrors.yearsOfPractice = "Years of practice is required";
    } else if (currentStep === 2) {
      if (!formData.certifications.trim()) newErrors.certifications = "Certifications are required";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      else if (formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters";
    } else if (currentStep === 3) {
      if (!formData.lineage.trim()) newErrors.lineage = "Spiritual lineage is required";
    } else if (currentStep === 4) {
      if (formData.documents.length === 0) newErrors.documents = "At least one verification document is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    setStep(s => s - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, documents: [...prev.documents, ...newFiles] }));
      if (errors.documents) setErrors(prev => ({ ...prev, documents: '' }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) {
      toast.success("Application submitted for cosmic verification!");
      onComplete(formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono`}
                    placeholder="Enter your professional name"
                  />
                </div>
                {errors.name && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Primary Expertise</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.expertise ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono`}
                    placeholder="e.g. Vedic Astrology, KP System"
                  />
                </div>
                {errors.expertise && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.expertise}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Years of Practice</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="number"
                    value={formData.yearsOfPractice}
                    onChange={(e) => setFormData({ ...formData, yearsOfPractice: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.yearsOfPractice ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono`}
                    placeholder="Number of years"
                  />
                </div>
                {errors.yearsOfPractice && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.yearsOfPractice}</p>}
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Certifications & Titles</label>
                <div className="relative">
                  <Award className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.certifications ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono h-32 resize-none`}
                    placeholder="List your major certifications and honorary titles"
                  />
                </div>
                {errors.certifications && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.certifications}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Professional Bio</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.bio ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono h-40 resize-none`}
                    placeholder="Tell us about your journey and approach (min 50 chars)"
                  />
                </div>
                {errors.bio && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.bio}</p>}
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Spiritual Lineage & Guru</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                  <textarea
                    value={formData.lineage}
                    onChange={(e) => setFormData({ ...formData, lineage: e.target.value })}
                    className={`w-full bg-white/5 border ${errors.lineage ? 'border-red-500/50' : 'border-white/10'} rounded-xl pl-12 pr-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-mono h-48 resize-none`}
                    placeholder="Describe your spiritual lineage, mentors, or the tradition you follow"
                  />
                </div>
                {errors.lineage && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.lineage}</p>}
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed italic">
                * We value authentic connections to traditional wisdom. This helps us match you with the right seekers.
              </p>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Verification Documents</label>
              
              <div 
                className={`border-2 border-dashed ${errors.documents ? 'border-red-500/30' : 'border-white/10'} rounded-2xl p-12 text-center hover:border-primary/30 transition-all cursor-pointer relative group`}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-1">Click to Upload</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">ID, Credentials, or Certificates (PDF/JPG)</p>
                  </div>
                </div>
              </div>

              {formData.documents.length > 0 && (
                <div className="space-y-3">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 glass rounded-xl border-white/5">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs font-mono text-white/60 truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-white/40" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.documents && <p className="text-[10px] text-red-500 uppercase tracking-widest">{errors.documents}</p>}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32">
      <GlassCard className="max-w-2xl w-full p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Shield className="w-48 h-48" />
        </div>

        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={step === 1 ? onCancel : prevStep}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`w-12 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-white/10'}`}
              />
            ))}
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="mb-12">
          <h2 className="text-4xl font-display mb-4 tracking-tight uppercase">
            {step === 1 && "Professional Identity"}
            {step === 2 && "Expertise & Bio"}
            {step === 3 && "Spiritual Lineage"}
            {step === 4 && "Verification"}
          </h2>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Step {step} of 4 • Master Onboarding
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex gap-4">
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full group relative px-8 py-5 bg-primary text-black font-black rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_var(--glow-color)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center justify-center gap-4 text-sm uppercase tracking-widest">
                  Continue Integration
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>
            ) : (
              <button
                type="submit"
                className="w-full group relative px-8 py-5 bg-primary text-black font-black rounded-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_var(--glow-color)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10 flex items-center justify-center gap-4 text-sm uppercase tracking-widest">
                  Submit for Verification
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              </button>
            )}
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
