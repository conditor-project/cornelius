import angular from 'angular';
import 'angular-animate';
import 'angular-touch';
import 'angular-sanitize';
import dropdown from 'angular-ui-bootstrap/src/dropdown';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';

// Components
import { navbar } from './navbar/navbar.component';
import { sidebar } from './sidebar/sidebar.component';
import { itemList } from './item-list/item-list.component';

angular
  .module('app', [dropdown])
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('itemList', itemList);
