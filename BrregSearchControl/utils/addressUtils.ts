import { ForretningsAdresse } from '../types/company';

export const formatAddress = (forretningsadresse?: ForretningsAdresse): string => {
  if (!forretningsadresse) return '';
  
  const parts: string[] = [];
  
  if (forretningsadresse.adresse && forretningsadresse.adresse.length > 0) {
    parts.push(...forretningsadresse.adresse);
  }
  
  if (forretningsadresse.postnummer || forretningsadresse.poststed) {
    const cityPart = [forretningsadresse.postnummer, forretningsadresse.poststed]
      .filter(Boolean)
      .join(' ');
    if (cityPart) {
      parts.push(cityPart);
    }
  }
  
  return parts.join(', ');
};

export const extractAddressComponents = (address?: ForretningsAdresse) => {
  if (!address) {
    return {
      adress: '',
      postnummer: '',
      poststed: ''
    };
  }

  return {
    adress: address.adresse?.join(', ') || '',
    postnummer: address.postnummer || '',
    poststed: address.poststed || ''
  };
};
