import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button as FluentButton,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from '@fluentui/react-components';
import { Copy24Regular } from '@fluentui/react-icons';
import { CompanyJsonViewerProps } from '../../types/company';
import { useCompanyJsonViewerStyles } from '../../styles/companyJsonViewer.styles';
import { getString } from '../../utils/translationHelper';

const CompanyJsonViewer: React.FC<CompanyJsonViewerProps> = ({
  isOpen,
  onClose,
  company,
  context
}) => {
  const styles = useCompanyJsonViewerStyles();
  const { dispatchToast } = useToastController();

  const handleCopyJson = async () => {
    if (!company) return;

    try {
      const jsonString = JSON.stringify(company, null, 2);
      await navigator.clipboard.writeText(jsonString);

      dispatchToast(
        <Toast>
          <ToastTitle>{getString(context, 'json.copySuccess')}</ToastTitle>
          <ToastBody>{getString(context, 'json.copySuccessDescription')}</ToastBody>
        </Toast>,
        { intent: 'success', timeout: 3000, position: 'top-end' }
      );
    } catch (error) {
      dispatchToast(
        <Toast>
          <ToastTitle>{getString(context, 'json.copyFailed')}</ToastTitle>
          <ToastBody>{getString(context, 'json.copyFailedDescription')}</ToastBody>
        </Toast>,
        { intent: 'error', timeout: 3000, position: 'top-end' }
      );
    }
  };

  const handleOpenChange = (_event: React.SyntheticEvent, data: { open: boolean }) => {
    if (!data.open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogSurface aria-labelledby='json-dialog-title'>
        <DialogBody>
          <DialogTitle id='json-dialog-title'>
            {getString(context, 'json.title')} - {company?.navn}
          </DialogTitle>
          <DialogContent>
            <div className={styles.jsonViewer}>
              {company ? JSON.stringify(company, null, 2) : getString(context, 'json.noCompanySelected')}
            </div>
          </DialogContent>
          <DialogActions>
            <FluentButton
              appearance='secondary'
              icon={<Copy24Regular />}
              onClick={handleCopyJson}
              disabled={!company}
            >
              {getString(context, 'json.copyButton')}
            </FluentButton>
            <FluentButton appearance='primary' onClick={onClose}>
              {getString(context, 'json.closeButton')}
            </FluentButton>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default CompanyJsonViewer;