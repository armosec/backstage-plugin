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
import React, { useContext, useReducer, useState, useEffect } from 'react';
import { Page, Content, Progress } from '@backstage/core-components';
import AppHeader from '../../components/AppHeader';
import AppContext from '../../Contexts/AppContext';
import AppReducer from '../../Reducers/AppReducer';
import { useApi } from '@backstage/core-plugin-api';
import { myAwesomeApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import Alert from '@material-ui/lab/Alert';
import CreateTenant from '../../components/CreateTenant/CreateTenant';
import HelmScript from '../../components/HelmScript/HelmScript';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';

export const HomePage = () => {
  const initialState = useContext(AppContext);
  const [state, dispatch] = useReducer(AppReducer, initialState, undefined);
  const navigate = useNavigate();
  console.log(state, 'state');
  const [userId, setUserId] = useState('');
  const [isNoTenants, setIsNoTenants] = useState(true);
  const [isTenantCreated, setIsTenantCreated] = useState(false);
  const [lastReportDate, setLastReportDate] = useState('');
  const [isHelmedCopied, setIsHelmedCopied] = useState(false);
  //console.log(kubernetesApiRef.getClusters(), "cluster")
  const apiClient = useApi(myAwesomeApiRef);
  // const apiK8s = useApi(kubernetesApiRef);
  //const kubernetesAuthProvidersApi = useApi(kubernetesAuthProvidersApiRef);
  useEffect(() => {
    if (isHelmedCopied) {
      navigate('/controls');
    }
  }, [isHelmedCopied]);
  const { loading, error, value } = useAsync(async (): Promise<any> => {
    const login = await apiClient.armoLogin();
    setUserId(login.data.rows[0].id);

    const tenantDetails = await apiClient.getTenantDetails();
    setIsNoTenants(!tenantDetails?.state?.onboarding?.completed);
    const clustersOvertime = await apiClient.getClustersOvertime({
      customerGUID: tenantDetails.data.guid,
      orderBy: 'designators.attributes.namespace:asc',
      innerFilters: [{ clusterName: 'minikube' }],
    });

    const controls = await apiClient.getScannedControls({
      customerGUID: tenantDetails.data.guid,
      pageSize: 100,
      pageNum: 1,
      orderBy: 'timestamp:desc',
      innerFilters: [
        {
          frameworkName: 'AllControls',
          reportGUID: '820727d8-f625-4a96-9623-f9223b1cf1a2',
          statusText: 'failed',
        },
      ],
    });

    const clusterDetails =
      clustersOvertime?.data?.response[0]?.clusterName &&
      (await apiClient.getCluster({
        customerGUID: tenantDetails?.data.guid,
        clusterName: clustersOvertime?.data.response[0]?.clusterName,
      }));

    dispatch({
      type: 'SET_INIT_DATA',
      payload: {
        controls: controls?.data.response,
        tenantDetails: tenantDetails?.data,
        clustersOvertime: clustersOvertime?.data?.response,
        clusterDetails: clusterDetails?.response,
        lastReportGUID:
          clusterDetails?.data.attributes.workerNodes.lastReportGUID,
        lastReportDate:
          clusterDetails?.data.attributes.workerNodes.lastReportDate,
      },
    });

    setLastReportDate(
      clusterDetails?.data.attributes.workerNodes.lastReportDate,
    );

    return {
      controls: controls?.data.response,
      tenantDetails: tenantDetails?.data,
    };
  }, []);

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
        />
        {isNoTenants && !isTenantCreated ? (
          <Content>
            <CreateTenant
              userId={userId}
              setIsTenantCreated={setIsTenantCreated}
            />
          </Content>
        ) : (
          !isHelmedCopied && (
            <HelmScript
              customerGUID={value.tenantDetails.guid}
              setIsHelmedCopied={setIsHelmedCopied}
            />
          )
        )}
      </Page>
    </AppContext.Provider>
  );
};
