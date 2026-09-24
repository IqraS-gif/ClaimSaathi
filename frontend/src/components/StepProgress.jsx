export default function StepProgress({ steps, currentStep }) {
  // steps: [{ label: string }]
  // currentStep: 1-indexed number
  return (
    <div className="step-progress">
      {steps.map((step, i) => {
        const num   = i + 1
        const done  = num < currentStep
        const active = num === currentStep
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
            <div className={`sp-step${active ? ' active' : ''}${done ? ' done' : ''}`}>
              <div className="sp-num">
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : num}
              </div>
              <span className="sp-label">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`sp-connector${done ? ' done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
