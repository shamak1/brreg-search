import React from 'react';
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Toaster,
} from '@fluentui/react-components';

interface SearchBrregButtonProviderProps {
  theme: 'webLight' | 'webDark' | 'teamsLight' | 'teamsDark' | 'teamsHighContrast';
  children: React.ReactNode;
}

const SearchBrregButtonProvider: React.FC<SearchBrregButtonProviderProps> = ({
  theme,
  children,
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

  return (
    <FluentProvider theme={getFluentTheme()}>
      <Toaster />
      {children}
    </FluentProvider>
  );
};

export default SearchBrregButtonProvider;
