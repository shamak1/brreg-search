import React, { useState } from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Toaster,
  Theme,
} from '@fluentui/react-components';
import CompanySearchForm from './company-form-mode/CompanySearchForm';
import CompanySearchButton from './company-button-mode/CompanySearchButton';
import CompanyJsonViewer from './json/CompanyJsonViewer';
import CompanyMapViewer from './map/CompanyMapViewer';
import { useSearchBrregDialog } from '../hooks/search-brreg/useSearchBrregDialog';
import { SearchBrregProps, AddressData } from '../types/company';
import { CompanyData } from '../types/company';

const SearchBrreg: React.FC<SearchBrregProps> = ({
  mode,
  onCompanySelected,
  pageSize,
  showTitle,
  showViewJsonButton,
  showViewMapButton,
  showExportExcelButton,
  enableAdvancedSearch,
  theme,
  country,
  context,
  disabled = false
}) => {
  const [selectedCompanyForViewers, setSelectedCompanyForViewers] = useState<CompanyData | null>(null);
  const [onAddressSelectedCallback, setOnAddressSelectedCallback] = useState<((addressData: AddressData) => void) | null>(null);
  
  const {
    isJsonDialogOpen,
    isMapDialogOpen,
    openJsonDialog,
    closeJsonDialog,
    openMapDialog,
    closeMapDialog,
  } = useSearchBrregDialog();

  const getFluentTheme = (): Theme => {
    switch (theme) {
      case 'webDark':
        return webDarkTheme;
      case 'teamsLight':
        return teamsLightTheme;
      case 'teamsDark':
        return teamsDarkTheme;
      case 'teamsHighContrast':
        return teamsHighContrastTheme;
      case 'webLight':
      default:
        return webLightTheme;
    }
  };

  const fluentTheme = getFluentTheme();

  const handleViewJson = (company: CompanyData): void => {
    setSelectedCompanyForViewers(company);
    openJsonDialog();
  };

  const handleViewMap = (company: CompanyData, onAddressSelected?: (addressData: AddressData) => void): void => {
    setSelectedCompanyForViewers(company);
    setOnAddressSelectedCallback(() => onAddressSelected || null);
    openMapDialog();
  };

  const handleAddressSelected = (addressData: AddressData): void => {
    if (onAddressSelectedCallback) {
      onAddressSelectedCallback(addressData);
    }
  };

  if (mode === 'form') {
    return (
      <CompanySearchForm
        onCompanySelected={onCompanySelected}
        pageSize={pageSize}
        showTitle={showTitle}
        showViewJsonButton={showViewJsonButton}
        showViewMapButton={showViewMapButton}
        showExportExcelButton={showExportExcelButton}
        enableAdvancedSearch={enableAdvancedSearch}
        theme={theme}
        disabled={disabled}
        country={country}
        context={context}
      />
    );
  }

  return (
    <FluentProvider theme={fluentTheme}>
      <Toaster />
      <CompanySearchButton
        onCompanySelected={onCompanySelected}
        pageSize={pageSize}
        showTitle={showTitle}
        showViewJsonButton={showViewJsonButton}
        showViewMapButton={showViewMapButton}
        showExportExcelButton={showExportExcelButton}
        enableAdvancedSearch={enableAdvancedSearch}
        onViewJson={handleViewJson}
        onViewMap={handleViewMap}
        country={country}
        context={context}
      />

      {/* JSON and Map viewers */}
      {showViewJsonButton && (
        <CompanyJsonViewer
          isOpen={isJsonDialogOpen}
          onClose={closeJsonDialog}
          company={selectedCompanyForViewers}
          context={context}
        />
      )}

      {showViewMapButton && (
        <CompanyMapViewer
          isOpen={isMapDialogOpen}
          onClose={closeMapDialog}
          company={selectedCompanyForViewers}
          country={country}
          onAddressSelected={handleAddressSelected}
          context={context}
        />
      )}
    </FluentProvider>
  );
};

export default SearchBrreg;
