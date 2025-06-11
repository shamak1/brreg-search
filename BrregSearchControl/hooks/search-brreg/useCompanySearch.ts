import { IInputs } from '../../generated/ManifestTypes';
import { useState, useCallback } from 'react';
import { ToastIntent } from '@fluentui/react-components';
import { CompanyData, SearchType } from '../../types/company';
import { searchBrreg } from '../../utils/brregApiUtils';
import { getString } from '../../utils/translationHelper';

interface UseCompanySearchOptions {
  pageSize: number;
  showToast: (title: string, description: string, intent?: ToastIntent) => void;
  context: ComponentFramework.Context<IInputs>
}

export const useCompanySearch = ({ pageSize, showToast, context }: UseCompanySearchOptions) => {
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('name');

  const fetchCompanyData = useCallback(async (): Promise<void> => {
    if (!searchQuery.trim()) {
      showToast(getString(context, 'errors.title'), getString(context, 'errors.enterSearchTerm'), 'error');
      return;
    }

    setIsSearching(true);
    setCompanies([]);
    setSelectedCompany(null);

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
        const searchTypeText = searchType === 'industry' ? getString(context, 'success.foundCompaniesInIndustry') : getString(context, 'success.foundCompanies');
        showToast(getString(context, 'success.searchSuccessful'), `${getString(context, 'success.found')} ${result.companies.length} ${searchTypeText}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : getString(context, 'errors.fetchError');
      showToast(getString(context, 'errors.searchFailed'), errorMessage, 'error');
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchType, pageSize, showToast]);

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

  const handleCompanySelection = useCallback((companyName: string): void => {
    if (!companyName || companyName.trim() === '') {
      setSelectedCompany(null);
      return;
    }

    const company = companies.find(c => c.navn === companyName);
    if (company) {
      setSelectedCompany(company);
      showToast(getString(context, 'success.companySelected'), `${getString(context, 'success.selected')} ${company.navn}`);
    }
  }, [companies, showToast]);

  return {
    isSearching,
    companies,
    selectedCompany,
    searchQuery,
    searchType,
    setSearchQuery,
    setCompanies,
    setSelectedCompany,
    fetchCompanyData,
    handleSearchTypeChange,
    handleCompanySelection,
  };
};