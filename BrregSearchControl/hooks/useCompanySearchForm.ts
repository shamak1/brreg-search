import { useState, useCallback } from 'react';
import { CompanyData, CompanySearchFormHookOptions, SearchType, Coordinates, AddressData } from '../types/company';
import { extractAddressComponents } from '../utils/addressUtils';
import { searchBrreg } from '../utils/brregApiUtils';
import { geocodeAddress } from '../utils/geocodingUtils';
import { getString } from '../utils/translationHelper';

export const useCompanySearchForm = ({
  pageSize,
  showViewMapButton,
  showToast,
  context
}: CompanySearchFormHookOptions) => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState<boolean>(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<SearchType>('name');
  
  // Form state
  const [name, setName] = useState<string>('');
  const [adress, setAdress] = useState<string>('');
  const [postnummer, setPostnummer] = useState<string>('');
  const [poststed, setPoststed] = useState<string>('');
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const clearFormFields = useCallback((): void => {
    setSelectedCompany(null);
    setName('');
    setAdress('');
    setPostnummer('');
    setPoststed('');
    setRegistrationDate(null);
    setCoordinates(null);
  }, []);

  const fetchCompanyData = useCallback(async (): Promise<void> => {
    if (!searchQuery.trim()) {
      showToast(getString(context, 'errors.title'), getString(context, 'errors.enterSearchTerm'), 'error');
      return;
    }

    setIsSearching(true);
    setCompanies([]);
    clearFormFields();

    try {     
      const result = await searchBrreg({
        searchQuery,
        searchType,
        pageSize,
        context
      });

      if (result.error) {
        if (result.error.includes('not found') || result.error.includes('No companies found')) {
          showToast(getString(context, 'errors.noresults'), result.error, 'info');
        } else if (result.error.includes('service is currently unavailable')) {
          showToast(getString(context, 'errors.serviceunav'), result.error, 'error');
        } else {
          showToast(getString(context, 'errors.searchFailed'), result.error, 'error');
        }
        return;
      }

      setCompanies(result.companies);
      
      if (searchType === 'orgNumber') {
        showToast(getString(context, 'success.searchSuccessful'), `${getString(context, 'success.foundCompany')} ${result.companies[0]?.navn}`);
      } else {
        const searchTypeText = searchType === 'industry' ? getString(context, 'success.foundCompaniesInIndustry') :
          getString(context, 'success.foundCompanies');
        showToast(getString(context, 'success.searchSuccessful'), `${getString(context, 'success.found')} ${result.companies.length} ${searchTypeText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : getString(context, 'errors.fetchError');
      showToast(getString(context, 'errors.searchFailed'), errorMessage, 'error');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchType, pageSize, showToast, clearFormFields]);

  const handleSearchTypeChange = useCallback((newSearchType: SearchType): void => {
    setSearchType(newSearchType);
    
    if (newSearchType === 'orgNumber') {
      const hasNonNumeric = /[^0-9]/.test(searchQuery);
      if (hasNonNumeric) {
        setSearchQuery('');
      }
    } else if (newSearchType === 'industry') {
      const hasInvalidChars = /[^0-9.]/.test(searchQuery);
      if (hasInvalidChars) {
        setSearchQuery('');
      }
    } else {
      const isOnlyNumbers = /^[0-9]+$/.test(searchQuery) && searchQuery.length > 0;
      const isIndustryCode = /^[0-9.]+$/.test(searchQuery) && searchQuery.includes('.');
      if (isOnlyNumbers || isIndustryCode) {
        setSearchQuery('');
      }
    }
  }, [searchQuery]);

  const handleCompanySelection = useCallback(async (companyName: string): Promise<void> => {
    if (!companyName || companyName.trim() === '') {
      clearFormFields();
      return;
    }

    const company = companies.find(c => c.navn === companyName);
    if (company) {
      setSelectedCompany(company);
      setName(company.navn || '');
      const addressInfo = extractAddressComponents(company.forretningsadresse);
      setAdress(addressInfo.adress);
      setPostnummer(addressInfo.postnummer);
      setPoststed(addressInfo.poststed);
      setRegistrationDate(company.registreringsdatoEnhetsregisteret ? new Date(company.registreringsdatoEnhetsregisteret) : null);
      
      if (showViewMapButton && company.forretningsadresse) {
        try {
          const coords = await geocodeAddress(company.forretningsadresse, 'Norway');
          setCoordinates(coords);
        } catch (error) {
          setCoordinates(null);
        }
      }
      
      showToast(getString(context, 'success.companySelected'), `${getString(context, 'success.selected')} ${company.navn}`);
    }
  }, [companies, showViewMapButton, showToast, clearFormFields]);

  const handleAddressSelected = useCallback((addressData: AddressData): void => {
    setAdress(addressData.adress);
    setPostnummer(addressData.postnummer);
    setPoststed(addressData.poststed);
    setCoordinates({ lat: addressData.lat, lng: addressData.lng });
    showToast(getString(context, 'success.addressSelected'), getString(context, 'success.addressApplied'));
  }, [showToast]);

  return {
    // State
    companies,
    selectedCompany,
    searchQuery,
    isSearching,
    setCompanies,
    setSelectedCompany,
    isJsonDialogOpen,
    isMapDialogOpen,
    searchType,
    name,
    adress,
    postnummer,
    poststed,
    registrationDate,
    coordinates,
    
    // Setters
    setSearchQuery,
    setIsJsonDialogOpen,
    setIsMapDialogOpen,
    setName,
    setAdress,
    setPostnummer,
    setPoststed,
    setRegistrationDate,
    
    // Handlers
    fetchCompanyData,
    handleSearchTypeChange,
    handleCompanySelection,
    handleAddressSelected,
    clearFormFields,
  };
};
