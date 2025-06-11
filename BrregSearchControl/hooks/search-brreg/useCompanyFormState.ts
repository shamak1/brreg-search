import { useState, useCallback } from 'react';
import { CompanyData, Coordinates, AddressData } from '../../types/company';
import { extractAddressComponents } from '../../utils/addressUtils';
import { geocodeAddress } from '../../utils/geocodingUtils';

export const useCompanyFormState = (showViewMapButton: boolean) => {
  const [name, setName] = useState<string>('');
  const [adress, setAdress] = useState<string>('');
  const [postnummer, setPostnummer] = useState<string>('');
  const [poststed, setPoststed] = useState<string>('');
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [website, setWebsite] = useState<string>('');

  const clearForm = useCallback((): void => {
    setName('');
    setAdress('');
    setPostnummer('');
    setPoststed('');
    setRegistrationDate(null);
    setCoordinates(null);
    setEmail('');
    setPhone('');
    setWebsite('');
  }, []);

  const populateFormFromCompany = useCallback(async (company: CompanyData, country: string): Promise<void> => {
    setName(company.navn || '');
    
    const addressInfo = extractAddressComponents(company.forretningsadresse);
    setAdress(addressInfo.adress);
    setPostnummer(addressInfo.postnummer);
    setPoststed(addressInfo.poststed);
    
    setRegistrationDate(company.registreringsdatoEnhetsregisteret ? new Date(company.registreringsdatoEnhetsregisteret) : null);
    
    setEmail(company.epostadresse || '');
    setPhone(company.telefon || '');
    setWebsite(company.hjemmeside || '');
    
    if (showViewMapButton && company.forretningsadresse) {
      try {
        const coords = await geocodeAddress(company.forretningsadresse, country);
        setCoordinates(coords);
      } catch (error) {
        setCoordinates(null);
      }
    }
  }, [showViewMapButton]);

  const updateAddressFromMap = useCallback((addressData: AddressData): void => {
    setAdress(addressData.adress);
    setPostnummer(addressData.postnummer);
    setPoststed(addressData.poststed);
    setCoordinates({ lat: addressData.lat, lng: addressData.lng });
  }, []);

  return {
    name,
    adress,
    postnummer,
    poststed,
    registrationDate,
    coordinates,
    email,
    phone,
    website,
    setName,
    setAdress,
    setPostnummer,
    setPoststed,
    setRegistrationDate,
    setEmail,
    setPhone,
    setWebsite,
    clearForm,
    populateFormFromCompany,
    updateAddressFromMap,
  };
};
