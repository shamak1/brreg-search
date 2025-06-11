import { IInputs } from '../../generated/ManifestTypes';
import React from 'react';
import { Button as FluentButton } from '@fluentui/react-components';
import { Eye24Regular, Map24Regular } from '@fluentui/react-icons';
import { CompanyData } from '../../types/company';
import { useCompanySearchStyles } from '../../styles/companySearch.styles';
import CompanyExcelExporter from '../excel/CompanyExcelExporter';
import { getString } from '../../utils/translationHelper';

interface CompanyActionButtonsProps {
  selectedCompany: CompanyData | null;
  onViewJson: () => void;
  onViewMap: () => void;
  showViewJsonButton: boolean;
  showViewMapButton: boolean;
  showExportExcelButton: boolean;
  disabled: boolean;
  context: ComponentFramework.Context<IInputs>;
}

const CompanyActionButtons: React.FC<CompanyActionButtonsProps> = ({
  selectedCompany,
  onViewJson,
  onViewMap,
  showViewJsonButton,
  showViewMapButton,
  showExportExcelButton,
  disabled,
  context
}) => {
  const styles = useCompanySearchStyles();

  if (!showViewJsonButton && !showViewMapButton && !showExportExcelButton) {
    return null;
  }

  return (
    <div className={styles.companyActions}>
      {showViewJsonButton && (
        <FluentButton
          appearance='secondary'
          icon={<Eye24Regular />}
          onClick={onViewJson}
          size='small'
          disabled={!selectedCompany || disabled}
          aria-label={getString(context, 'json.viewAriaLabel')}
        >
          {getString(context, 'json.viewButton')}
        </FluentButton>
      )}
      {showExportExcelButton && (
        <CompanyExcelExporter
          company={selectedCompany}
          disabled={disabled}
          context={context}
        />
      )}
      {showViewMapButton && (
        <FluentButton
          appearance='secondary'
          icon={<Map24Regular />}
          onClick={onViewMap}
          size='small'
          disabled={!selectedCompany || disabled}
          aria-label={getString(context, 'map.viewAriaLabel')}
        >
          {getString(context, 'map.viewButton')}
        </FluentButton>
      )}
    </div>
  );
};

export default CompanyActionButtons;
