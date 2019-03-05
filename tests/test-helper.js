import Application from '../app';
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

import './helpers/numeric-asserts';

setApplication(Application.create(config.APP));

start();
