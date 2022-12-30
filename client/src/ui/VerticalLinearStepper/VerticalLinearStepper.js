import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function VerticalLinearStepper({initialStep = 0, steps, completed}) {

  const [activeStep, setActiveStep] = React.useState(initialStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrev = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return <VerticalLinearStepperBody steps={steps} completed={completed} activeStep={activeStep} onClickNext={handleNext} onClickPrev={handlePrev} onClickReset={handleReset} />
}

export function VerticalLinearStepperBody({ completed, steps, activeStep, onClickNext, onClickPrev, onClickReset }) {
  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel
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
                    variant="contained"
                    onClick={onClickNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={onClickPrev}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
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