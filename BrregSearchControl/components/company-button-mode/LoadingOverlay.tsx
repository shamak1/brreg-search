import { IInputs } from '../../generated/ManifestTypes';
import React from 'react';
import { Spinner, Text as FluentText } from '@fluentui/react-components';
import { useCompanySearchButtonStyles } from '../../styles/companySearchButton.styles';
import { getString } from '../../utils/translationHelper';

interface LoadingOverlayProps {
  searchType: 'name' | 'orgNumber' | 'industry';
  context: ComponentFramework.Context<IInputs>;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ searchType, context }) => {
  const styles = useCompanySearchButtonStyles();

  const getLoadingText = () => {
    switch (searchType) {
      case 'orgNumber':
        return getString(context, 'loading.lookinguporgs');
      case 'industry':
        return getString(context, 'loading.searchcompbyindustry');
      default:
        return getString(context, 'loading.searchforcomps');
    }
  };

  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loadingContent}>
        <Spinner size='large' />
        <FluentText weight='semibold'>
          {getLoadingText()}
        </FluentText>
      </div>
    </div>
  );
};

export default LoadingOverlay;
