import React from 'react';
import { Input } from '@fluentui/react-components';
import { formatOrganizationNumber, autoFormatIndustryCode } from '../../utils/inputFormattingUtils';
import { getInputPlaceholder, getInputMaxLength, getAriaLabel } from '../../utils/searchTypeUtils';
import { useCompanySearchStyles } from '../../styles/companySearch.styles';
import { CompanySearchInputComponentProps } from '../../types/company';
import { getString } from '../../utils/translationHelper';

const CompanySearchInput: React.FC<CompanySearchInputComponentProps> = ({
  searchQuery,
  onSearchQueryChange,
  onKeyPress,
  searchType,
  isSearching,
  disabled,
  context
}) => {
  const styles = useCompanySearchStyles();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = event.target.value;
    
    if (searchType === 'orgNumber') {
      const formattedValue = formatOrganizationNumber(value);
      onSearchQueryChange(formattedValue);
    } else if (searchType === 'industry') {
      const formattedValue = autoFormatIndustryCode(value);
      onSearchQueryChange(formattedValue);
    } else {
      onSearchQueryChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onKeyPress?.(event as React.KeyboardEvent);
    }
  };

  return (
    <Input
      className={styles.searchInput}
      placeholder={disabled ? getString(context, 'search.placeholder.disabled') : getInputPlaceholder(searchType, context)}
      value={searchQuery}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      disabled={isSearching || disabled}
      maxLength={getInputMaxLength(searchType)}
      aria-label={getAriaLabel(searchType, context)}
      autoComplete='off'
    />
  );
};

export default CompanySearchInput;
