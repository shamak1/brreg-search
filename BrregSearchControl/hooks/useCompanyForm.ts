import { useCallback } from 'react';

export const useCompanyFormHandlers = (
  disabled: boolean,
  registrationDate: Date | null,
  onRegistrationDateChange: (date: Date | null) => void
) => {
  const handleDateSelect = useCallback((date: Date | null | undefined) => {
    if (!disabled) {
      onRegistrationDateChange(date || null);
    }
  }, [disabled, onRegistrationDateChange]);

  const handleDateKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Backspace' && registrationDate) {
      event.preventDefault();
      onRegistrationDateChange(null);
    }
  }, [disabled, registrationDate, onRegistrationDateChange]);

  return {
    handleDateSelect,
    handleDateKeyDown
  };
};
