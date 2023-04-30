import { DiscoveryApi } from '@backstage/core-plugin-api';
import axios from 'axios';

import { createApiRef } from '@backstage/core-plugin-api';

export interface User {
  name: string;
  email: string;
}

export interface MyAwesomeApi {
  getVScanVulnerabilities: any;
  getScannedControls: any;
  getResources: any;
  getTenants: any;
  getTenantDetails: any;
  getClustersOvertime: any;
  scanCluster: any;
  getCluster: any;
  armoLogin: any;
  createTenant: any;
  getConnectedClusters: any;
}

export const myAwesomeApiRef = createApiRef<MyAwesomeApi>({
  id: 'plugin.my-awesome-api.service',
});

axios.defaults.withCredentials = true;
export class MyAwesomeApiClient implements MyAwesomeApi {
  discoveryApi: DiscoveryApi;

  constructor({ discoveryApi }: { discoveryApi: DiscoveryApi }) {
    this.discoveryApi = discoveryApi;
  }

  async getTenants<T = any>(): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.get(
      `${backendUri}/frontegg/identity/resources/users/v2/me/tenants`,
      {
        headers,
      },
    );
  }

  async getTenantDetails<T = any>(): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.get(`${backendUri}/api/v1/tenants/tenantDetails`, {
      headers,
    });
  }

  async getVScanVulnerabilities<T = any>({
    customerGUID,
    pageSize,
    pageNum,
    orderBy,
    innerFilters,
  }: {
    customerGUID: string;
    pageSize: number;
    pageNum: number;
    orderBy: string;
    innerFilters: Array<{
      'severitiesStats.fixedTotal': string;
      timestamp: string;
    }>;
  }): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
    };
    // As configured previously for the backend proxy
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.post(
      `${backendUri}/api/v1/vulnerability/scanResultsSumSummary?customerGUID=${customerGUID}`,
      { pageSize, pageNum, orderBy, innerFilters },
      { headers },
    );
  }

  async getResources({
    customerGUID,
    pageSize,
    pageNum,
    orderBy,
    innerFilters,
    controlName,
  }: {
    customerGUID: string;
    pageSize: number;
    pageNum: number;
    orderBy: string;
    innerFilters: Array<{
      'severitiesStats.fixedTotal': string;
      timestamp: string;
    }>;
    controlName: string;
  }): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    // As configured previously for the backend proxy
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.post(
      `${backendUri}/api/v1/posture/resources?ignoreRulesSummary=true&controlName=${controlName}&customerGUID=${customerGUID}`,
      { pageSize, pageNum, orderBy, innerFilters },
      { headers },
    );
  }

  async getScannedControls({
    customerGUID,
    pageSize,
    pageNum,
    orderBy,
    innerFilters,
  }: {
    customerGUID: string;
    pageSize: number;
    pageNum: number;
    orderBy: string;
    innerFilters: Array<{
      'severitiesStats.fixedTotal': string;
      timestamp: string;
    }>;
  }): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    // As configured previously for the backend proxy
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.post(
      `${backendUri}/api/v1/posture/controls?customerGUID=${customerGUID}`,
      { pageSize, pageNum, orderBy, innerFilters },
      { headers },
    );
  }

  async getClustersOvertime({
    customerGUID,
    innerFilters,
    since,
    until,
  }: {
    customerGUID: string;
    since: string;
    until: string;
    innerFilters: Array<{
      'severitiesStats.fixedTotal': string;
      timestamp: string;
    }>;
  }): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.post(
      `${backendUri}/api/v1/posture/clustersOvertime?customerGUID=${customerGUID}`,
      { until, since, innerFilters },
      { headers },
    );
  }

  async getConnectedClusters({
    customerGUID,
  }: {
    customerGUID: string;
  }): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.get(
      `${backendUri}/api/v1/customerState/connectedClusters?customerGUID=${customerGUID}`,
      {
        headers,
      },
    );
  }

  async scanCluster({
    customerGUID,
    clusterName,
    cronTabSchedule,
  }: {
    customerGUID: string;
    clusterName: string;
    cronTabSchedule: string;
  }): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.post(
      `${backendUri}/api/v1/vulnerability/scan/v2?customerGUID=${customerGUID}`,
      [{ clusterName, cronTabSchedule }],
      { headers },
    );
  }

  async getCluster({
    customerGUID,
    clusterName,
  }: {
    customerGUID: string;
    clusterName: string;
  }) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    return await axios.get(
      `${backendUri}/api/v1/cluster?name=${clusterName}&customerGUID=${customerGUID}`,
      { headers },
    );
  }

  async armoLogin() {
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    const headers = {
      'Content-Type': 'application/json',
    };
    await axios.get(`${backendUri}/frontegg/identity/resources/sso/v2`, {
      headers,
    });
    // await axios.post(
    //   `${backendUri}/frontegg/identity/resources/auth/v1/user/token/refresh`,
    //   undefined,
    //   { headers },
    // );
    return await axios.get(
      `${backendUri}/frontegg/metadata?entityName=adminBox`,
      { headers },
    );
  }

  async createTenant({
    userId,
    customerName,
  }: {
    userId: string;
    customerName: string;
  }) {
    const backendUri = await this.discoveryApi.getBaseUrl('proxy');
    const headers = {
      'Content-Type': 'application/json',
    };
    return await axios.post(
      `${backendUri}/api/v1/tenants/createTenant`,
      { customerName, userId },
      { headers },
    );
  }
}
