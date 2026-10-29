import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Clock, HeartHandshake, FileText, Check } from 'lucide-react';

interface Step2ContextProps {
  bodyLocation: string;
  duration: string;
  symptoms: string[];
  notes: string;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}

const BODY_REGIONS = [
  'Head / Face',
  'Neck',
  'Chest',
  'Abdomen',
  'Upper Back',
  'Lower Back',
  'Left Arm',
  'Right Arm',
  'Left Hand',
  'Right Hand',
  'Left Leg',
  'Right Leg',
  'Left Foot',
  'Right Foot',
];

const DURATION_OPTIONS = [
  '< 1 Week',
  '1–4 Weeks',
  '1–3 Months',
  '3+ Months',
];

const SENSATION_OPTIONS = [
  'Itchy',
  'Painful',
  'Burning',
  'Tender',
  'Numb',
  'No sensation',
];

export const Step2Context: React.FC<Step2ContextProps> = ({
  bodyLocation,
  duration,
  symptoms,
  notes,
  onChange,
  onBack,
  onNext,
}) => {
  const toggleSymptom = (symptom: string) => {
    if (symptoms.includes(symptom)) {
      onChange('symptoms', symptoms.filter((s) => s !== symptom));
    } else {
      if (symptom === 'No sensation') {
        onChange('symptoms', ['No sensation']);
      } else {
        onChange('symptoms', [...symptoms.filter((s) => s !== 'No sensation'), symptom]);
      }
    }
  };

  const isSelected = (region: string) => bodyLocation.toLowerCase() === region.toLowerCase();

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-6 step-enter">
      
      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FFFFFF] p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-clinical">
        
        {/* Left Column: Anatomical Region Selector (5 cols, No body silhouette image) */}
        <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E2E8F0] pb-6 md:pb-0 md:pr-6 space-y-4">
          <div className="w-full flex items-center justify-between">
            <label className="text-xs font-mono uppercase font-bold tracking-wider text-[#0F172A] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0F6FBF]" />
              <span>Anatomical Zone</span>
            </label>
            <span className="text-[11px] font-mono text-[#0F6FBF] font-semibold bg-[#EBF4FF] px-2 py-0.5 rounded">
              {bodyLocation || 'Select'}
            </span>
          </div>

          {/* Interactive Region Button Grid */}
          <div className="bg-[#F7FAFC] p-3 rounded-xl border border-[#E2E8F0] space-y-2.5">
            <span className="text-[11px] text-[#64748B] block font-medium">Click affected anatomical area:</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {BODY_REGIONS.map((region) => {
                const active = isSelected(region);
                return (
                  <button
                    key={region}
                    type="button"
                    onClick={() => onChange('bodyLocation', region)}
                    className={`px-2.5 py-2 text-[11px] font-medium rounded-lg text-left truncate border transition-all ${
                      active
                        ? 'bg-[#0F6FBF] text-white border-[#0F6FBF] font-semibold shadow-xs'
                        : 'bg-white text-[#334155] border-[#E2E8F0] hover:border-[#BFDBFE] hover:bg-[#F0F4F8]'
                    }`}
                  >
                    {region}
                  </button>
                );
              })}
            </div>

            {/* Quick dropdown */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <select
                aria-label="Select body location"
                value={bodyLocation}
                onChange={(e) => onChange('bodyLocation', e.target.value)}
                className="w-full text-xs bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1.5 font-medium text-[#0F172A] focus:ring-1 focus:ring-[#0F6FBF] focus:outline-none"
              >
                <option value="">Select from list...</option>
                {BODY_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Duration, Sensations, Notes (7 cols) */}
        <div className="md:col-span-7 space-y-5 flex flex-col justify-between">
          
          {/* 1. Duration: Segmented Control */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase font-bold tracking-wider text-[#0F172A] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0F6FBF]" />
              <span>Symptom Duration</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-[#F0F4F8] rounded-xl border border-[#E2E8F0]">
              {DURATION_OPTIONS.map((opt) => {
                const active = duration === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange('duration', opt)}
                    className={`py-2 px-2 text-xs font-medium rounded-lg text-center transition-all ${
                      active
                        ? 'bg-[#0F6FBF] text-white shadow-sm font-semibold'
                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white/60'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sensations / How Does It Feel: Multi-select Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-[#0F6FBF]" />
                <span>How Does It Feel?</span>
              </label>
              <span className="text-[11px] text-[#64748B]">Multi-select</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SENSATION_OPTIONS.map((sens) => {
                const active = symptoms.includes(sens);
                return (
                  <button
                    key={sens}
                    type="button"
                    onClick={() => toggleSymptom(sens)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                      active
                        ? 'bg-[#0F6FBF] border-[#0F6FBF] text-white shadow-sm'
                        : 'bg-[#FFFFFF] border-[#CBD5E1] text-[#475569] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-white" />}
                    <span>{sens}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Additional Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold tracking-wider text-[#0F172A] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0F6FBF]" />
                <span>Additional Context (Optional)</span>
              </label>
              <span className="text-[11px] font-mono text-[#64748B]">
                {notes.length} / 300
              </span>
            </div>
            <textarea
              value={notes}
              maxLength={300}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder="Describe any changes in size, color, or texture. Mention any recent exposures, new products, or travel."
              rows={3}
              className="w-full p-3 text-xs sm:text-sm bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#0F6FBF] focus:border-transparent transition-all placeholder:text-[#94A3B8] resize-none"
            />
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]/60 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={onNext}
          disabled={!bodyLocation}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm shadow-sm transition-all duration-150 ${
            bodyLocation
              ? 'bg-[#0F6FBF] hover:bg-[#0A5594] text-white shadow-sm hover:shadow-md cursor-pointer'
              : 'bg-[#CBD5E1] text-[#94A3B8] cursor-not-allowed'
          }`}
        >
          <span>Next: Review Submission</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
