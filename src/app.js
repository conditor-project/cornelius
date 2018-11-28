import angular from 'angular';
import 'angular-animate';
import 'angular-sanitize';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import modal from 'angular-ui-bootstrap/src/modal';
import pagination from 'angular-ui-bootstrap/src/pagination';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';

// Components
import { cornelius } from './components/cornelius/cornelius.component';
import { navbar } from './components/cornelius/navbar/navbar.component';
import { sidebar } from './components/cornelius/sidebar/sidebar.component';
import { recordList } from './components/cornelius/record-list/record-list.component';
import { jwtModal } from './components/cornelius/jwt-modal/jwt-modal.component';
import { recordModal } from './components/cornelius/record-list/record-modal/record-modal.component';

// Services
import { jwtService } from './services/jwt.service';
import { conditorApiService } from './services/conditor-api.service';
import { jwtModalService } from './components/cornelius/jwt-modal/jwt-modal.service';

// Directives
import { myEnterKeypress } from './directives/my-enter-keypress.directive';

angular
  .module('app', [dropdown, modal, pagination])
  .constant('API_CONDITOR_CONFIG', {
    baseUrl: 'http://api-dev.conditor.fr'
  })
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('recordList', recordList)
  .component('jwtModal', jwtModal)
  .component('recordModal', recordModal)
  .factory('jwtService', jwtService)
  .factory('conditorApiService', conditorApiService)
  .factory('jwtModalService', jwtModalService)
  .directive('myEnterKeypress', myEnterKeypress)
;
