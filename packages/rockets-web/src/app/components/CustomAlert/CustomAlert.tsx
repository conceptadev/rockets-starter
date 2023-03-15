import React from 'react';
import { Alert, Snackbar } from '@mui/material';

interface AlertProps {
  message: string;
  icon: React.ReactNode;
  status: boolean;
  close: () => void;
}

const CustomAlert: React.FC<AlertProps> = ({
  message,
  icon,
  status,
  close,
}) => {
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={close}
        autoHideDuration={3000}
        open={status}
      >
        <Alert icon={icon} severity="error">
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomAlert;
