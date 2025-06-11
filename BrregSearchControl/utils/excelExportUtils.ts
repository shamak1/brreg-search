import * as XLSX from 'xlsx';
import { CompanyData, ExtendedCompanyData, ExtendedForretningsAdresse } from '../types/company';

export const exportCompanyToExcel = (company: CompanyData) => {
  const formatAddress = (address: ExtendedForretningsAdresse | undefined): string => {
    if (!address) return '';
    const parts = [
      ...(address.adresse || []),
      address.postnummer,
      address.poststed,
      address.kommune,
      address.land
    ].filter(Boolean);
    return parts.join(', ');
  };

  const formatArray = (arr: string[] | undefined): string => {
    if (!arr || !Array.isArray(arr)) return '';
    return arr.join(', ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const extendedCompany = company as ExtendedCompanyData;

  const tableData = [
    ['Column', 'Value'],
    ['Organization Number', company.organisasjonsnummer || ''],
    ['Company Name', company.navn || ''],
    ['Organization Form Code', extendedCompany.organisasjonsform?.kode || ''],
    ['Organization Form Description', extendedCompany.organisasjonsform?.beskrivelse || ''],
    ['Website', company.hjemmeside || ''],
    ['Email', company.epostadresse || ''],
    ['Phone', company.telefon || ''],
    ['Business Address', formatAddress(company.forretningsadresse as ExtendedForretningsAdresse)],
    ['Postal Address', formatAddress(extendedCompany.postadresse as ExtendedForretningsAdresse)],
    ['Registration Date (Entity Register)', formatDate(company.registreringsdatoEnhetsregisteret)],
    ['Registration Date (Business Register)', formatDate(extendedCompany.registreringsdatoForetaksregisteret)],
    ['Foundation Date', formatDate(extendedCompany.stiftelsesdato)],
    ['Registered in VAT Register', extendedCompany.registrertIMvaregisteret ? 'Yes' : 'No'],
    ['VAT Registration Date', formatDate(extendedCompany.registreringsdatoMerverdiavgiftsregisteret)],
    ['Voluntary VAT Descriptions', formatArray(extendedCompany.frivilligMvaRegistrertBeskrivelser)],
    ['Industry Code', extendedCompany.naeringskode1?.kode || ''],
    ['Industry Description', extendedCompany.naeringskode1?.beskrivelse || ''],
    ['Number of Employees', extendedCompany.antallAnsatte?.toString() || ''],
    ['Has Registered Employees', extendedCompany.harRegistrertAntallAnsatte ? 'Yes' : 'No'],
    ['Employee Registration Date', formatDate(extendedCompany.registreringsdatoAntallAnsatteEnhetsregisteret)],
    ['Institutional Sector Code', extendedCompany.institusjonellSektorkode?.kode || ''],
    ['Institutional Sector Description', extendedCompany.institusjonellSektorkode?.beskrivelse || ''],
    ['Registered in Business Register', extendedCompany.registrertIForetaksregisteret ? 'Yes' : 'No'],
    ['Registered in Foundation Register', extendedCompany.registrertIStiftelsesregisteret ? 'Yes' : 'No'],
    ['Registered in Voluntary Register', extendedCompany.registrertIFrivillighetsregisteret ? 'Yes' : 'No'],
    ['Latest Annual Report', extendedCompany.sisteInnsendteAarsregnskap || ''],
    ['Bankruptcy', extendedCompany.konkurs ? 'Yes' : 'No'],
    ['Under Liquidation', extendedCompany.underAvvikling ? 'Yes' : 'No'],
    ['Under Forced Liquidation', extendedCompany.underTvangsavviklingEllerTvangsopplosning ? 'Yes' : 'No'],
    ['Language Form', extendedCompany.maalform || ''],
    ['Statute Date', formatDate(extendedCompany.vedtektsdato)],
    ['Statutory Purpose', formatArray(extendedCompany.vedtektsfestetFormaal)],
    ['Activity', formatArray(extendedCompany.aktivitet)],
    ['Purpose', company.formaal || '']
  ];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(tableData);

  ws['!cols'] = [
    { wch: 58 }, // Column header width 400px
    { wch: 58 }  // Value column width 400px
  ];

  const tableRange = XLSX.utils.encode_range({
    s: { c: 0, r: 0 },
    e: { c: 1, r: tableData.length - 1 }
  });

  if (!ws['!tables']) ws['!tables'] = [];
  ws['!tables'].push({
    name: 'CompanyData',
    ref: tableRange,
    headerRowCount: 1,
    showFirstColumn: false,
    showLastColumn: false,
    showRowStripes: true,
    showColumnStripes: false
  });

  XLSX.utils.book_append_sheet(wb, ws, 'Company Data');

  const filename = `${company.navn?.replace(/[^a-zA-Z0-9]/g, '_') || 'company'}_data.xlsx`;

  XLSX.writeFile(wb, filename);
};
