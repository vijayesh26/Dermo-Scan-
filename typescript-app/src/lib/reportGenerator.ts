import { SkinAnalysisResult, ScanSubmission } from '../types/dermascan';
import { getOrCreateSessionId } from './session';

export function generateClinicalHtmlReport(
  result: SkinAnalysisResult,
  submission?: ScanSubmission,
  sessionId?: string
): string {
  const effectiveSessionId = sessionId || getOrCreateSessionId();
  const reportId = `DS-CLIN-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const imageSrc = submission?.imageData || submission?.thumbnailData || '';

  const riskColor =
    result.risk_level === 'high'
      ? '#DC2626'
      : result.risk_level === 'moderate'
      ? '#D97706'
      : '#059669';

  const riskBg =
    result.risk_level === 'high'
      ? '#FEF2F2'
      : result.risk_level === 'moderate'
      ? '#FFFBEB'
      : '#ECFDF5';

  const riskBorder =
    result.risk_level === 'high'
      ? '#FECACA'
      : result.risk_level === 'moderate'
      ? '#FDE68A'
      : '#A7F3D0';

  const urgencyLabel = {
    emergency: 'Immediate Emergency Care Required',
    urgent: 'Urgent Medical Attention Advised (24-48h)',
    within_week: 'Schedule Evaluation Within 7 Days',
    routine: 'Routine Dermatological Evaluation Advised',
  }[result.see_doctor_urgency || 'routine'];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DermoScan Clinical Report — ${result.classification} (${reportId})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --color-primary: #0F6FBF;
      --color-primary-dim: #EBF4FF;
      --color-teal: #0D9488;
      --color-bg: #F0F4F8;
      --color-text: #0F172A;
      --color-muted: #64748B;
      --color-border: #E2E8F0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #F8FAFC;
      color: var(--color-text);
      line-height: 1.5;
      padding: 24px;
      -webkit-font-smoothing: antialiased;
    }
    .report-container {
      max-width: 860px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }
    
    /* Document Action Bar for standalone viewing */
    .doc-actions {
      background: #0F172A;
      color: #94A3B8;
      padding: 12px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
    }
    .doc-actions button {
      background: var(--color-primary);
      color: #FFFFFF;
      border: none;
      padding: 7px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      transition: background 0.15s;
    }
    .doc-actions button:hover {
      background: #0A5594;
    }

    .report-body {
      padding: 36px 40px;
    }

    /* Header */
    .clinical-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--color-border);
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--color-primary);
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-sub {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-teal);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
      font-weight: 600;
    }
    .meta-box {
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--color-muted);
      line-height: 1.6;
    }
    .meta-box strong {
      color: var(--color-text);
    }

    /* Intake Section */
    .intake-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #F8FAFC;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .intake-item {
      font-size: 12px;
    }
    .intake-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      color: var(--color-muted);
      margin-bottom: 2px;
    }
    .intake-value {
      font-weight: 600;
      color: var(--color-text);
    }
    .symptom-tag {
      display: inline-block;
      background: #EBF4FF;
      color: #0F6FBF;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      margin-right: 4px;
      margin-top: 2px;
      font-weight: 500;
    }

    /* Hero Specimen & Classification Section */
    .classification-card {
      border: 1px solid var(--color-border);
      border-left: 6px solid ${riskColor};
      border-radius: 14px;
      padding: 24px;
      background: #FFFFFF;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      margin-bottom: 24px;
    }
    .classification-layout {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    .specimen-preview {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid var(--color-border);
      flex-shrink: 0;
      background: #E2E8F0;
      position: relative;
    }
    .specimen-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .specimen-badge {
      position: absolute;
      bottom: 4px;
      right: 4px;
      background: rgba(15, 23, 42, 0.75);
      color: #FFFFFF;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .classification-info {
      flex: 1;
    }
    .eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--color-muted);
      margin-bottom: 4px;
    }
    .condition-name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.2;
      margin-bottom: 10px;
    }
    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      margin-bottom: 14px;
    }
    .pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid var(--color-border);
    }
    .pill-risk {
      background: ${riskBg};
      color: ${riskColor};
      border-color: ${riskBorder};
    }
    .pill-icd {
      background: #F1F5F9;
      color: var(--color-text);
    }
    .confidence-wrapper {
      margin-top: 10px;
    }
    .confidence-meta {
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      margin-bottom: 4px;
    }
    .confidence-bar-bg {
      height: 8px;
      background: #E2E8F0;
      border-radius: 999px;
      overflow: hidden;
    }
    .confidence-bar-fill {
      height: 100%;
      background: var(--color-teal);
      width: ${result.confidence}%;
      border-radius: 999px;
    }
    .risk-summary-text {
      font-size: 12px;
      color: var(--color-muted);
      font-style: italic;
      margin-top: 8px;
    }

    /* Section Cards */
    .section-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title span.indicator {
      display: inline-block;
      width: 4px;
      height: 14px;
      background: var(--color-primary);
      border-radius: 2px;
    }

    .two-col-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .panel {
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: 12px;
      padding: 18px;
    }

    /* Morphology 2x2 */
    .morph-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      background: #F8FAFC;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 12px;
      margin-top: 10px;
      font-size: 11px;
    }
    .morph-label {
      font-family: 'JetBrains Mono', monospace;
      color: var(--color-muted);
      font-size: 10px;
    }
    .morph-val {
      font-weight: 600;
      text-transform: capitalize;
      color: var(--color-text);
    }

    /* Bullet lists */
    ul.clinical-list {
      list-style: none;
      font-size: 12px;
      color: #334155;
    }
    ul.clinical-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 6px;
    }
    ul.clinical-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--color-teal);
      font-weight: bold;
    }

    /* Differential Table */
    table.diff-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 24px;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      overflow: hidden;
    }
    table.diff-table th {
      background: #F8FAFC;
      text-align: left;
      padding: 10px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--color-muted);
      border-bottom: 1px solid var(--color-border);
    }
    table.diff-table td {
      padding: 10px 14px;
      border-bottom: 1px solid #F1F5F9;
    }
    table.diff-table tr:last-child td {
      border-bottom: none;
    }

    /* Recommended Actions Timeline */
    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 24px;
    }
    .action-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #F8FAFC;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 12px;
    }
    .priority-pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-transform: uppercase;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .priority-immediate {
      background: #FEF2F2;
      color: #DC2626;
      border: 1px solid #FECACA;
    }
    .priority-soon {
      background: #FFFBEB;
      color: #D97706;
      border: 1px solid #FDE68A;
    }
    .priority-routine {
      background: #ECFDF5;
      color: #059669;
      border: 1px solid #A7F3D0;
    }

    /* Self Care and Avoid */
    .care-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .care-box {
      border-radius: 10px;
      padding: 16px;
      font-size: 12px;
    }
    .care-box.positive {
      background: #F0FDF4;
      border: 1px solid #BBF7D0;
      color: #166534;
    }
    .care-box.negative {
      background: #FEF2F2;
      border: 1px solid #FECACA;
      color: #991B1B;
    }
    .care-box h4 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .care-box ul {
      list-style: none;
      padding-left: 0;
    }
    .care-box ul li {
      margin-bottom: 6px;
      padding-left: 18px;
      position: relative;
      line-height: 1.4;
    }
    .care-box.positive ul li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
    }
    .care-box.negative ul li::before {
      content: "✗";
      position: absolute;
      left: 0;
      color: #DC2626;
      font-weight: bold;
    }

    /* Urgency Banner */
    .urgency-banner {
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .urgency-desc {
      font-size: 12px;
      color: #92400E;
    }
    .urgency-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: #F59E0B;
      color: #FFFFFF;
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
    }

    /* Disclaimer Box */
    .disclaimer-card {
      background: #FEF3C7;
      border: 1px solid #FDE68A;
      border-radius: 10px;
      padding: 16px;
      font-size: 11px;
      color: #92400E;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .disclaimer-card strong {
      font-family: 'JetBrains Mono', monospace;
      display: block;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    /* Report Footer Stamp */
    .report-footer {
      border-top: 1px solid var(--color-border);
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: var(--color-muted);
      font-family: 'JetBrains Mono', monospace;
    }

    /* Print Optimizations */
    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .report-container {
        box-shadow: none;
        border: none;
        max-width: 100%;
      }
      .report-body {
        padding: 0;
      }
      .page-break-avoid {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      @page {
        margin: 12mm 15mm;
        size: A4 portrait;
      }
    }
  </style>
</head>
<body>

  <div class="report-container">
    
    <!-- Top toolbar for browser view -->
    <div class="doc-actions no-print">
      <div>
        <span>Clinical Dossier &bull; <strong>${reportId}</strong></span>
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>

    <div class="report-body">
      
      <!-- 1. Clinical Header -->
      <div class="clinical-header">
        <div>
          <div class="brand-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F6FBF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M3 12h18"/>
              <path d="M12 3v18"/>
            </svg>
            <span>DermoScan</span>
          </div>
          <div class="brand-sub">Clinical Cutaneous Intelligence &amp; Screening Dossier</div>
        </div>

        <div class="meta-box">
          <div>Report Ref: <strong>${reportId}</strong></div>
          <div>Issued: <strong>${timestamp}</strong></div>
          <div>Session UUID: <strong>${effectiveSessionId.substring(0, 13)}...</strong></div>
          <div>Engine: <strong>Autonomous Cutaneous Vision Engine</strong></div>
        </div>
      </div>

      <!-- 2. Patient / Specimen Context Intake -->
      <div class="intake-grid page-break-avoid">
        <div class="intake-item">
          <div class="intake-label">Anatomical Region</div>
          <div class="intake-value">${submission?.bodyLocation || 'Not specified'}</div>
        </div>
        <div class="intake-item">
          <div class="intake-label">Chronicity / Duration</div>
          <div class="intake-value">${submission?.duration || 'Not specified'}</div>
        </div>
        <div class="intake-item">
          <div class="intake-label">Reported Sensations</div>
          <div class="intake-value">
            ${
              submission?.symptoms && submission.symptoms.length > 0
                ? submission.symptoms.map((s) => `<span class="symptom-tag">${s}</span>`).join('')
                : '<span style="color:#94a3b8">None noted</span>'
            }
          </div>
        </div>
        <div class="intake-item">
          <div class="intake-label">Clinical Notes</div>
          <div class="intake-value" style="font-weight: normal; font-size: 11px;">
            ${submission?.notes ? submission.notes.substring(0, 80) : 'None provided'}
          </div>
        </div>
      </div>

      <!-- 3. Primary Classification Hero Card (with specimen image) -->
      <div class="classification-card page-break-avoid">
        <div class="classification-layout">
          
          <!-- Specimen Photo -->
          <div class="specimen-preview">
            ${
              imageSrc
                ? `<img src="${imageSrc}" alt="Specimen Macro Photo" />`
                : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:11px;">No Specimen</div>`
            }
            <div class="specimen-badge">Specimen #1</div>
          </div>

          <!-- Classification Details -->
          <div class="classification-info">
            <div class="eyebrow">Primary Cutaneous Classification</div>
            <div class="condition-name">${result.classification}</div>
            
            <div class="badges-row">
              <span class="pill pill-icd">ICD-10: ${result.icd_code}</span>
              <span class="pill pill-risk">${result.risk_level.toUpperCase()} RISK TIER</span>
              <span class="pill" style="background:#F1F5F9; color:#475569;">Urgency: ${result.see_doctor_urgency}</span>
            </div>

            <!-- Confidence Bar -->
            <div class="confidence-wrapper">
              <div class="confidence-meta">
                <span>AI Morphological Pattern Confidence</span>
                <strong style="color:var(--color-teal);">${result.confidence}%</strong>
              </div>
              <div class="confidence-bar-bg">
                <div class="confidence-bar-fill"></div>
              </div>
            </div>

            <div class="risk-summary-text">
              &ldquo;${result.risk_summary}&rdquo;
            </div>
          </div>

        </div>
      </div>

      <!-- 4. Clinical Details & Morphology 2x2 Grid -->
      <div class="two-col-grid page-break-avoid">
        
        <!-- Left: Clinical Observation & Morphology -->
        <div class="panel">
          <div class="section-title">
            <span class="indicator"></span>
            <span>Clinical Observation</span>
          </div>
          <p style="font-size: 12px; color: #334155; line-height: 1.6; margin-bottom: 12px;">
            ${result.clinical_description}
          </p>

          <div style="font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:var(--color-muted); text-transform:uppercase;">
            Morphological Biomarkers
          </div>
          <div class="morph-grid">
            <div>
              <div class="morph-label">Primary Lesion</div>
              <div class="morph-val">${result.morphology.primary_lesion}</div>
            </div>
            <div>
              <div class="morph-label">Border Boundary</div>
              <div class="morph-val">${result.morphology.border}</div>
            </div>
            <div>
              <div class="morph-label">Visual Color</div>
              <div class="morph-val">${result.morphology.color}</div>
            </div>
            <div>
              <div class="morph-label">Distribution</div>
              <div class="morph-val">${result.morphology.distribution}</div>
            </div>
          </div>
        </div>

        <!-- Right: Etiological Factors & Triggers -->
        <div class="panel">
          <div class="section-title">
            <span class="indicator" style="background:var(--color-teal);"></span>
            <span>Etiology &amp; Triggers</span>
          </div>

          <div style="font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:var(--color-muted); text-transform:uppercase; margin-bottom: 6px;">
            Known Etiological Factors:
          </div>
          <ul class="clinical-list" style="margin-bottom: 14px;">
            ${result.common_causes.map((c) => `<li>${c}</li>`).join('')}
          </ul>

          <div style="font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:var(--color-muted); text-transform:uppercase; margin-bottom: 6px;">
            Documented Triggers:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${result.triggers
              .map(
                (t) =>
                  `<span style="background:#FFFBEB; border:1px solid #FDE68A; color:#B45309; font-size:11px; padding:2px 8px; border-radius:4px; font-weight:500;">${t}</span>`
              )
              .join('')}
          </div>
        </div>

      </div>

      <!-- 5. Differential Diagnoses Matrix -->
      <div class="page-break-avoid">
        <div class="section-title">
          <span class="indicator"></span>
          <span>Differential Diagnoses Matrix</span>
        </div>
        <table class="diff-table">
          <thead>
            <tr>
              <th style="width: 45%;">Condition Name</th>
              <th style="width: 25%;">Calculated Likelihood</th>
              <th style="width: 30%;">Clinical Characteristic</th>
            </tr>
          </thead>
          <tbody>
            ${result.differential_diagnoses
              .map((d) => {
                const badgeColor =
                  d.likelihood === 'high'
                    ? 'background:#FEF2F2; color:#DC2626; border:1px solid #FECACA;'
                    : d.likelihood === 'moderate'
                    ? 'background:#FFFBEB; color:#D97706; border:1px solid #FDE68A;'
                    : 'background:#ECFDF5; color:#059669; border:1px solid #A7F3D0;';
                return `<tr>
                  <td><strong>${d.name}</strong></td>
                  <td><span style="display:inline-block; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; text-transform:uppercase; padding:2px 8px; border-radius:4px; ${badgeColor}">${d.likelihood} Likelihood</span></td>
                  <td style="color:#64748B;">Shares visual margins &amp; cutaneous appearance</td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- 6. Recommended Clinical Actions -->
      <div class="page-break-avoid">
        <div class="section-title">
          <span class="indicator"></span>
          <span>Recommended Next Steps &amp; Action Plan</span>
        </div>
        <div class="actions-list">
          ${result.recommended_actions
            .map((act) => {
              const pClass = `priority-${act.priority}`;
              const pLabel =
                act.priority === 'immediate'
                  ? 'Immediate Action'
                  : act.priority === 'soon'
                  ? 'Within 7 Days'
                  : 'At Convenience';
              return `<div class="action-card">
                <span>${act.action}</span>
                <span class="priority-pill ${pClass}">${pLabel}</span>
              </div>`;
            })
            .join('')}
        </div>
      </div>

      <!-- 7. Self Care & What to Avoid -->
      <div class="care-grid page-break-avoid">
        <div class="care-box positive">
          <h4>✓ Recommended Self-Care Measures</h4>
          <ul>
            ${result.self_care_tips.map((tip) => `<li>${tip}</li>`).join('')}
          </ul>
        </div>

        <div class="care-box negative">
          <h4>✗ Contraindicated Actions (What to Avoid)</h4>
          <ul>
            ${result.avoid.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>

      <!-- 8. Physician Consultation Advisory -->
      <div class="urgency-banner page-break-avoid">
        <div>
          <div style="font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:13px; color:#92400E; margin-bottom:2px;">
            Physician Consultation Advisory
          </div>
          <div class="urgency-desc">${result.see_doctor_reason}</div>
        </div>
        <div class="urgency-badge">${urgencyLabel}</div>
      </div>

      <!-- 9. Mandatory Disclaimers -->
      <div class="disclaimer-card page-break-avoid">
        <strong>⚠️ Simulated Clinical Intelligence &bull; Educational Use Only</strong>
        This document represents an AI-assisted pattern screening simulation produced by DermoScan. It does NOT constitute a confirmed medical diagnosis, biopsy report, or clinical prescription. Cutaneous diseases present with significant heterogeneity. Always consult a board-certified dermatologist for clinical diagnosis, dermoscopy, or biopsy evaluation.
      </div>

      <!-- 10. Footer Authentication Stamp -->
      <div class="report-footer">
        <div>Generated by DermoScan v1.0 &bull; Autonomous Vision Engine</div>
        <div>Certified Educational Output &bull; Confidential</div>
      </div>

    </div>
  </div>

</body>
</html>`;
}
