import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  DialogTrigger,
  Button as FluentButton,
  Divider,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
  ToastIntent,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import CompanySearch from '../company/CompanySearch';
import CompanyForm from '../company/CompanyForm';
import LoadingOverlay from './LoadingOverlay';
import { useSearchBrregDialog } from '../../hooks/search-brreg/useSearchBrregDialog';
import { useCompanySearch } from '../../hooks/search-brreg/useCompanySearch';
import { useCompanyFormState } from '../../hooks/search-brreg/useCompanyFormState';
import { useCompanySearchButtonStyles } from '../../styles/companySearchButton.styles';
import { CompanySearchButtonProps } from '../../types/company';
import { getString } from '../../utils/translationHelper';

const CompanySearchButton: React.FC<CompanySearchButtonProps> = ({
  onCompanySelected,
  pageSize,
  showTitle,
  showViewJsonButton,
  showViewMapButton,
  showExportExcelButton,
  enableAdvancedSearch,
  onViewJson,
  onViewMap,
  country,
  context
}) => {
  const styles = useCompanySearchButtonStyles();
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
    isOpen,
    openDialog,
    closeDialog,
  } = useSearchBrregDialog();

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
    handleCompanySelection,
  } = useCompanySearch({ pageSize, showToast, context });

  const {
    name,
    adress,
    postnummer,
    poststed,
    registrationDate,
    coordinates,
    setName,
    setAdress,
    setPostnummer,
    setPoststed,
    setRegistrationDate,
    clearForm,
    populateFormFromCompany,
    updateAddressFromMap,
  } = useCompanyFormState(showViewMapButton);

  const handleDialogOpen = () => {
    handleSearchTypeChange('name');
    openDialog();
  };

  const handleClose = () => {
    closeDialog();
    // Clear form and search results completely
    clearForm();
    setSearchQuery('');
    setCompanies([]);
    setSelectedCompany(null);
  };

  const handleDialogOpenChange = (_event: React.SyntheticEvent, data: { open: boolean }) => {
    if (!data.open) {
      handleClose();
    }
  };

  const handleCompanySelectionInternal = async (companyName: string) => {
    handleCompanySelection(companyName);
    if (companyName && companyName.trim() !== '') {
      const company = companies.find(c => c.navn === companyName);
      if (company) {
        await populateFormFromCompany(company, country);
      }
    } else {
      clearForm();
    }
  };

  const handleSearch = () => {
    fetchCompanyData();
  };

  const handleAccept = () => {
    if (!selectedCompany) {
      showToast(getString(context, 'errors.title'), getString(context, 'errors.selectCompanyFirst'), 'error');
      return;
    }

    const companyData = {
      organisasjonsnummer: selectedCompany.organisasjonsnummer,
      navn: name.trim(),
      adress: adress.trim(),
      postnummer: postnummer.trim(),
      poststed: poststed.trim(),
      registrationDate: registrationDate,
      ...(showViewMapButton && coordinates ? { lat: coordinates.lat, lng: coordinates.lng } : {}),
      ...(selectedCompany.epostadresse ? { email: selectedCompany.epostadresse } : {}),
      ...(selectedCompany.telefon ? { phone: selectedCompany.telefon } : {}),
      ...(selectedCompany.hjemmeside ? { website: selectedCompany.hjemmeside } : {})
    };
    
    if (onCompanySelected) {
      onCompanySelected(companyData);
    }

    showToast(getString(context, 'success.title'), getString(context, 'success.companyAccepted'));
    handleClose();
  };

  const handleViewJson = () => {
    if (selectedCompany && showViewJsonButton && onViewJson) {
      onViewJson(selectedCompany);
    }
  };

  const handleViewMap = () => {
    if (selectedCompany && showViewMapButton && onViewMap) {
      onViewMap(selectedCompany, handleAddressSelected);
    }
  };

  const handleAddressSelected = (addressData: {
    adress: string;
    postnummer: string;
    poststed: string;
    lat: number;
    lng: number;
  }) => {
    updateAddressFromMap(addressData);
    showToast(getString(context, 'success.addressSelected'), getString(context, 'success.addressApplied'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger disableButtonEnhancement>
        <FluentButton
          appearance='primary'
          icon={<Search24Regular />}
          onClick={handleDialogOpen}
          aria-label={getString(context, 'search.ariaLabel.searchBrregButton')}
        >
          {getString(context, 'search.button.searchBrreg')}
        </FluentButton>
      </DialogTrigger>
      
      <DialogSurface aria-labelledby='dialog-title'>
        <DialogBody>
          {showTitle && (
            <DialogTitle id='dialog-title'>
              {getString(context, 'titles.main')}
            </DialogTitle>
          )}
          <DialogContent className={styles.dialogContent}>
            <CompanySearch
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
              companies={companies}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelectionInternal}
              onViewJson={handleViewJson}
              onViewMap={handleViewMap}
              error={null}
              mode='form'
              showViewJsonButton={showViewJsonButton}
              showViewMapButton={showViewMapButton}
              showExportExcelButton={showExportExcelButton}
              enableAdvancedSearch={enableAdvancedSearch}
              searchType={searchType}
              onSearchTypeChange={handleSearchTypeChange}
              context={context}
            />
            
            <Divider />
            
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
              context={context}
            />

            {isSearching && <LoadingOverlay searchType={searchType} context={context} />}
          </DialogContent>
          
          <DialogActions className={styles.dialogActions}>
            <DialogTrigger disableButtonEnhancement>
              <FluentButton 
                appearance='secondary' 
                onClick={handleClose}
                aria-label={getString(context, 'dialog.ariaLabel.cancel')}
              >
                {getString(context, 'dialog.cancel')}
              </FluentButton>
            </DialogTrigger>
            <FluentButton 
              appearance='primary' 
              onClick={handleAccept}
              disabled={!selectedCompany}
              aria-label={getString(context, 'dialog.ariaLabel.accept')}
            >
              {getString(context, 'dialog.accept')}
            </FluentButton>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default CompanySearchButton;
