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
import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import { Table, TableColumn, StatusError } from '@backstage/core-components';
import AppContext from '../../Contexts/AppContext';
import { Button, Grid, Modal, Typography } from '@material-ui/core';
import armoBackstageTheme from '../../../../../packages/app/src/Utils/armoBackstageTheme';
import { useApi } from '@backstage/core-plugin-api';
import { myAwesomeApiRef } from '../../api';
import ReactTable from '../Table/Table';

const useStyles = makeStyles({
  modal: {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    backgroundColor: armoBackstageTheme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: armoBackstageTheme.spacing(1),
    p: 4,
    '& h2': {
      backgroundColor: armoBackstageTheme.palette.banner.text,
      padding: '20px',
    },
  },
  tableRapper: {
    padding: '20px',
    backgroundColor: '#fff',
  },
  root: {
    //backgroundColor: armoBackstageTheme.palette.background.paper,
    '& tr': {
      backgroundColor: '#000',
    },
    '& th': {
      fontWeight: 'bold',
      fontSize: '16px',
      //color: armoBackstageTheme.palette.navigation.selectedColor,
      //backgroundColor: armoBackstageTheme.palette.banner.link,
    },
    '& h2': {
      width: '200px',
    },
    width: '100%',
    justifyContent: 'flex-start',
  },
});

const ControlsTable = ({ controls }: any) => {
  const { tenantDetails, lastReportGUID } = useContext(AppContext);
  const [isResourcesLimitsOpen, setIsResourcesLimitsOpen] = useState(false);
  const classes = useStyles();
  const apiClient = useApi(myAwesomeApiRef);
  const [resources, setResources] = useState([]);

  const columns: TableColumn[] = [
    {
      title: 'Status',
      field: 'statusText',
      width: '30px',
      render: () => {
        return (
          <Box alignItems="center">
            <StatusError />
          </Box>
        );
      },
      align: 'center',
    },
    { title: 'ID', field: 'id' },
    { title: 'Name', field: 'name' },
    { title: 'Failed Resources Count', field: 'failedResourcesCount' },
    { title: 'Description', field: 'description' },
    { title: 'Remediation', field: 'remediation' },
    {
      title: '',
      field: 'fix',
      render: (rowData: any) => {
        return (
          <Box alignItems="center">
            <Button
              component={Link}
              to={`https://cloud.armosec.io/failed-resource/view?controlIds=${rowData?.id}&frameworkName=AllControls&reportGuid=${controls.reportGUID}&resourceName=aeb6df18-5ce8-4bfc-9fc8-aaab67f64fb6&resourceName=kubescape-sa&resourceId=%2Fv1%2Fkube-system%2FPod%2Fkube-apiserver-minikube`}
            >
              Fix
            </Button>
          </Box>
        );
      },
    },
  ];

  const columnsResources = React.useMemo(
    () => [
      {
        Header: 'Cluster',
        accessor: 'designators.attributes.cluster',
      },
      {
        Header: 'Namespace',
        accessor: 'designators.attributes.namespace',
      },
      {
        Header: 'Kind',
        accessor: 'designators.attributes.kind',
      },
      {
        Header: 'Name',
        accessor: 'designators.attributes.name',
      }
    ],
    [],
  );

  const data = React.useMemo(() => {
    console.log(resources, 'resources');
    return resources;
  }, [resources]);

  return (
    <Grid className={classes.root}>
      <h1>Compliance</h1>
      {controls?.length && (
        <Table
          options={{ search: false, paging: false }}
          filters={[
            { column: 'ID', type: 'multiple-select' },
            { column: 'Name', type: 'multiple-select' },
          ]}
          columns={columns}
          data={controls}
          onRowClick={async (event: any, rowData: any) => {
            const controlResources = await apiClient.getResources({
              customerGUID: tenantDetails?.guid,
              pageSize: 100,
              pageNum: 1,
              orderBy: 'designators.attributes.namespace:asc',
              innerFilters: [
                {
                  frameworkName: 'AllControls',
                  reportGUID: controls[0].reportGUID,
                  failedControls: rowData?.id,
                },
                {
                  frameworkName: 'AllControls',
                  reportGUID: controls[0].reportGUID,
                  warningControls: rowData?.id,
                  warningControlsCount: '1|greater',
                },
              ],
              controlName: rowData.name,
            });
            setResources(
              controlResources.data.response.filter(
                (resource: any) => !resource.ignoreRulesSummary,
              ),
            );
            setIsResourcesLimitsOpen(true);
          }}
        />
      )}
      <Modal
        open={isResourcesLimitsOpen}
        onClose={() => setIsResourcesLimitsOpen(false)}
        aria-labelledby="modal-resources-limits"
        aria-describedby="modal-resources-limits-description"
      >
        <Box className={classes.modal}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Control Resources
          </Typography>
          {resources ? (
            <Box className={classes.tableRapper}>
              <ReactTable
                data={data}
                columns={columnsResources}
                className={classes.root}
              />
            </Box>
          ) : null}
        </Box>
      </Modal>
    </Grid>
  );
};

export default ControlsTable;
