import { IInputs } from '../../generated/ManifestTypes';
import React from 'react';
import { Dropdown, Option, Text, OptionOnSelectData, SelectionEvents } from '@fluentui/react-components';
import { CompanyData } from '../../types/company';
import { useCompanySearchStyles } from '../../styles/companySearch.styles';
import { getString } from '../../utils/translationHelper';

interface CompanyDropdownProps {
  companies: CompanyData[];
  selectedCompany: CompanyData | null;
  onCompanySelect: (companyName: string) => void;
  isSearching: boolean;
  disabled: boolean;
  fullWidth?: boolean;
  context: ComponentFramework.Context<IInputs>;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  companies,
  selectedCompany,
  onCompanySelect,
  isSearching,
  disabled,
  fullWidth = false,
  context
}) => {
  const styles = useCompanySearchStyles();

  const handleCompanyChange = (_event: SelectionEvents, data: OptionOnSelectData) => {
    if (disabled) return;
    
    const selectedValue = data.optionValue;
    onCompanySelect(selectedValue || '');
  };

  const isDropdownDisabled = isSearching || companies.length === 0 || disabled;
  const dropdownPlaceholder = disabled
    ? getString(context, 'company.dropdown.placeholder.disabled')
    : isSearching 
      ? getString(context, 'company.dropdown.placeholder.searching')
      : companies.length === 0 
        ? getString(context, 'company.dropdown.placeholder.noCompanies')
        : getString(context, 'company.dropdown.placeholder.selectCompany');

  const getSelectedCompanyDisplayValue = () => {
    if (!selectedCompany) return '';
    return `${selectedCompany.navn} (${selectedCompany.organisasjonsnummer})`;
  };

  const containerClass = fullWidth 
    ? styles.dropdownContainerFullWidth 
    : styles.dropdownContainer;

  return (
    <div className={containerClass}>
      <Text weight='semibold'>{getString(context, 'company.selectCompany')}</Text>
      <Dropdown
        className={styles.companyDropdown}
        placeholder={dropdownPlaceholder}
        value={getSelectedCompanyDisplayValue()}
        onOptionSelect={handleCompanyChange}
        disabled={isDropdownDisabled}
        aria-label={getString(context, 'company.dropdown.ariaLabel')}
      >
        {companies.map((company) => (
          <Option key={company.organisasjonsnummer} value={company.navn} text={`${company.navn} (${company.organisasjonsnummer})`}>
            {company.navn} ({company.organisasjonsnummer})
          </Option>
        ))}
      </Dropdown>
    </div>
  );
};

export default CompanyDropdown;
