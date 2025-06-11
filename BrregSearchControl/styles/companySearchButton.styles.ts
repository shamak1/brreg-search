import { makeStyles, tokens } from '@fluentui/react-components';

export const useCompanySearchButtonStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'relative',
  },
  dialogActions: {
    gap: '16px',
    marginTop: '24px',
    '@media (max-width: 768px)': {
      gap: '8px',
    },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    opacity: 0.95,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    zIndex: 9999,
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
});
