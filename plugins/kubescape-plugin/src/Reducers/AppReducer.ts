interface IAction {
  type: string;
  payload: any;
}

export default function AppReducer(state: any, action: IAction) {
  const actionPayload = action.payload;
  switch (action.type) {
    case 'SET_CONTROLS':
      return {
        ...state,
        controls: actionPayload.controls,
      };
    case 'SET_SELECTED_FILTERS':
      return {
        ...state,
        selectedFilters: actionPayload.selectedFilters,
      };

    case 'SET_INIT_DATA':
      return {
        ...state,
        selectedControl: actionPayload.selectedControl,
        tenantDetails: actionPayload.tenantDetails,
        clustersOvertime: actionPayload.clustersOvertime,
        lastReportDate: actionPayload.lastReportDate,
        lastReportGUID: actionPayload.lastReportGUID,
      };

    default:
      return state;
  }
}
