import { IInputs } from '../../generated/ManifestTypes';
import React from 'react';
import { Button as FluentButton } from '@fluentui/react-components';
import { DocumentTableArrowRight24Regular } from '@fluentui/react-icons';
import { CompanyData } from '../../types/company';
import { exportCompanyToExcel } from '../../utils/excelExportUtils';
import { getString } from '../../utils/translationHelper';

interface CompanyExcelExporterProps {
  company: CompanyData | null;
  disabled: boolean;
  size?: 'small' | 'medium' | 'large';
  appearance?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'transparent';
  className?: string;
  context: ComponentFramework.Context<IInputs>
}

const CompanyExcelExporter: React.FC<CompanyExcelExporterProps> = ({
  company,
  disabled = false,
  size = 'small',
  appearance = 'secondary',
  className,
  context
}) => {
  const handleExportExcel = () => {
    if (company) {
      exportCompanyToExcel(company);
    }
  };

  return (
    <FluentButton
      appearance={appearance}
      icon={<DocumentTableArrowRight24Regular />}
      onClick={handleExportExcel}
      size={size}
      disabled={!company || disabled}
      aria-label={getString(context, 'excel.ariaLabel')}
      className={className}
    >
      {getString(context, 'excel.button')}
    </FluentButton>
  );
};

export default CompanyExcelExporter;
