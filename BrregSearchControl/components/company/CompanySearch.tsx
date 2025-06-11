import React from 'react';
import { MessageBar, MessageBarBody, MessageBarTitle } from '@fluentui/react-components';
import CompanySearchInput from './CompanySearchInput';
import CompanySearchButton from './CompanySearchButton';
import CompanyDropdown from './CompanyDropdown';
import CompanyActionButtons from './CompanyActionButtons';
import { CompanySearchProps } from '../../types/company';
import { useCompanySearchStyles } from '../../styles/companySearch.styles';
import { getString } from '../../utils/translationHelper';

const CompanySearch: React.FC<CompanySearchProps> = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  companies,
  selectedCompany,
  onCompanySelect,
  onViewJson,
  onViewMap,
  error,
  mode,
  showViewJsonButton,
  showViewMapButton,
  showExportExcelButton,
  enableAdvancedSearch,
  searchType,
  onSearchTypeChange,
  disabled = false,
  context
}) => {
  const styles = useCompanySearchStyles();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  const hasActionButtons = showViewJsonButton || showViewMapButton || showExportExcelButton;

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <CompanySearchInput
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
          onKeyPress={handleKeyPress}
          searchType={searchType}
          isSearching={isSearching}
          disabled={disabled}
          context={context}
        />
        <CompanySearchButton
          onSearch={onSearch}
          isSearching={isSearching}
          searchQuery={searchQuery}
          disabled={disabled}
          enableAdvancedSearch={enableAdvancedSearch}
          searchType={searchType}
          onSearchTypeChange={onSearchTypeChange}
          context={context}
        />
      </div>

      {error && (
        <MessageBar intent='error'>
          <MessageBarBody>
            <MessageBarTitle>{getString(context, 'errors.searchError')}</MessageBarTitle>
            {error}
          </MessageBarBody>
        </MessageBar>
      )}

      {mode === 'form' && (
        <div className={styles.companySelectionContainerFullWidth}>
          <CompanyDropdown
            companies={companies}
            selectedCompany={selectedCompany}
            onCompanySelect={onCompanySelect}
            isSearching={isSearching}
            disabled={disabled}
            fullWidth={true}
            context={context}
          />
          {hasActionButtons && (
            <CompanyActionButtons
              selectedCompany={selectedCompany}
              onViewJson={onViewJson}
              onViewMap={onViewMap}
              showViewJsonButton={showViewJsonButton}
              showViewMapButton={showViewMapButton}
              showExportExcelButton={showExportExcelButton}
              disabled={disabled}
              context={context}
            />
          )}
        </div>
      )}

      {mode === 'button' && companies.length > 0 && (
        <div className={styles.resultsSection}>
          <div className={hasActionButtons ? styles.companySelectionContainer : styles.companySelectionContainerFullWidth}>
            <CompanyDropdown
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={onCompanySelect}
              isSearching={isSearching}
              disabled={disabled}
              fullWidth={!hasActionButtons}
              context={context}
            />

            {hasActionButtons && (
              <CompanyActionButtons
                selectedCompany={selectedCompany}
                onViewJson={onViewJson}
                onViewMap={onViewMap}
                showViewJsonButton={showViewJsonButton}
                showViewMapButton={showViewMapButton}
                showExportExcelButton={showExportExcelButton}
                disabled={disabled}
                context={context}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySearch;
