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
import React, { useContext, useMemo, useReducer, useState } from 'react';
import {Typography, Grid, Button} from '@material-ui/core';
import {Page, Content, Progress, ContentHeader} from '@backstage/core-components';
import AppHeader from '../../components/AppHeader';
import AppContext from '../../Contexts/AppContext';
import AppReducer from '../../Reducers/AppReducer';
import ControlsTable from '../../components/Controls/ControlsTable';
import { useApi } from '@backstage/core-plugin-api';
import { myAwesomeApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import moment from "moment/moment";

export const ControlsPage = () => {
  const initialState = useContext(AppContext);
  const [state, dispatch] = useReducer(AppReducer, initialState, undefined);
  console.log(state, 'state');
  const { selectedFilters, lastReportGUID } = state;
  const [lastReportDate, setLastReportDate] = useState('');
  const [clientId, setClientId] = useState('');
  const apiClient = useApi(myAwesomeApiRef);
  const { loading, error, value } = useAsync(async (): Promise<any> => {
    //const clusters = await apiK8s.getClusters()
    //console.log(clusters, "clusters")
    const login = await apiClient.armoLogin();
    console.log(login);

    //console.log(login.data[1], 'login');
    setClientId(login.data.rows[0].id);
    const tenant = await apiClient.getTenantDetails();

    console.log(tenant, 'tenant');
    const controls = await apiClient.getScannedControls({
      customerGUID: tenant.data.guid,
      pageSize: 100,
      pageNum: 1,
      orderBy: 'timestamp:desc',
      innerFilters: [
        {
          frameworkName: 'AllControls',
          reportGUID: lastReportGUID,
          statusText: 'failed',
        },
      ],
    });
    console.log(tenant, 'tenant');

    const connectedClusters = await apiClient.getConnectedClusters({
      customerGUID: tenant.data.guid,
    });


    const clustersOvertime = await apiClient.getClustersOvertime({
      customerGUID: tenant.data.guid,
      orderBy: 'designators.attributes.namespace:asc',
      innerFilters: [
        {
          clusterName: connectedClusters.data.clusters[0].cluster.caClusterName,
        },
      ],
    });

    console.log(connectedClusters, 'connectedClusters');

    const clusterDetails = await apiClient.getCluster({
      customerGUID: tenant.data.guid,
      clusterName: connectedClusters.data.clusters[0].cluster.caClusterName,
    });

    console.log(clusterDetails, 'clusterDetails');

    dispatch({
      type: 'SET_INIT_DATA',
      payload: {
        controls: controls.data.response,
        tenantDetails: tenant.data,
        clustersOvertime: clustersOvertime.data.response,
        clusterDetails: clusterDetails.response,
        lastReportGUID:
          clusterDetails.data.attributes.workerNodes.lastReportGUID,
        lastReportDate:
          clusterDetails.data.attributes.workerNodes.lastReportDate,
      },
    });

    setLastReportDate(
      clusterDetails.data.attributes.workerNodes.lastReportDate,
    );

    return {
      controls: controls.data.response,
      tenantDetails: tenant.data,
      connectedClusters: connectedClusters.data,
      clustersOvertime: clustersOvertime.data.response,
    };
  }, []);

  const accountName = useMemo(() => {
    const tenantDetails = value?.tenantDetails;
    const lastIndex = tenantDetails?.name?.lastIndexOf(' ');
    return tenantDetails?.name?.substring(0, lastIndex) || '';
  }, [value?.tenantDetails]);

  const handleRescan = async () => {
    await apiClient.scanCluster({
      customerGUID: value.tenantDetails.guid,
      clusterName: value.clustersOvertime[0].clusterName,
      cronTabSchedule: '',
    });
    const clusterDetails = await apiClient.getCluster({
      customerGUID: value.tenantDetails.guid,
      clusterName: value.clustersOvertime[0].clusterName,
    });
    setLastReportDate(
        clusterDetails.data.attributes.workerNodes.lastReportDate,
    );
  };

  if (loading) {
    return <Progress />;
  } else if (error) {
    console.log(error, 'err');
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      <Page themeId="tool">
        <AppHeader
          title="Welcome to ARMO kubescape-plugin!"
          subtitle="See all your Kubescape resources"
        >
          <Grid style={{ padding: '10px' }}>
            <Typography>Account Details:</Typography>
            <Typography>{accountName}</Typography>
            <Typography>{value.tenantDetails.guid}</Typography>
          </Grid>
        </AppHeader>
        <Content>
          <ContentHeader title="Kubescape results">
            {lastReportDate && (
                <Grid>
                  <Typography>Last rescan: </Typography>
                  <Typography>
                    {moment(lastReportDate).format('MMMM Do YYYY, h:mm:ss')}
                  </Typography>
                </Grid>
            )}
            <Button onClick={handleRescan}>Rescan</Button>
          </ContentHeader>
          <Grid container spacing={3} direction="column">
            <Grid item>
              {value?.controls && <ControlsTable controls={value?.controls} />}
            </Grid>
          </Grid>
        </Content>
      </Page>
    </AppContext.Provider>
  );
};
