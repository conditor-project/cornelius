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
import { itemList } from './components/cornelius/item-list/item-list.component';
import { jwtModal } from './components/cornelius/navbar/jwt-modal/jwt-modal.component';

angular
  .module('app', [dropdown, modal])
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('itemList', itemList)
  .component('jwtModal', jwtModal)
;
