import { makeStyles, tokens } from '@fluentui/react-components';

export const useCompanyFormStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '2px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '6px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fullWidthField: {
    gridColumn: '1 / -1',
  },
  iconColor: {
    color: '#0078d4',
  },
  responsiveInput: {
    width: '100%',
  },
});
