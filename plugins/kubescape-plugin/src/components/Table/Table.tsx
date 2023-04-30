import React from 'react';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useTable, useSortBy, useFilters } from 'react-table';
const Table = ({
  data,
  columns,
  className,
}: {
  data: any;
  columns: any;
  className?: string;
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: '',
    }),
    [],
  ) as any;
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useSortBy,
  );
  return (
    <MaUTable {...getTableProps()} className={className}>
      <TableHead>
        {headerGroups?.map((headerGroup: any) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers?.map((column: any) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render('Header')}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody>
        {rows?.map((row: any, i: number) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells?.map((cell: any) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </MaUTable>
  );
};

export default Table;
