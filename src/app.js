import angular from 'angular';
import 'angular-animate';
import 'angular-sanitize';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import modal from 'angular-ui-bootstrap/src/modal';

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
import { pagination } from './components/cornelius/record-list/pagination/pagination.component';

// Services
import { jwtService } from './services/jwt.service';
import { conditorApiService } from './services/conditor-api.service';
import { jwtModalService } from './components/cornelius/jwt-modal/jwt-modal.service';

// Directives
import { myEnterKeypress } from './directives/my-enter-keypress.directive';

angular
  .module('app', [dropdown, modal])
  .constant('API_CONDITOR_CONFIG', {
    baseUrl: 'https://api-dev.conditor.fr/v1',
    routes: {
      record: '/records'
    }
  })
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('recordList', recordList)
  .component('jwtModal', jwtModal)
  .component('recordModal', recordModal)
  .component('pagination', pagination)
  .factory('jwtService', jwtService)
  .factory('conditorApiService', conditorApiService)
  .factory('jwtModalService', jwtModalService)
  .directive('myEnterKeypress', myEnterKeypress)
;
