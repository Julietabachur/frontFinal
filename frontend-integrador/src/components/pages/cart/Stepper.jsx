import React, { useState } from 'react';
import { 
  Box, 
  Stepper, 
  Step, 
  StepIndicator, 
  StepStatus, 
  StepIcon, 
  StepNumber, 
  StepSeparator,
  useSteps,
  Button,
  HStack,
  Text,
  theme
} from "@chakra-ui/react";
import { useNavigate, Outlet } from "react-router-dom";

const steps = [
  { title: "Cart", path: "/checkout/cart" },
  { title: "Shipping", path: "/checkout/shipping" },
  { title: "Payment", path: "/checkout/payment" },
  { title: "Success", path: "/checkout/success" }
];

const CheckoutStepper = () => {
  const navigate = useNavigate();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length
  });

  const goToNext = () => {
    if (activeStep < steps.length - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      navigate(steps[nextStep].path);
    }
  };

  const goToPrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      navigate(steps[prevStep].path);
    }
  };

  return (
    <Box my={4}> {/* Adds margin top and bottom */}
      <Box maxWidth="900px" mx="auto" mb={8}> {/* Sets max width and centers the Stepper */}
        <Stepper index={activeStep} mb={8}style={{ borderColor: "#e1bc6a" }} >
          {steps.map((step, index) => (
            <Step key={index} >
              <StepIndicator style={{ backgroundColor: "#e1bc6a" }} >
                <StepStatus  style={{
                    // Use border-color for different states based on activeStep
                    borderColor: activeStep === index ? "#e1bc6a" : "#e1bc6a", // Active: blue, Inactive: base color
                  }}
                  complete={<StepIcon style={{ backgroundColor: "#e1bc6a" }}/>}
                  incomplete={<StepNumber style={{ backgroundColor: "#e1bc6a"}}/>}
                  active={<StepNumber style={{ backgroundColor: theme}}/>}
                  title={
                    <Box display="flex" alignItems="center">
                      
                      <Text ml={2} >{step.title}</Text> {/* Adds the title next to the number */}
                    </Box>
                  }
                />
              </StepIndicator>
              <StepSeparator style={{ backgroundColor: "#e1bc6a" }}/>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <Box display="flex" flexDirection="column" mb={8}>
        <Box flexGrow={1}>
          {/* This is the Outlet, where child route content will be rendered */}
          <Outlet />
        </Box>
      </Box>
      
      <HStack justify="center" spacing={4}>
        <Button onClick={goToPrev} isDisabled={activeStep === 0}>
          Anterior
        </Button>
        <Button onClick={goToNext} isDisabled={activeStep === steps.length - 1}>
          Siguiente
        </Button>
      </HStack>
    </Box>
  );
};

export default CheckoutStepper;
