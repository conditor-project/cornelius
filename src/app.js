import angular from 'angular';
import 'angular-animate';
import ngSanitize from 'angular-sanitize';
import config from './config.json';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import modal from 'angular-ui-bootstrap/src/modal';
import buttons from 'angular-ui-bootstrap/src/buttons';
import 'angular-drag-scroll';
import uiSelect from 'ui-select';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';
import 'ui-select/dist/select.css';

// Components
import { cornelius } from './components/cornelius/cornelius.component';
import { navbar } from './components/cornelius/navbar/navbar.component';
import { sidebar } from './components/cornelius/sidebar/sidebar.component';
import { recordList } from './components/cornelius/record-list/record-list.component';
import { jwtModal } from './components/cornelius/jwt-modal/jwt-modal.component';
import { recordModal } from './components/cornelius/record-list/record-modal/record-modal.component';
import { confirmModal } from './components/cornelius/record-list/record-modal/confirm-modal/confirm-modal.component';
import { pagination } from './components/cornelius/record-list/pagination/pagination.component';

// Services
import { jwtService } from './services/jwt.service';
import { conditorApiService } from './services/conditor-api.service';
import { jwtModalService } from './components/cornelius/jwt-modal/jwt-modal.service';

// Directives
import { myEnterKeypress } from './directives/my-enter-keypress.directive';

angular
  .module('app', [ngSanitize, dropdown, modal, buttons, 'ng-drag-scroll', uiSelect])
  .constant('API_CONDITOR_CONFIG', config)
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('recordList', recordList)
  .component('jwtModal', jwtModal)
  .component('recordModal', recordModal)
  .component('confirmModal', confirmModal)
  .component('pagination', pagination)
  .factory('jwtService', jwtService)
  .factory('conditorApiService', conditorApiService)
  .factory('jwtModalService', jwtModalService)
  .directive('myEnterKeypress', myEnterKeypress)
;
