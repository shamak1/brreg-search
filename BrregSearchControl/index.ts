import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import SearchBrreg from './components/SearchBrreg';
import { CompanySelectedData } from './types/company';
import { ThemeType } from './utils/themes';

export class BrregSearchControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _root: Root | null = null;
    private _selectedCompanyData: CompanySelectedData | null = null;
    // Configuration parameters
    private _mode: 'button' | 'form' = 'button';
    private _themeType: ThemeType;
    private _pageSize: number;
    private _showTitle: boolean;
    private _showViewJsonButton: boolean;
    private _showViewMapButton: boolean;
    private _showExportExcelButton: boolean;
    private _enableAdvancedSearch: boolean;
    
    constructor() {
        this.onCompanySelected = this.onCompanySelected.bind(this);
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._root = createRoot(this._container);
        // Initialize configuration parameters
        this._mode = context.parameters.mode.raw;
        this._themeType = context.parameters.theme.raw;
        const pageSizeRaw = context.parameters.pageSize.raw;
        this._pageSize = typeof pageSizeRaw === 'number' && pageSizeRaw > 0
            ? Math.min(pageSizeRaw, 100)
            : 10; // Added so we don't retrieve too many companies at once.
        this._showTitle = context.parameters.showTitle.raw;
        this._showViewJsonButton = context.parameters.showViewJsonButton.raw;
        this._showViewMapButton = context.parameters.showViewMapButton.raw;
        this._showExportExcelButton = context.parameters.showExportExcelButton.raw;
        this._enableAdvancedSearch = context.parameters.enableAdvancedSearch.raw;

        this.renderComponent();
    }

    private renderComponent(): void {
        if (!this._root) return;

        this._root.render(React.createElement(SearchBrreg, {
            mode: this._mode,
            onCompanySelected: this.onCompanySelected,
            pageSize: this._pageSize,
            showTitle: this._showTitle,
            showViewJsonButton: this._showViewJsonButton,
            showViewMapButton: this._showViewMapButton,
            showExportExcelButton: this._showExportExcelButton,
            enableAdvancedSearch: this._enableAdvancedSearch,
            theme: this._themeType,
            country: 'Norway', // This is just like a fallback country
            context: this._context,
            disabled: this._context.mode.isControlDisabled
        }));
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;

        this.renderComponent();
    }

    private onCompanySelected(companyData: CompanySelectedData): void {
        this._selectedCompanyData = companyData;
        this._notifyOutputChanged();
    }

    public getOutputs(): IOutputs {
        return {
            organisasjonsnummer: this._selectedCompanyData?.organisasjonsnummer || '',
            navn: this._selectedCompanyData?.navn || '',
            adress: this._selectedCompanyData?.adress || '',
            postnummer: this._selectedCompanyData?.postnummer || '',
            poststed: this._selectedCompanyData?.poststed || '',
            registrationDate: this._selectedCompanyData?.registrationDate || undefined,
            email: this._selectedCompanyData?.email || '',
            phone: this._selectedCompanyData?.phone || '',
            website: this._selectedCompanyData?.website || '',
            lat: this._selectedCompanyData?.lat || undefined,
            lng: this._selectedCompanyData?.lng || undefined
        };
    }

    public destroy(): void {
        if (this._root) {
            this._root.unmount();
            this._root = null;
        }
    }
}
