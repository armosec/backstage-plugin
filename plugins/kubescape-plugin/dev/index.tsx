import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { kubescapePluginPlugin, KubescapePluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(kubescapePluginPlugin)
  .addPage({
    element: <KubescapePluginPage />,
    title: 'Root Page',
    path: '/kubescape-plugin'
  })
  .render();
