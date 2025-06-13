import React from 'react';
import {
  useToastController,
  Toaster,
  Toast,
  ToastTitle,
  ToastBody,
  ToastIntent,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Text as FluentText,
  Divider,
  Button as FluentButton,
  Spinner,
} from '@fluentui/react-components';
import CompanySearch from '../company/CompanySearch';
import CompanyForm from '../company/CompanyForm';
import CompanyJsonViewer from '../json/CompanyJsonViewer';
import CompanyMapViewer from '../map/CompanyMapViewer';
import { useCompanySearchFormStyles } from '../../styles/companySearchForm.styles';
import { useCompanyFormState } from '../../hooks/search-brreg/useCompanyFormState';
import { useCompanySearchForm } from '../../hooks/useCompanySearchForm';
import { CompanySearchFormProps } from '../../types/company';

const CompanySearchForm: React.FC<CompanySearchFormProps> = ({
  onCompanySelected,
  onCancel,
  pageSize,
  showTitle,
  showViewJsonButton,
  showViewMapButton,
  showExportExcelButton,
  enableAdvancedSearch,
  theme,
  disabled = false,
  country,
  context
}) => {
  const getFluentTheme = () => {
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
  const styles = useCompanySearchFormStyles();
  const { dispatchToast } = useToastController();

  const showToast = (title: string, description: string, intent: ToastIntent = 'success') => {
    const toastElement = (
      <Toast>
        <ToastTitle>{title}</ToastTitle>
        <ToastBody>{description}</ToastBody>
      </Toast>
    );

    dispatchToast(toastElement, { 
      intent, 
      timeout: 1000, 
      position: 'top-end' as const 
    });
  };

  const {
    companies,
    selectedCompany,
    searchQuery,
    isSearching,
    searchType,
    setSearchQuery,
    setCompanies,
    setSelectedCompany,
    fetchCompanyData,
    handleSearchTypeChange,
    clearFormFields,
  } = useCompanySearchForm({
    pageSize,
    showViewMapButton,
    showToast,
    context
  });

  const {
    name,
    adress,
    postnummer,
    poststed,
    registrationDate,
    coordinates,
    email,
    phone,
    website,
    setName,
    setAdress,
    setPostnummer,
    setPoststed,
    setRegistrationDate,
    clearForm,
    populateFormFromCompany,
    updateAddressFromMap,
  } = useCompanyFormState(showViewMapButton);

  // Dialog states
  const [isJsonDialogOpen, setIsJsonDialogOpen] = React.useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = React.useState(false);

  const handleCompanySelection = async (companyName: string): Promise<void> => {
    if (!companyName || companyName.trim() === '') {
      clearForm();
      console.log('Company selection cleared');
      return;
    }

    const company = companies.find(c => c.navn === companyName);
    if (company) {
      setSelectedCompany(company);
      await populateFormFromCompany(company, country);
      showToast('Company selected', `Selected: ${company.navn}`);
    }
  };

  const getLoadingText = () => {
    switch (searchType) {
      case 'orgNumber':
        return 'Looking up organization...';
      case 'industry':
        return 'Searching for companies by industry...';
      default:
        return 'Searching for companies...';
    }
  };

  const handleAccept = () => {
    if (disabled) return;
    
    if (!selectedCompany) {
      showToast('Error', 'Please select a company first', 'error');
      return;
    }

    const companyData = {
      organisasjonsnummer: selectedCompany.organisasjonsnummer,
      navn: name.trim(),
      adress: adress.trim(),
      postnummer: postnummer.trim(),
      poststed: poststed.trim(),
      registrationDate: registrationDate,
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      ...(showViewMapButton && coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : {})
    };

    console.log('Company data accepted:', companyData);
    
    if (onCompanySelected) {
      onCompanySelected(companyData);
    }

    showToast('Success', 'Company information accepted successfully!');
    
    // Reset the form and search after accepting
    clearForm();
    setSearchQuery('');
    setCompanies([]);
    setSelectedCompany(null);
  };

  const handleViewJson = () => {
    if (selectedCompany && (showViewJsonButton || showViewMapButton)) {
      setIsJsonDialogOpen(true);
    }
  };

  const handleViewMap = () => {
    if (selectedCompany && (showViewJsonButton || showViewMapButton)) {
      setIsMapDialogOpen(true);
    }
  };

  return (
    <FluentProvider theme={fluentTheme}>
      <Toaster />
      <div className={styles.rootContainer}>
        <div className={styles.formWrapper}>
          {/* Loading overlay */}
          {isSearching && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingContent}>
                <Spinner size="large" />
                <FluentText weight="semibold">
                  {getLoadingText()}
                </FluentText>
              </div>
            </div>
          )}
          
          <div className={styles.formContainer}>
            {/* Content */}
            {showTitle && (
              <FluentText as="h2" size={600} weight="semibold" style={{ marginBottom: '16px' }}>
                Norwegian Business Registry Search
              </FluentText>
            )}
            
            <CompanySearch
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={fetchCompanyData}
              isSearching={isSearching}
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelection}
              onViewJson={handleViewJson}
              onViewMap={handleViewMap}
              error={null}
              mode="form"
              showViewJsonButton={showViewJsonButton}
              showViewMapButton={showViewMapButton}
              showExportExcelButton={showExportExcelButton}
              enableAdvancedSearch={enableAdvancedSearch}
              searchType={searchType}
              onSearchTypeChange={handleSearchTypeChange}
              disabled={disabled}
              context={context}
            />
            
            <Divider style={{ margin: '24px 0' }} />
            
            <CompanyForm
              selectedCompany={selectedCompany}
              name={name}
              adress={adress}
              postnummer={postnummer}
              poststed={poststed}
              registrationDate={registrationDate}
              onNameChange={setName}
              onAdressChange={setAdress}
              onPostnummerChange={setPostnummer}
              onPoststedChange={setPoststed}
              onRegistrationDateChange={setRegistrationDate}
              disabled={disabled}
              context={context}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              {onCancel && (
                <FluentButton 
                  appearance="secondary" 
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </FluentButton>
              )}
              <FluentButton 
                appearance="primary" 
                onClick={handleAccept}
                disabled={!selectedCompany || isSearching || disabled}
              >
                {isSearching ? 'Processing...' : 'Accept'}
              </FluentButton>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showViewJsonButton && (
        <CompanyJsonViewer
          isOpen={isJsonDialogOpen}
          onClose={() => setIsJsonDialogOpen(false)}
          company={selectedCompany}
          context={context}
        />
      )}

      {showViewMapButton && (
        <CompanyMapViewer
          isOpen={isMapDialogOpen}
          onClose={() => setIsMapDialogOpen(false)}
          company={selectedCompany}
          country={country}
          onAddressSelected={updateAddressFromMap}
          context={context}
        />
      )}
    </FluentProvider>
  );
};

export default CompanySearchForm;