import { useState } from 'react';

export const useAlert = () => {
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('Default error message');
  return { opened, setOpened, message, setMessage, error, setError };
};
