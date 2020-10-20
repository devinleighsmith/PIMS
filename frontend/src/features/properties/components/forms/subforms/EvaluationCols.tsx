import moment from 'moment';
import { FastCurrencyInput } from 'components/common/form';
import React from 'react';
import { useFormikContext } from 'formik';
import _ from 'lodash';
import { sumFinancials } from './SumFinancialsForm';
import { IFinancialYear } from './EvaluationForm';
import { formatMoney } from 'utils';

const getEditableMoneyCell = (disabled: boolean | undefined, namespace: string, type: string) => {
  return (cellInfo: any) => {
    const context = useFormikContext();
    if (disabled) {
      return cellInfo.value ?? null;
    }
    return type === 'assessed' && cellInfo.row.values['assessed.year'] > moment().year() ? (
      'N/A'
    ) : (
      <FastCurrencyInput
        key={`${namespace}.${cellInfo.row.index}.${type}.value`}
        formikProps={context}
        field={`${namespace}.${cellInfo.row.index}.${type}.value`}
        tooltip="If value not available enter $1 and add notes"
        disabled={disabled}
      />
    );
  };
};

const getSummedAssessed = (year: number, context: any, financials: IFinancialYear[]) => {
  return sumFinancials(
    financials.map(x => x.assessed),
    year,
  ).Assessed;
};

const getImprovements = () => {
  return (cellInfo: any) => {
    const context = useFormikContext<any>();
    const year = cellInfo.row.values['assessed.year'];
    const allFinancials = [..._.flatten(_.map(context.values?.buildings ?? [], 'financials'))];
    const total = getSummedAssessed(year, context, allFinancials);
    const improvement = total - cellInfo.row.values['assessed.value'];
    return improvement > 0 ? formatMoney(improvement) : null;
  };
};

const getTotal = () => {
  return (cellInfo: any) => {
    const context = useFormikContext<any>();
    const year = cellInfo.row.values['assessed.year'];
    const allFinancials = [
      ...(context.values?.financials ?? []),
      ..._.flatten(_.map(context.values?.buildings ?? [], 'financials')),
    ];
    const total = getSummedAssessed(year, context, allFinancials);
    return total > 0 ? formatMoney(total) : null;
  };
};

export const getEvaluationCols = (
  disabled?: boolean,
  namespace = 'financials',
  includeSums?: boolean,
): any => {
  const basicAssessed = [
    {
      Header: 'Year',
      accessor: 'assessed.year', // accessor is the "key" in the data
      maxWidth: 30,
      align: 'left',
    },
    {
      Header: 'Land',
      accessor: 'assessed.value',
      maxWidth: 60,
      align: 'left',
      Cell: getEditableMoneyCell(disabled, namespace, 'assessed'),
    },
  ];
  const sumAssessed = [
    {
      Header: 'Improvements',
      accessor: 'assessed.improvements',
      maxWidth: 60,
      align: 'left',
      Cell: getImprovements(),
    },
    {
      Header: 'Total',
      accessor: 'assessed.total',
      maxWidth: 60,
      align: 'left',
      Cell: getTotal(),
    },
  ];
  const otherColumns = [
    {
      Header: 'Net Book',
      columns: [
        {
          Header: 'Fiscal Year',
          accessor: 'netbook.fiscalYear',
          maxWidth: 60,
          align: 'left',
        },
        {
          Header: 'Value',
          accessor: 'netbook.value',
          maxWidth: 60,
          align: 'left',
          Cell: getEditableMoneyCell(disabled, namespace, 'netbook'),
        },
      ],
    },
    {
      Header: 'Estimated Market Value',
      columns: [
        {
          Header: 'Fiscal Year',
          accessor: 'estimated.fiscalYear',
          maxWidth: 60,
          align: 'left',
        },
        {
          Header: 'Value',
          accessor: 'estimated.value',
          maxWidth: 60,
          align: 'left',
          Cell: getEditableMoneyCell(disabled, namespace, 'estimated'),
        },
      ],
    },
  ];
  if (includeSums) {
    return [{ Header: 'Assessed', columns: [...basicAssessed, ...sumAssessed] }, ...otherColumns];
  } else {
    return [{ Header: 'Assessed', columns: [...basicAssessed] }, ...otherColumns];
  }
};
