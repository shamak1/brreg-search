import { useState } from 'react';

export const useSearchBrregDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);
  
  const openJsonDialog = () => setIsJsonDialogOpen(true);
  const closeJsonDialog = () => {
    setIsJsonDialogOpen(false);
    setTimeout(() => {
      const mainDialog = document.querySelector('[aria-labelledby="dialog-title"]');
      if (mainDialog) {
        (mainDialog as HTMLElement).focus();
      }
    }, 100);
  };
  
  const openMapDialog = () => setIsMapDialogOpen(true);
  const closeMapDialog = () => {
    setIsMapDialogOpen(false);
    setTimeout(() => {
      const mainDialog = document.querySelector('[aria-labelledby="dialog-title"]');
      if (mainDialog) {
        (mainDialog as HTMLElement).focus();
      }
    }, 100);
  };

  return {
    isOpen,
    isJsonDialogOpen,
    isMapDialogOpen,
    openDialog,
    closeDialog,
    openJsonDialog,
    closeJsonDialog,
    openMapDialog,
    closeMapDialog,
  };
};