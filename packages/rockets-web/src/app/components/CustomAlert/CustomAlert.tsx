import React from 'react';
import { Alert } from '@mui/material';

interface AlertProps {
  message: string;
  icon: React.ReactNode;
  status: boolean;
}

const CustomAlert: React.FC<AlertProps> = ({ message, icon, status }) => {
  return (
    <>
      {status && (
        <Alert icon={icon} severity="error">
          {message}
        </Alert>
      )}
    </>
  );
};

export default CustomAlert;
