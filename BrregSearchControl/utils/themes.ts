import {
    Theme,
    webLightTheme,
    webDarkTheme,
    teamsLightTheme,
    teamsDarkTheme,
    teamsHighContrastTheme
} from '@fluentui/react-components';

export type ThemeType = 'webLight' | 'webDark' | 'teamsLight' | 'teamsDark' | 'teamsHighContrast';

export const THEME_MAP: Record<ThemeType, Theme> = {
    webLight: webLightTheme,
    webDark: webDarkTheme,
    teamsLight: teamsLightTheme,
    teamsDark: teamsDarkTheme,
    teamsHighContrast: teamsHighContrastTheme
} as const;

export const getFluentTheme = (themeType?: string): Theme => {
    return THEME_MAP[themeType as ThemeType] || THEME_MAP.webLight;
};