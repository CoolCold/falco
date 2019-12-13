import Select from 'components/Select';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import { ValueType } from 'react-select/lib/types';
import { AuditResultType } from 'redux/auditResults/types';

import { getWPTAuditId } from 'services/utils';
import { getSpacing } from 'stylesheet';
import Style from './WebPageTestBlock.style';

export interface OwnProps {
  auditResults: AuditResultType[];
  blockMargin: string;
}

const WebPageTestBlock: React.FunctionComponent<OwnProps & InjectedIntlProps> = props => {
  const { auditResults, blockMargin, intl } = props;

  const [selectedAudit, setSelectedAudit] = React.useState(auditResults[0]);
  React.useEffect(() => setSelectedAudit(auditResults[0]), [auditResults]);

  const [auditToCompare, setAuditToCompare] = React.useState(auditResults[1]);
  const [dateSelectorDisplayed, displayDateSelector] = React.useState(false);
  const [dateComparatorDisplayed, displayDateComparator] = React.useState(false);

  const [selectedOption, setSelectedOption] = React.useState('latest');

  const getWebPageTestUrl = () => {
    if (!dateComparatorDisplayed) {
      return selectedAudit.WPTResultsUserUrl;
    }
    const privateInstanceRootUrl = selectedAudit.WPTResultsUserUrl.split('/result/')[0]
    const baseUrl = `${privateInstanceRootUrl}/video/compare.php?tests=`
    const selectedAuditId = getWPTAuditId(selectedAudit);
    const auditToCompareId = getWPTAuditId(auditToCompare);

    return `${baseUrl}${selectedAuditId},${auditToCompareId}`;
  };

  const handleRadioButtonChange = (
    e: React.MouseEvent,
    radioOptionType: 'latest' | 'dateSelector' | 'dateComparator',
  ): void => {
    setSelectedOption(radioOptionType);
    switch (radioOptionType) {
      case 'latest':
        displayDateSelector(false);
        displayDateComparator(false);
        break;
      case 'dateSelector':
        setSelectedAudit(auditResults[0]);
        displayDateSelector(true);
        displayDateComparator(false);
        break;
      case 'dateComparator':
        setSelectedAudit(auditResults[0]);
        setAuditToCompare(auditResults[1]);
        displayDateSelector(false);
        displayDateComparator(true);
        break;
    }
  };

  const isOptionSelected = (radioOptionType: 'latest' | 'dateSelector' | 'dateComparator') => {
    return radioOptionType === selectedOption;
  };

  interface AuditResultOption {
    value: string;
    label: string;
  }

  dayjs.extend(LocalizedFormat).locale(intl.locale);

  const auditResultsSelectOptions = (origin: 'FROM_SELECTED' | 'FROM_TO_COMPARE') =>
    auditResults.map(auditResult => ({
      label: intl.formatMessage(
        { id: 'Audits.webpagetest_date_format' },
        {
          day: dayjs(auditResult.createdAt).format('L'),
          time: dayjs(auditResult.createdAt).format('LT'),
        },
      ),

      value: auditResult.auditId,
      isDisabled:
        origin === 'FROM_TO_COMPARE'
          ? auditResult.auditId === selectedAudit.auditId
          : dateComparatorDisplayed && auditResult.auditId === auditToCompare.auditId,
    }));

  const handleSelectDateChange = (origin: 'FROM_SELECTED' | 'FROM_TO_COMPARE') => (
    auditResultOption: ValueType<AuditResultOption | {}>,
  ) => {
    if (auditResultOption && 'value' in auditResultOption) {
      const correspondingAudit = auditResults.find(
        auditResult => auditResult.auditId === auditResultOption.value,
      );
      if (correspondingAudit) {
        origin === 'FROM_TO_COMPARE'
          ? setAuditToCompare(correspondingAudit)
          : setSelectedAudit(correspondingAudit);
      }
    }
  };

  const radioOptions: any = ['latest', 'dateSelector', 'dateComparator'].reduce(
    (cummulatedOptions, radioOptionType) => {
      return {
        ...cummulatedOptions,
        [radioOptionType]: {
          value: radioOptionType,
          label: `Audits.webpagetest_${radioOptionType}_audit`,
        },
      };
    },
    {},
  );

  const optionBlock = (radioOptionType: 'latest' | 'dateSelector' | 'dateComparator') => {
    return (
      <Style.OptionContainer margin={`0 0 ${getSpacing(4)} 0`}>
        <Style.RadioButton
          checked={isOptionSelected(radioOptionType)}
          type="radio"
          value={radioOptions[radioOptionType].value}
          name="audit"
          onClick={e => handleRadioButtonChange(e, radioOptionType)}
          style={{ cursor: 'pointer' }}
          readOnly={true}
        />
        <Style.RadioButtonLabel margin={`0 ${getSpacing(2)} 0 0`} />
        <Style.RadioButtonText onClick={e => handleRadioButtonChange(e, radioOptionType)}>
          <FormattedMessage id={radioOptions[radioOptionType].label} />
        </Style.RadioButtonText>
      </Style.OptionContainer>
    );
  };

  return (
    <Style.Container margin={blockMargin}>
      <Style.SubTitle margin={`0 0 ${getSpacing(4)} 0`} data-testid="title">
        <FormattedMessage id="Audits.webpagetest_detailed_results" />
      </Style.SubTitle>
      <Style.Form>
        <Style.FormLabel data-testid="subtitle">
          <FormattedMessage id="Audits.webpagetest_choose_results" />
        </Style.FormLabel>
        <Style.FormInputs>
          {optionBlock('latest')}
          {optionBlock('dateSelector')}
          {auditResults.length > 1 && optionBlock('dateComparator')}
        </Style.FormInputs>
      </Style.Form>
      {(dateSelectorDisplayed || dateComparatorDisplayed) && (
        <Style.Form data-testid="select-dates-form">
          <Style.FormLabel>
            {dateComparatorDisplayed ? (
              <FormattedMessage id="Audits.webpagetest_select_dates" />
            ) : (
              <FormattedMessage id="Audits.webpagetest_select_date" />
            )}
          </Style.FormLabel>
          <Style.FormInputs>
            <Style.DateSelectorContainer margin={`0 0 ${getSpacing(2)} 0`}>
              <Style.DateTitle margin={`0 0 ${getSpacing(2)} 0`}>
                {dateComparatorDisplayed ? (
                  'Date 1'
                ) : (
                  <FormattedMessage id="Audits.webpagetest_date_label" />
                )}
              </Style.DateTitle>
              <Select
                value={auditResultsSelectOptions('FROM_SELECTED').find(
                  auditResultSelectOption =>
                    selectedAudit.auditId === auditResultSelectOption.value,
                )}
                onChange={handleSelectDateChange('FROM_SELECTED')}
                options={auditResultsSelectOptions('FROM_SELECTED')}
              />
            </Style.DateSelectorContainer>
            {dateComparatorDisplayed && (
              <Style.DateSelectorContainer>
                <Style.DateTitle margin={`0 0 ${getSpacing(2)} 0`}>Date 2</Style.DateTitle>
                <Select
                  value={auditResultsSelectOptions('FROM_TO_COMPARE').find(
                    auditResultSelectOption =>
                      auditToCompare.auditId === auditResultSelectOption.value,
                  )}
                  onChange={handleSelectDateChange('FROM_TO_COMPARE')}
                  options={auditResultsSelectOptions('FROM_TO_COMPARE')}
                />
              </Style.DateSelectorContainer>
            )}
          </Style.FormInputs>
        </Style.Form>
      )}
      <Style.WebPageTestLink href={getWebPageTestUrl()} target={'_blank'}>
        <FormattedMessage id="Audits.webpagetest_results" />
      </Style.WebPageTestLink>
    </Style.Container>
  );
};

export default WebPageTestBlock;
