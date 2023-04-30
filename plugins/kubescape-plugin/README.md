# kubescape-plugin

Welcome to the Armo kubescape-plugin !

_This plugin was created through the Backstage CLI_

## Plugin overview
Open-source Kubernetes Security platform, made for DevOps.
Our patented technology and open-source solutions fit natively within the CI/CD pipeline and existing development tools, 
assuring DevOps, DevSecOps, and developers that every Kubernetes cluster, container, and microservice is born and remains secure,
from development to production and from configuration to run-time, every time.
By kubescape-plugin you can have all of our platform tools at one place.

You can read more here:
https://hub.armosec.io/docs

## Install the plugin into Backstage

cd packages/app
yarn add @backstage/armo-kubescape-plugin

Add proxy config to the app-config.yaml file:
    
    proxy:
        '/frontegg':
        target: 'https://auth.armosec.io'
        secure: false
        changeOrigin: true
        pathRewrite:
        '^/api/proxy/frontegg/': '/frontegg/'
        
        '/api/v1':
        target: 'https://api.armosec.io'
        secure: false
        changeOrigin: true
        pathRewrite:
        '^/api/proxy/api/v1/': '/api/v1/'


## Getting started

You can access it by running `yarn start` in the root directory, and then navigating to [/kubescape-plugin](http://localhost:3000/kubescape-plugin).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
