import * as React from 'react';
import { Link } from 'react-router-dom';

import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';

import Signup from './components/Signup';
import BankDetails from './components/BankDetails';
import PersonalDetails from './components/PersonalDetails';
import BusinessDetails from './components/BusinessDetails';

const steps = ['Signup', 'Personal Details', 'Business Details', 'Bank Details'];

export default function JwtRegisterView() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formFeild, setFormFeild] = React.useState({});

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Typography variant="h4">Register to Return 2 Success</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Already have an account?</Typography>

        <Link to="/auth/jwt/login" variant="subtitle2">
          Login
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderHead}
      <Stack sx={{ width: '100%', mb: 4 }} spacing={4}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>

      {activeStep === 0 && <Signup setActiveStep={setActiveStep} setFormFeild={setFormFeild} />}
      {activeStep === 1 && (
        <PersonalDetails
          setActiveStep={setActiveStep}
          setFormFeild={setFormFeild}
          formFeild={formFeild}
        />
      )}
      {activeStep === 2 && (
        <BusinessDetails
          setActiveStep={setActiveStep}
          setFormFeild={setFormFeild}
          formFeild={formFeild}
        />
      )}
      {activeStep === 3 && (
        <BankDetails
          setActiveStep={setActiveStep}
          setFormFeild={setFormFeild}
          formFeild={formFeild}
        />
      )}
    </>
  );
}
