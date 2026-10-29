export interface SkinMorphology {
  primary_lesion: 'macule' | 'papule' | 'plaque' | 'vesicle' | 'pustule' | 'nodule' | 'wheal' | 'other' | string;
  color: string;
  border: 'well-defined' | 'ill-defined' | 'irregular' | string;
  distribution: 'localized' | 'diffuse' | 'linear' | 'grouped' | string;
}

export interface RecommendedAction {
  action: string;
  priority: 'immediate' | 'soon' | 'routine';
}

export interface DifferentialDiagnosis {
  name: string;
  likelihood: 'high' | 'moderate' | 'low';
}

export interface SkinAnalysisResult {
  is_skin_image?: boolean;
  quality_warning?: string;
  classification: string;
  icd_code: string;
  confidence: number;
  risk_level: 'low' | 'moderate' | 'high';
  risk_color: 'green' | 'amber' | 'red' | string;
  risk_summary: string;
  clinical_description: string;
  morphology: SkinMorphology;
  common_causes: string[];
  triggers: string[];
  recommended_actions: RecommendedAction[];
  differential_diagnoses: DifferentialDiagnosis[];
  see_doctor_urgency: 'routine' | 'within_week' | 'urgent' | 'emergency';
  see_doctor_reason: string;
  self_care_tips: string[];
  avoid: string[];
  disclaimer: string;
}

export interface ScanSubmission {
  imageData: string;       // base64 full/compressed
  thumbnailData: string;   // base64 small
  bodyLocation: string;
  duration: string;
  symptoms: string[];
  notes: string;
}

export interface ScanHistoryItem {
  id: string;
  session_id: string;
  image_thumbnail: string;
  body_location: string;
  duration: string;
  symptoms: string[];
  classification: string;
  icd_code: string;
  confidence: number;
  risk_level: 'low' | 'moderate' | 'high';
  full_result: SkinAnalysisResult;
  created_at: string;
}
