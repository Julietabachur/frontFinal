import React from 'react'
import styled from 'styled-components'
import "./PaymentLoading.css"
import { AiFillSecurityScan } from "react-icons/ai";
import { Box } from '@chakra-ui/react';

const PaymentLoading = () => {

    
  return (<>
    <StyledWrapper>
      <div className="loader">
        <Box className="loading-text" display={'flex'} flexDirection={'column'} alignItems={'center'}>
        <AiFillSecurityScan color='black' fontSize={'35px'}/>
        <Box>
        Verificando la conexión segura<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></Box>
        </Box>
        <div className="loading-bar-background">
          <div className="loading-bar">
            <div className="white-bars-container">
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
              <div className="white-bar" />
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  </>
  )
}

export default PaymentLoading

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

`;