import { SearchBrregOptions, SearchBrregResult } from '../types/company';
import { getString } from './translationHelper';

export const searchBrreg = async ({ searchQuery, searchType, pageSize, context }: SearchBrregOptions): Promise<SearchBrregResult> => {
  if (!searchQuery.trim()) {
    return { companies: [], error: getString(context, 'errors.enterSearchTerm') };
  }

  try {
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    
    let apiUrl: string;
    if (searchType === 'orgNumber') {
      apiUrl = `https://data.brreg.no/enhetsregisteret/api/enheter/${encodedQuery}`;
    } else if (searchType === 'industry') {
      apiUrl = `https://data.brreg.no/enhetsregisteret/api/enheter?naeringskode=${encodedQuery}&size=${pageSize}`;
    } else {
      apiUrl = `https://data.brreg.no/enhetsregisteret/api/enheter?navn=${encodedQuery}&size=${pageSize}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        const searchTypeText = searchType === 'orgNumber' ? getString(context, 'errors.noResultsOrgNumber') : 
                              searchType === 'industry' ? getString(context, 'errors.noResultsIndustry') :
                              getString(context, 'errors.noResultsName');
        return { companies: [], error: searchTypeText };
      } else if (response.status >= 500) {
        return { companies: [], error: getString(context, 'errors.serviceUnavailable') };
      } else {
        return { companies: [], error: `${getString(context, 'errors.searchFailedStatus')} ${response.status}` };
      }
    }

    const data = await response.json();
    
    if (searchType === 'orgNumber') {
      return { companies: [data], error: null };
    } else {
      if (data._embedded && data._embedded.enheter && data._embedded.enheter.length > 0) {
        return { companies: data._embedded.enheter, error: null };
      } else {
        const searchTypeText = searchType === 'industry' ? getString(context, 'errors.noResultsIndustry') : getString(context, 'errors.noResultsName');
        return { companies: [], error: searchTypeText };
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : getString(context, 'errors.fetchError');
    return { companies: [], error: errorMessage };
  }
};
