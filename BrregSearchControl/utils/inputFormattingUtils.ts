export const formatIndustryCode = (value: string) => {
  const cleanValue = value.replace(/[^0-9.]/g, '');
  
  const parts = cleanValue.split('.');
  
  if (parts[0] && parts[0].length > 2) {
    parts[0] = parts[0].slice(0, 2);
  }
  
  if (parts[1] && parts[1].length > 3) {
    parts[1] = parts[1].slice(0, 3);
  }
  
  const finalParts = parts.slice(0, 2);
  
  return finalParts.length > 1 ? finalParts.join('.') : finalParts[0] || '';
};

export const autoFormatIndustryCode = (value: string) => {
  const numbersOnly = value.replace(/[^0-9]/g, '');
  
  if (numbersOnly.length === 0) {
    return '';
  } else if (numbersOnly.length <= 2) {
    return numbersOnly;
  } else {
    const firstPart = numbersOnly.slice(0, 2);
    const secondPart = numbersOnly.slice(2, 5); // Max 3 digits after dot
    return `${firstPart}.${secondPart}`;
  }
};

export const formatOrganizationNumber = (value: string) => {
  // Only allow numbers and limit to 9 digits
  const numbersOnly = value.replace(/[^0-9]/g, '');
  return numbersOnly.slice(0, 9);
};
