import { IInputs } from '../generated/ManifestTypes';

export interface CompanyData {
  navn: string;
  organisasjonsnummer: string;
  forretningsadresse?: {
    adresse?: string[];
    postnummer?: string;
    poststed?: string;
  };
  registreringsdatoEnhetsregisteret?: string;
  formaal?: string;
  epostadresse?: string;
  telefon?: string;
  hjemmeside?: string;
}

export interface CompanyFormProps {
  selectedCompany: CompanyData | null;
  name: string;
  adress: string;
  postnummer: string;
  poststed: string;
  registrationDate: Date | null;
  onNameChange: (value: string) => void;
  onAdressChange: (value: string) => void;
  onPostnummerChange: (value: string) => void;
  onPoststedChange: (value: string) => void;
  onRegistrationDateChange: (date: Date | null) => void;
  disabled?: boolean;
  context: ComponentFramework.Context<IInputs>
}

export type SearchType = 'name' | 'orgNumber' | 'industry';

export interface PinnedAddress {
  lat: number;
  lng: number;
  displayName: string;
  address: string;
  postnummer: string;
  poststed: string;
}

export interface CompanySearchProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  companies: CompanyData[];
  selectedCompany: CompanyData | null;
  onCompanySelect: (companyName: string) => void;
  onViewJson: () => void;
  onViewMap: () => void;
  error: string | null;
  mode?: 'button' | 'form';
  showViewJsonButton: boolean;
  showViewMapButton: boolean;
  showExportExcelButton: boolean;
  enableAdvancedSearch: boolean;
  searchType: SearchType;
  onSearchTypeChange?: (searchType: SearchType) => void;
  disabled?: boolean;
  showToast?: (title: string, description: string, intent?: 'success' | 'info' | 'warning' | 'error') => void;
  context: ComponentFramework.Context<IInputs>
}

export interface CompanyJsonViewerProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyData | null;
  context: ComponentFramework.Context<IInputs>
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CompanyMapViewerProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyData | null;
  country?: string;
  onAddressSelected?: (addressData: AddressData) => void;
  context: ComponentFramework.Context<IInputs>
}

export interface CompanySearchFormProps {
  onCompanySelected?: (companyData: CompanySelectedData) => void;
  onCancel?: () => void;
  pageSize: number;
  showTitle: boolean;
  showViewJsonButton: boolean;
  showViewMapButton: boolean;
  showExportExcelButton: boolean;
  enableAdvancedSearch: boolean;
  theme: ThemeType;
  disabled: boolean;
  country: string;
  context: ComponentFramework.Context<IInputs>
}

export type ThemeType = 'webLight' | 'webDark' | 'teamsLight' | 'teamsDark' | 'teamsHighContrast';

export interface SearchBrregProps {
  mode: 'button' | 'form';
  onCompanySelected?: (companyData: CompanySelectedData) => void;
  pageSize: number;
  showTitle: boolean;
  showViewJsonButton: boolean;
  showViewMapButton: boolean;
  showExportExcelButton: boolean;
  enableAdvancedSearch: boolean;
  theme: ThemeType;
  country: string;
  context: ComponentFramework.Context<IInputs>
  disabled?: boolean;
}

export interface CompanySelectedData {
  organisasjonsnummer: string;
  navn: string;
  adress: string;
  postnummer: string;
  poststed: string;
  registrationDate: Date | null;
  lat?: number;
  lng?: number;
  email?: string;
  phone?: string;
  website?: string;
}

export interface CompanySearchInputComponentProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onKeyPress: (event: React.KeyboardEvent) => void;
  searchType: SearchType;
  isSearching: boolean;
  disabled: boolean;
  context: ComponentFramework.Context<IInputs>
}

export interface CompanySearchButtonComponentProps {
  onSearch: () => void;
  isSearching: boolean;
  searchQuery: string;
  disabled: boolean;
  enableAdvancedSearch: boolean;
  searchType: SearchType;
  onSearchTypeChange?: (searchType: SearchType) => void;
  context: ComponentFramework.Context<IInputs>
}

export interface CompanySearchFormHookOptions {
  pageSize: number;
  showViewMapButton: boolean;
  showToast: (title: string, description: string, intent?: 'success' | 'info' | 'warning' | 'error') => void;
  context: ComponentFramework.Context<IInputs>
}

export interface CompanySearchButtonProps {
  onCompanySelected?: (companyData: CompanySelectedData) => void;
  pageSize: number;
  showTitle: boolean;
  showViewJsonButton: boolean;
  showViewMapButton: boolean;
  showExportExcelButton: boolean;
  enableAdvancedSearch: boolean;
  onViewJson?: (company: CompanyData) => void;
  onViewMap?: (company: CompanyData, onAddressSelected?: (addressData: AddressData) => void) => void;
  country: string;
  context: ComponentFramework.Context<IInputs>
}

export interface GeocodeResult {
  lat: number;
  lng: number;
}

export interface ForretningsAdresse {
  adresse?: string[];
  postnummer?: string;
  poststed?: string;
}

export interface AddressData {
  adress: string;
  postnummer: string;
  poststed: string;
  lat: number;
  lng: number;
}

export interface SearchBrregOptions {
  searchQuery: string;
  searchType: SearchType;
  pageSize: number;
  context: ComponentFramework.Context<IInputs>
}

export interface SearchBrregResult {
  companies: CompanyData[];
  error: string | null;
}

export interface ExtendedCompanyData extends CompanyData {
  organisasjonsform?: {
    kode?: string;
    beskrivelse?: string;
  };
  postadresse?: ForretningsAdresse;
  registreringsdatoForetaksregisteret?: string;
  stiftelsesdato?: string;
  registrertIMvaregisteret?: boolean;
  registreringsdatoMerverdiavgiftsregisteret?: string;
  frivilligMvaRegistrertBeskrivelser?: string[];
  naeringskode1?: {
    kode?: string;
    beskrivelse?: string;
  };
  antallAnsatte?: number;
  harRegistrertAntallAnsatte?: boolean;
  registreringsdatoAntallAnsatteEnhetsregisteret?: string;
  institusjonellSektorkode?: {
    kode?: string;
    beskrivelse?: string;
  };
  registrertIForetaksregisteret?: boolean;
  registrertIStiftelsesregisteret?: boolean;
  registrertIFrivillighetsregisteret?: boolean;
  sisteInnsendteAarsregnskap?: string;
  konkurs?: boolean;
  underAvvikling?: boolean;
  underTvangsavviklingEllerTvangsopplosning?: boolean;
  maalform?: string;
  vedtektsdato?: string;
  vedtektsfestetFormaal?: string[];
  aktivitet?: string[];
}

export interface ExtendedForretningsAdresse extends ForretningsAdresse {
  kommune?: string;
  land?: string;
}
