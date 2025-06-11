import { makeStyles } from '@fluentui/react-components';

export const useCompanySearchStyles = makeStyles({
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  searchInputContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    width: '100%',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    width: '100%',
  },
  searchButton: {
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    '@media (max-width: 768px)': {
      width: '100%',
      '& > *': {
        width: '100%',
      },
      '& button': {
        width: '100%',
      },
      '& [role="splitbutton"]': {
        width: '100%',
      }
    },
  },
  resultsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  companySelectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  companySelectionContainerFullWidth: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  companyActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
      '& > *': {
        width: '100%',
      },
    },
  },
  dropdownContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  dropdownContainerFullWidth: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  companyDropdown: {
    width: '100%',
  },
});
