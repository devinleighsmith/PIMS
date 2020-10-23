import { ISnapshot } from './interfaces';
import { CellProps } from 'react-table';
import { formatMoney } from 'utils';

const howManyColumns = 13;
const totalWidthPercent = 100; // how wide the table should be; e.g. 100%

// Setup a few sample widths: x/2, 1x, 2x (percentage-based)
const unit = Math.floor(totalWidthPercent / howManyColumns);
const spacing = {
  xxsmall: 1,
  xsmall: unit / 4,
  small: unit / 2,
  medium: unit,
  large: unit * 2,
  xlarge: unit * 4,
  xxlarge: unit * 8,
};

export const columns: any[] = [
  {
    Header: 'SPP No.',
    accessor: 'project.projectNumber', // accessor is the "key" in the data
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 65, // px
  },
  {
    Header: 'Fiscal Year',
    accessor: 'project.actualFiscalYear',
    align: 'left',
    responsive: false,
    width: 50,
    minWidth: 50,
  },
  {
    Header: 'Agency',
    accessor: (row: ISnapshot) => row?.project?.agency ?? row?.project?.subAgency ?? '',
    align: 'left',
    responsive: false,
    width: 50,
    minWidth: 50,
  },
  {
    Header: 'Name',
    accessor: 'project.name',
    align: 'left',
    responsive: true,
    width: spacing.medium,
    minWidth: 80,
  },
  {
    Header: 'CMV',
    accessor: 'estimated',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.estimated);
    },
  },
  {
    Header: 'NBV',
    accessor: 'netBook',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.netBook);
    },
  },
  {
    Header: 'Sales Cost',
    accessor: 'salesCost',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.salesCost);
    },
  },
  {
    Header: 'Program Cost',
    accessor: 'programCost',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.programCost);
    },
  },
  {
    Header: 'Gain Loss',
    accessor: 'gainLoss',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.gainLoss);
    },
  },
  {
    Header: 'OCG Fin. Stmts.',
    accessor: 'ocgFinancialStatements',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.ocgFinancialStatement);
    },
  },
  {
    Header: 'Interest Comp.',
    accessor: 'interestComponent',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.interestComponent);
    },
  },
  {
    Header: 'Net Proceeds',
    accessor: 'netProceeds',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.netProceeds);
    },
  },
  {
    Header: 'Baseline Integrity',
    accessor: 'baselineIntegrity',
    align: 'left',
    responsive: true,
    width: spacing.small,
    minWidth: 80,
    Cell: (props: CellProps<ISnapshot>) => {
      return formatMoney(props.row.original.baselineIntegrity);
    },
  },
];
