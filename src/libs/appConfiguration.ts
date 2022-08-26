import _ from 'lodash';
import { KubepiterApp, KubepiterAppConfig } from 'src/types/common';

/**
 * Extract the configutation part from the whole application data
 *
 * @param app
 */
export function extractAppConfigurationFromApp(app: KubepiterApp): KubepiterAppConfig {
  return {
    ingress: app.ingress,
    port: app.port,
    env: app.env,
    nodeGroup: app.nodeGroup,
    replicas: app.replicas,
    resources: app.resources,
  };
}

/**
 * Check if two config are the same or not
 *
 * @param config1 App configuration 1
 * @param config2 App configuration 2
 */
export function sameAppConfiguration(config1: KubepiterAppConfig, config2: KubepiterAppConfig | null): boolean {
  return _.isEqual(config1, config2);
}
