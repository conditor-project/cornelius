import './cornelius.scss';
import template from './cornelius.template.html';
import pkg from '../../../package.json';

export const cornelius = {
  controller: function ($window) {
    this.$onInit = function () {
      this.version = pkg.version;
      this.windowWidth = $window.innerWidth;
      this.windowHeight = $window.window.innerHeight;
      $window.onresize = () => {
        this.windowWidth = $window.innerWidth;
        this.windowHeight = $window.window.innerHeight;
      };
    };
  },
  template
};
