import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import './VerticalLinearStepper.scss';
import { Alert, AlertTitle } from '@mui/material';

export default function VerticalLinearStepper({initialStep = 0, steps, completed, onStepChange, canSkipStep}) {

  const [activeStep, setActiveStep] = React.useState(initialStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    onStepChange(activeStep + 1)
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    onStepChange(activeStep - 1)
  };

  const handleReset = () => {
    setActiveStep(0);
    onStepChange(0)
  };

  return <VerticalLinearStepperBody steps={steps} completed={completed} activeStep={activeStep} onClickNext={handleNext} canSkipStep={canSkipStep} onClickPrev={handlePrev} onClickReset={handleReset} onChangeStep={(step) => {
    setActiveStep(step);
    onStepChange(step)
  }} />
}

export function VerticalLinearStepperBody({ canSkipStep, onChangeStep, completed, steps, activeStep, onClickNext, onClickPrev, onClickReset }) {

  function renderStepText(step, index) {
    if(step.nextButtonText) {
      return step.nextButtonText
    } else if(index === steps.length - 1) {
      return 'Finish'
    } else {
      return 'Continue'
    }
  }

  function renderContinueError(disabledEl) {
     return disabledEl && <Alert severity='warning'><AlertTitle>Warning</AlertTitle>{disabledEl}</Alert>
  }

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => {

          let disabled = false;
          let disabledEl;
          if(step.shouldContinueBeDisabledCheck) {
            disabledEl = step.shouldContinueBeDisabledCheck()
            disabled = !!disabledEl
          }

          if(step.break) return <Step key={step.stepId} >
            {step.title}
            <StepContent>
              <Button
                disabled={disabled}
                variant="contained"
                onClick={() => {
                  if(step.onClickNext) {
                    step.onClickNext()
                  }
                  onClickNext()
                }}
                sx={{ mt: 1, mr: 1 }}
              >Next</Button>
              {disabled && renderContinueError(disabledEl)}
            </StepContent>
          </Step>

          return <Step key={step.stepId} >
            <StepLabel
              onClick={() => {
                if(canSkipStep) onChangeStep(index)
              }}
              entityModels={{root: "VerticalLinearStepper__step-number"}} 
              optional={
                index === steps.length-1 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.title}
            </StepLabel>
            <StepContent>
             {step.instructions}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    disabled={disabled}
                    variant="contained"
                    onClick={() => {
                      if(step.onClickNext) {
                        step.onClickNext()
                      }
                      onClickNext()
                    }}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {renderStepText(step, index)}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={onClickPrev}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
                {disabled && renderContinueError(disabledEl)}
              </Box>
            </StepContent>
          </Step>
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>{completed}</Typography>
          <Button onClick={onClickReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
}