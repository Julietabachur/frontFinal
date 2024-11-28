import React from 'react'
import styled from 'styled-components'
import "./PaymentLoading.css"

const PaymentLoading = () => {

    
  return (<>
    <StyledWrapper>
      <div className="loader">
        <div className="loading-text">
          Procesando<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
        </div>
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