import React from 'react';
import styled, { keyframes } from 'styled-components';
import PT from 'prop-types';

// Animation for rotating the spinner
const rotation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
`;

// Animation for fading in the spinner
const opacity = keyframes`
  from { opacity: 0.2; }
  to { opacity: 1; }
`;

// Styled component for the spinner
const StyledSpinner = styled.div`
  animation: ${opacity} 1s infinite linear;

  h3 {
    transform-origin: center center;
    animation: ${rotation} 1s infinite linear;
  }
`;

// Main Spinner component
 export default function Spinner  ({ on })  {
  
  if (!on) return null; // Do not render the spinner if `on` is false

  return (
    <StyledSpinner id="spinner">
      <h3>&nbsp;.</h3>&nbsp;&nbsp;&nbsp;Please wait...
    </StyledSpinner>
  );
};

// Prop validation for `on`
Spinner.propTypes = {
  on: PT.bool.isRequired, // The `on` prop must be a boolean and is required
};

