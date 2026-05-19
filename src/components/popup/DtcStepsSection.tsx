import React from 'react';
import { DTC_STEPS_DATA } from '../../utils/DtcStepsData';

interface DtcStepsSectionProps {
  dtcCode: string | null | undefined;
  contextData: {
    componentCode?: string;
    componentName?: string;
    connectorCode?: string;
    circuitNumber?: string;
    [key: string]: any;
  };
}

const DtcStepsSection: React.FC<DtcStepsSectionProps> = ({ dtcCode, contextData }) => {
  if (!dtcCode) return null;

  // Use defined data or fallback to generic steps
  const dtcInfo = DTC_STEPS_DATA[dtcCode] || {
    code: dtcCode,
    name: "General Diagnostic Procedure",
    steps: [
      "Step 1 - Disconnect {connectorCode} from {componentName}",
      "Step 2 - Inspect {connectorCode} pins for dust, rust or corrosion",
      "Step 3 - Verify continuity for circuit {circuitNumber}",
      "Step 4 - Perform functional test on {componentName} ({componentCode})"
    ],
    probableCauses: [
      "Intermittent connection at {connectorCode}",
      "Internal fault in {componentName}",
      "Wiring harness damage on circuit {circuitNumber}"
    ]
  };
  
  const steps = dtcInfo.steps || [];

  const formatStep = (step: string) => {
    let formatted = step;
    
    // Define placeholder mappings
    const mappings: Record<string, string | undefined> = {
      "{componentCode}": contextData.componentCode,
      "{componentName}": contextData.componentName,
      "{connectorCode}": contextData.connectorCode,
      "{circuitNumber}": contextData.circuitNumber,
      "{harnessName}": contextData.harnessName,
      "{cavity}": contextData.cavity,
    };

    // Replace all placeholders
    Object.entries(mappings).forEach(([placeholder, value]) => {
      if (value) {
        formatted = formatted.split(placeholder).join(value);
      }
    });

    return formatted;
  };

  return (
    <div style={{ 
      marginTop: '20px', 
      padding: '16px', 
      backgroundColor: 'var(--bg-primary)', 
      borderRadius: '8px',
      borderLeft: '4px solid var(--accent-primary)',
      boxShadow: 'var(--card-shadow)'
    }}>
      <h4 style={{ 
        margin: '0 0 12px 0', 
        color: 'var(--accent-primary)', 
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '20px' }}>📋</span> DTC Steps: {dtcCode}
      </h4>
      
      {steps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {steps.map((step: string, index: number) => (
            <div key={index} style={{ 
              fontSize: '13px', 
              color: 'var(--text-primary)', 
              lineHeight: '1.5',
              padding: '8px',
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}>
              {formatStep(step)}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No specific steps defined for this code.</p>
      )}

      {dtcInfo.probableCauses && dtcInfo.probableCauses.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Probable Causes:</h5>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {dtcInfo.probableCauses.map((cause: string, index: number) => (
              <li key={index} style={{ marginBottom: '4px' }}>{formatStep(cause)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DtcStepsSection;
