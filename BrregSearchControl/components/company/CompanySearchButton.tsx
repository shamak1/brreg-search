import React from 'react';
import {
  Button as FluentButton,
  SplitButton,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';
import { Search24Regular, Organization24Regular, Building24Regular } from '@fluentui/react-icons';
import { getSearchButtonText, getSearchIcon } from '../../utils/searchTypeUtils';
import { useCompanySearchStyles } from '../../styles/companySearch.styles';
import { CompanySearchButtonComponentProps } from '../../types/company';
import { getString } from '../../utils/translationHelper';

const CompanySearchButton: React.FC<CompanySearchButtonComponentProps> = ({
  onSearch,
  isSearching,
  searchQuery,
  disabled,
  enableAdvancedSearch,
  searchType,
  onSearchTypeChange,
  context
}) => {
  const styles = useCompanySearchStyles();
  const SearchIcon = getSearchIcon(searchType);

  if (enableAdvancedSearch) {
    return (
      <Menu positioning='below-end'>
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps) => (
            <SplitButton
              className={styles.searchButton}
              appearance='primary'
              icon={<SearchIcon />}
              primaryActionButton={{
                onClick: onSearch,
                disabled: isSearching || !searchQuery.trim() || disabled,
                'aria-label': `${getString(context, 'search.menu.searchBy')} ${searchType === 'orgNumber' ? getString(context, 'form.labels.organizationNumber') : searchType === 'industry' ? getString(context, 'form.sections.industrycode') : getString(context, 'form.labels.companyName')}`
              }}
              menuButton={{
                ...triggerProps,
                disabled: disabled,
                'aria-label': getString(context, 'search.ariaLabel.changeSearchType')
              }}
            >
              {getSearchButtonText(isSearching, searchType, context)}
            </SplitButton>
          )}
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<Search24Regular />}
              onClick={() => onSearchTypeChange && onSearchTypeChange('name')}
              disabled={disabled}
            >
              {getString(context, 'search.menu.searchByCompanyName')}
            </MenuItem>
            <MenuItem
              icon={<Organization24Regular />}
              onClick={() => onSearchTypeChange && onSearchTypeChange('orgNumber')}
              disabled={disabled}
            >
              {getString(context, 'search.menu.searchByOrgNumber')}
            </MenuItem>
            <MenuItem
              icon={<Building24Regular />}
              onClick={() => onSearchTypeChange && onSearchTypeChange('industry')}
              disabled={disabled}
            >
              {getString(context, 'search.button.searchByIndustry')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  }

  return (
    <FluentButton
      className={styles.searchButton}
      appearance='primary'
      icon={<Search24Regular />}
      onClick={onSearch}
      disabled={isSearching || !searchQuery.trim() || disabled}
      aria-label={getString(context, 'search.ariaLabel.searchButton')}
    >
      {isSearching ? getString(context, 'search.button.searching') : getString(context, 'search.button.search')}
    </FluentButton>
  );
};

export default CompanySearchButton;
