import { myAwesomeApiRef, MyAwesomeApiClient } from './api';
import {
    createPlugin,
    createApiFactory,
    createRoutableExtension,
    discoveryApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const kubescapePluginPlugin = createPlugin({
  id: 'kubescape-plugin',
  routes: {
    root: rootRouteRef,
  },
    apis: [
        createApiFactory({
            api: myAwesomeApiRef,
            deps: { discoveryApi: discoveryApiRef },
            factory: ({ discoveryApi }) => new MyAwesomeApiClient({ discoveryApi }),
        }),
    ],
});

export const KubescapePluginPage = kubescapePluginPlugin.provide(
  createRoutableExtension({
    name: 'KubescapePluginPage',
    component: () =>
      import('./Screens/HomePage').then(m => m.HomePage),
    mountPoint: rootRouteRef
  }),
);

export const KubescapePluginControlsPage = kubescapePluginPlugin.provide(
    createRoutableExtension({
        name: 'KubescapePluginControlsPage',
        component: () =>
            import('./Screens/ControlsPage').then(m => m.ControlsPage),
        mountPoint: rootRouteRef
    }),
);

export const KubescapePluginVulnerabilitiesPage = kubescapePluginPlugin.provide(
    createRoutableExtension({
        name: 'KubescapePluginVulnerabilitiesPage',
        component: () =>
            import('./Screens/VulnerabilitiesPage').then(m => m.VulnerabilitiesPage),
        mountPoint: rootRouteRef
    }),
);
