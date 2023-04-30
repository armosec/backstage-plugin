/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import {
  Table,
  TableColumn,
  StatusError,
  StatusOK,
} from '@backstage/core-components';
import { Button, Grid, Typography } from '@material-ui/core';
import moment from 'moment';
import { Tooltip } from 'react-tooltip';

const useStyles = makeStyles({
  tableRapper: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  root: {
    '& h2': {
      width: '200px',
    },
  },
});

const VulnerabilitiesTable = ({ vulnerabilities }: any) => {
  const classes = useStyles();

  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'High':
        return '#ff808b';
      case 'Critical':
        return '#ff1167';
      case 'Medium':
        return '#053ca1';
      case 'Unknown':
        return '#b6c8c9';
      default:
        return '#b6c8c9';
    }
  }, []);

  const columns: TableColumn[] = [
    {
      title: 'Status',
      field: 'statusText',
      width: '30px',
      render: (rowData: any) => {
        return (
          <Box alignItems="center">
            {rowData.status === 'Success' ? <StatusOK /> : <StatusError />}
          </Box>
        );
      },
      align: 'center',
    },
    {
      title: 'SCAN Time',
      field: 'timestamp',
      render: (rowData: any) => {
        return (
          <Box alignItems="center">
            <Typography>
              {moment(rowData.timeStamp).format('MMMM Do YYYY, h:mm:ss')}
            </Typography>
          </Box>
        );
      },
    },
    { title: 'Cluster', field: 'cluster' },
    { title: 'Namespace', field: 'namespace' },
    {
      title: 'Workload',
      field: 'wlid',
      render: (rowData: any) => {
        return (
          <Box alignItems="center">
            <Typography>{rowData.wlid.split('/')[4]}</Typography>
          </Box>
        );
      },
    },
    { title: 'Container Name', field: 'containerName' },
    {
      title: 'Severity',
      field: 'severitiesStats',
      render: (rowData: any) => {
        return (
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            {rowData.severitiesStats.map(
              (sevStat: { severity: string; total: number }, index: number) => {
                return (
                  <Box alignItems="center" key={index}>
                    <Button
                      data-tooltip-id={`severity-tooltip ${sevStat.severity} ${index}`}
                      data-tooltip-content={sevStat.severity}
                      style={{
                        backgroundColor: getSeverityColor(sevStat.severity),
                        margin: '10px',
                      }}
                    >
                      {sevStat.total}
                    </Button>
                    <Tooltip
                      delayHide={0}
                      id={`severity-tooltip ${sevStat.severity} ${index}`}
                      style={{ position: 'absolute' }}
                    />
                  </Box>
                );
              },
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Grid className={classes.root}>
      <h1>Vulnerabilities</h1>
      <Table
        options={{ search: false, paging: false }}
        columns={columns}
        data={vulnerabilities}
        filters={[
          { column: 'Container Name', type: 'multiple-select' },
          { column: 'Cluster', type: 'multiple-select' },
          { column: 'Namespace', type: 'multiple-select' },
          { column: 'Workload', type: 'multiple-select' },
        ]}
      />
    </Grid>
  );
};

export default VulnerabilitiesTable;
