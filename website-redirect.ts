import route53 = require('@aws-cdk/aws-route53');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import targets = require('@aws-cdk/aws-route53-targets/lib');
import { RedirectProtocol } from '@aws-cdk/aws-s3';

export interface WebsiteRedirectProps extends cdk.StackProps {
    readonly domainName: string;
    readonly targetDomainName: string;
    readonly useSSL: boolean;
}

export class WebsiteRedirectStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: WebsiteRedirectProps) {
        super(scope, id, props);

        const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domainName });

        const siteBucket = new s3.Bucket(this, 'SiteBucket', {
            bucketName: props.domainName,
            websiteRedirect: {
                protocol: props.useSSL ? RedirectProtocol.HTTPS : RedirectProtocol.HTTP,
                hostName: props.targetDomainName
            },
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });

        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: props.domainName,
            target: route53.AddressRecordTarget.fromAlias(new targets.BucketWebsiteTarget(siteBucket)),
            zone
        });
    }
}