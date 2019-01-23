import angular from 'angular';
import 'angular-i18n/angular-locale_fr-fr';
import ngAnimate from 'angular-animate';
import ngSanitize from 'angular-sanitize';
import config from './config.json';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import modal from 'angular-ui-bootstrap/src/modal';
import buttons from 'angular-ui-bootstrap/src/buttons';
import 'angular-drag-scroll';
import uiSelect from 'ui-select';
import 'angular-ui-notification';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';
import 'ui-select/dist/select.css';
import 'angular-ui-notification/dist/angular-ui-notification.css';
import './assets/bootstrap-notifications.css';
import './app.scss';

// Components
import { cornelius } from './components/cornelius/cornelius.component';
import { navbar } from './components/cornelius/navbar/navbar.component';
import { filter } from './components/cornelius/filter/filter.component';
import { recordList } from './components/cornelius/record-list/record-list.component';
import { sort } from './components/cornelius/record-list/sort/sort.component';
import { jwtModal } from './components/cornelius/jwt-modal/jwt-modal.component';
import { recordModal } from './components/cornelius/record-list/record-modal/record-modal.component';
import { confirmModal } from './components/cornelius/record-list/record-modal/confirm-modal/confirm-modal.component';
import { pagination } from './components/cornelius/record-list/pagination/pagination.component';

// Services
import { jwtService } from './services/jwt.service';
import { conditorApiService } from './services/conditor-api.service';
import { jwtModalService } from './components/cornelius/jwt-modal/jwt-modal.service';
import { notificationLogService } from './services/notification-log.service';

// Directives
import { myEnterKeypress } from './directives/my-enter-keypress.directive';

angular
  .module('app', [ngAnimate, ngSanitize, dropdown, modal, buttons, 'ng-drag-scroll', uiSelect, 'ui-notification'])
  .config(function (NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 5000,
      positionX: 'right',
      positionY: 'bottom'
    });
  })
  .constant('API_CONDITOR_CONFIG', config)
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('filter', filter)
  .component('sort', sort)
  .component('recordList', recordList)
  .component('jwtModal', jwtModal)
  .component('recordModal', recordModal)
  .component('confirmModal', confirmModal)
  .component('pagination', pagination)
  .factory('jwtService', jwtService)
  .factory('conditorApiService', conditorApiService)
  .factory('jwtModalService', jwtModalService)
  .factory('notificationLogService', notificationLogService)
  .directive('myEnterKeypress', myEnterKeypress)
  .filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals = 2) {
      if (!input) return input;
      return $filter('number')(input * 100, decimals) + ' %';
    };
  }])
;
