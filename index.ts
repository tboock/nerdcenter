#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { WebsiteRedirectStack } from './website-redirect';

const app = new cdk.App();

new WebsiteRedirectStack(app, 'NerdcenterRedirect', {
    domainName: 'nerdcenter.de',
    targetDomainName: 'codegy.de',
    useSSL: true,
    env: {
        account: '424337118321',
        region: 'eu-central-1'
    }
});

app.synth();