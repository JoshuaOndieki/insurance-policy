import {baseEnvironment} from './environment.base';

export const environment = {
  ...baseEnvironment,
  APIUrl: `http://${window.location.hostname}:8008/`,
}
