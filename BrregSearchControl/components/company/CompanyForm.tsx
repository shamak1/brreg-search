import React from 'react';
import {
  Field,
  Input as FluentInput,
  Text,
  Divider,
  InputOnChangeData,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Building24Regular, Location24Regular, Calendar24Regular, CardUi24Regular } from '@fluentui/react-icons';
import { CompanyFormProps } from '../../types/company';
import { useCompanyFormStyles } from '../../styles/companyForm.styles';
import { useCompanyFormHandlers } from '../../hooks/useCompanyForm';
import { getString } from '../../utils/translationHelper';
import { getDatePickerStringsFromResx, createDateFormatterFromResx } from '../../utils/datePickerLocalization';

const CompanyForm: React.FC<CompanyFormProps> = ({
  selectedCompany,
  name,
  adress,
  postnummer,
  poststed,
  registrationDate,
  onNameChange,
  onAdressChange,
  onPostnummerChange,
  onPoststedChange,
  onRegistrationDateChange,
  disabled = false,
  context
}) => {
  const styles = useCompanyFormStyles();
  const { handleDateSelect, handleDateKeyDown } = useCompanyFormHandlers(
    disabled,
    registrationDate,
    onRegistrationDateChange
  );

  const datePickerStrings = getDatePickerStringsFromResx(context);
  const formatDate = createDateFormatterFromResx(context);

  return (
    <form autoComplete='off'>
      <div className={styles.container}>
        {/* Company Identification Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Building24Regular className={styles.iconColor} />
            <Text className={styles.sectionTitle}>{getString(context, 'form.sections.companyInformation')}</Text>
          </div>
          
          <Field label={getString(context, 'form.labels.organizationNumber')}>
            <FluentInput
              value={selectedCompany?.organisasjonsnummer || ''}
              placeholder={getString(context, 'form.labels.organizationNumber')}
              readOnly
              disabled
              contentBefore={<CardUi24Regular />}
              className={styles.responsiveInput}
              autoComplete='off'
            />
          </Field>
          
          <Field label={getString(context, 'form.labels.companyName')}>
            <FluentInput
              value={name}
              onChange={(_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => !disabled && onNameChange(data.value)}
              placeholder={disabled ? getString(context, 'company.dropdown.placeholder.disabled') : getString(context, 'search.placeholder.companyName')}
              disabled={!selectedCompany || disabled}
              className={styles.responsiveInput}
              autoComplete='off'
            />
          </Field>
        </div>

        <Divider />

        {/* Address Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Location24Regular className={styles.iconColor} />
            <Text className={styles.sectionTitle}>{getString(context, 'form.sections.businessAddress')}</Text>
          </div>
          
          <Field label={getString(context, 'form.labels.streetAddress')} className={styles.fullWidthField}>
            <FluentInput
              value={adress}
              onChange={(_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => !disabled && onAdressChange(data.value)}
              placeholder={disabled ? getString(context, 'search.placeholder.disabled'): getString(context, 'company.dropdown.enterstreetaddress')}
              disabled={!selectedCompany || disabled}
              className={styles.responsiveInput}
              autoComplete='off'
            />
          </Field>
          
          <div className={styles.fieldGrid}>
            <Field label={getString(context, 'form.labels.postalCode')}>
              <FluentInput
                value={postnummer}
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => !disabled && onPostnummerChange(data.value)}
                placeholder={disabled ? getString(context, 'search.placeholder.disabled') : getString(context, 'form.sections.postnumber')}
                disabled={!selectedCompany || disabled}
                className={styles.responsiveInput}
                autoComplete='off'
              />
            </Field>
            
            <Field label={getString(context, 'form.labels.city')}>
              <FluentInput
                value={poststed}
                onChange={(_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => !disabled && onPoststedChange(data.value)}
                placeholder={disabled ? getString(context, 'search.placeholder.disabled') : getString(context, 'form.sections.cityname')}
                disabled={!selectedCompany || disabled}
                className={styles.responsiveInput}
                autoComplete='off'
              />
            </Field>
          </div>
        </div>

        <Divider />

        {/* Registration Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Calendar24Regular className={styles.iconColor} />
            <Text className={styles.sectionTitle}>{getString(context, 'form.sections.registrationDetails')}</Text>
          </div>
          
          <Field label={getString(context, 'form.labels.registrationDate')}>
            <DatePicker
              placeholder={disabled ? getString(context, 'search.placeholder.disabled') : getString(context, 'form.sections.selectregistrationdate')}
              value={registrationDate}
              onSelectDate={handleDateSelect}
              onKeyDown={handleDateKeyDown}
              aria-label={getString(context, 'form.sections.selectcompregistrationdate')}
              disabled={!selectedCompany || disabled}
              className={styles.responsiveInput}
              strings={datePickerStrings}
              formatDate={formatDate}
            />
          </Field>
        </div>
      </div>
    </form>
  );
};

export default CompanyForm;
