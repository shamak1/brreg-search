import { IInputs } from '../generated/ManifestTypes';
import { Search24Regular, Organization24Regular, Building24Regular } from '@fluentui/react-icons';
import { getString } from './translationHelper';

export type SearchType = 'name' | 'orgNumber' | 'industry';

export const getInputPlaceholder = (searchType: SearchType, context:  ComponentFramework.Context<IInputs>) => {
  if (searchType === 'orgNumber') {
    return getString(context, 'search.placeholder.orgNumber');
  } else if (searchType === 'industry') {
    return getString(context, 'search.placeholder.industry');
  }
  return getString(context, 'search.placeholder.companyName');
};

export const getSearchButtonText = (isSearching: boolean, searchType: SearchType, context:  ComponentFramework.Context<IInputs>) => {
  if (isSearching) return getString(context, 'search.button.searching');
  if (searchType === 'orgNumber') return getString(context, 'search.button.searchByOrgNumber');
  if (searchType === 'industry') return getString(context, 'search.button.searchByIndustry');
  return getString(context, 'search.button.searchByName');
};

export const getSearchIcon = (searchType: SearchType) => {
  if (searchType === 'orgNumber') return Organization24Regular;
  if (searchType === 'industry') return Building24Regular;
  return Search24Regular;
};

export const getInputMaxLength = (searchType: SearchType) => {
  if (searchType === 'orgNumber') return 9;
  if (searchType === 'industry') return 6;
  return undefined;
};

export const getAriaLabel = (searchType: SearchType, context:  ComponentFramework.Context<IInputs>) => {
  if (searchType === 'orgNumber') return getString(context, 'search.ariaLabel.orgNumberInput');
  if (searchType === 'industry') return getString(context, 'search.ariaLabel.industryInput');
  return getString(context, 'search.ariaLabel.companyNameInput');
};