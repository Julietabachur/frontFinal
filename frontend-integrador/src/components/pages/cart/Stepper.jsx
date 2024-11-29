

import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { useNavigate, Outlet, useOutletContext } from "react-router-dom";

const steps = [
  { title: "Cart", path: "/checkout/cart" },
  { title: "Shipping", path: "/checkout/shipping" },
  { title: "Payment", path: "/checkout/payment" },
  { title: "Success", path: "/checkout/success" },
];

const buttonLabels = [
  "Confirmar carrito",
  "Confirmar envío",
  "Confirmar compra",
  "Finalizar",
];

const CheckoutStepper = () => {
  const navigate = useNavigate();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });
  const [isShippingValid, setIsShippingValid] = useState(false);

  // New prop to pass a validation function from child component
  const [childValidationFunc, setChildValidationFunc] = useState(null);

  const goToNext = async () => {
    // If a child validation function exists, run it first
    if (childValidationFunc) {
      const isValid = await childValidationFunc();
      if (!isValid) return;
    }

    if (activeStep === 1 && !isShippingValid) {
      alert("Por favor, complete el formulario de envío.");
      return;
    }

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
    <Box minHeight="90vh"  my={4}>
      <Box maxWidth="900px" mx="auto" mb={8}>
        <Stepper index={activeStep} colorScheme="yellow" mb={8}>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                  title={<Text ml={2}>{step.title}</Text>}
                />
              </StepIndicator>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box display="flex" flexDirection="column" mb={8}>
        <Box flexGrow={1}>
          <Outlet 
            context={{ 
              setValid: setIsShippingValid, 
              setChildValidationFunc 
            }} 
          />
        </Box>
      </Box>
      <HStack justify="center" spacing={4}>
        {activeStep !== steps.length - 1 && (
          <>
          {activeStep !== 0 && activeStep !== steps.length - 1 && (
            <Button onClick={goToPrev} backgroundColor="#e1bc6a"
            color="white"
            _hover={{ backgroundColor: "#d3a45a" }}>
              Anterior
            </Button>
          )}
        <Button
          onClick={goToNext}
          isDisabled={
            activeStep === steps.length - 1 && buttonLabels[activeStep] !== "Finalizar"
          }
          backgroundColor="#e1bc6a"
          color="white"
          _hover={{ backgroundColor: "#d3a45a" }}
        >
          {buttonLabels[activeStep]}
        </Button>
        </>)}
      </HStack>
    </Box>
  );
};

export default CheckoutStepper;