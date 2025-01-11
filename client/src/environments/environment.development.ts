import {baseEnvironment} from './environment.base';

export const environment = {
  ...baseEnvironment,
  APIUrl: `https://${window.location.hostname}:7088/`,
}
