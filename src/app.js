import angular from 'angular';
import 'angular-animate';
import 'angular-touch';
import 'angular-sanitize';
import dropdown from 'angular-ui-bootstrap/src/dropdown';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';

// Components
import { cornelius } from './cornelius/cornelius.component';
import { navbar } from './cornelius/navbar/navbar.component';
import { sidebar } from './cornelius/sidebar/sidebar.component';
import { itemList } from './cornelius/item-list/item-list.component';

angular
  .module('app', [dropdown])
  .component('cornelius', cornelius)
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('itemList', itemList);
