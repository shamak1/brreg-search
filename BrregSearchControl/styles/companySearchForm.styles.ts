import { makeStyles, tokens } from '@fluentui/react-components';

export const useCompanySearchFormStyles = makeStyles({
  rootContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  formWrapper: {
    backgroundColor: tokens.colorNeutralBackground1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  formActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    '@media (max-width: 768px)': {
      flexDirection: 'column-reverse',
      gap: '8px',
    },
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '8px',
    color: tokens.colorNeutralForeground1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground1,
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    zIndex: 1000,
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
});
