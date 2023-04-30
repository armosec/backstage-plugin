import { createContext } from 'react';

interface IState {
  vulnerabilities: [];
  selectedFilters: { cluster: []; kind: []; name: []; namespace: [] };
  selectedControl: string;
  tenantDetails: object;
  clustersOvertime: [];
  clusterDetails: [];
  lastReportGUID: string;
  lastReportDate: string;
  dispatch: any;
}

const appState: IState = {
  vulnerabilities: [],
  selectedFilters: { cluster: [], kind: [], name: [], namespace: [] },
  selectedControl: '',
  tenantDetails: { guid: '' },
  clustersOvertime: [],
  clusterDetails: [],
  lastReportGUID: '',
  lastReportDate: '',
  dispatch: () => {},
};

const AppContext = createContext<IState>({
  ...appState,
});

export default AppContext;
