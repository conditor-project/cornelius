import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularTouch from 'angular-touch';
import angularSanitize from 'angular-sanitize';
import dropdown from 'angular-ui-bootstrap/src/dropdown';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './app.scss';

// Components
import { navbar } from './navbar/navbar.component';
import { sidebar } from './sidebar/sidebar.component';
import { itemList } from './item-list/item-list.component';

angular
  .module('app', [dropdown])
  .component('navbar', navbar)
  .component('sidebar', sidebar)
  .component('itemList', itemList);
