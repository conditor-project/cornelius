import './cornelius.scss';
import template from './cornelius.template.html';
import pkg from '../../../package.json';

export const cornelius = {
  controller: function () {
    this.$onInit = function () {
      this.version = pkg.version;
    };
  },
  template
};
