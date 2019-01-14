import './sort.scss';
import template from './sort.template.html';
import angular from 'angular';

export const sort = {
  controller: function () {
    this.$onInit = function () {
      this.options = ['titre (A-Z)', 'titre (Z-A)'];
      this.optionSelected = this.options[0];
    };
    this.onChange = function () {
      const newOptions = angular.copy(this.optionSelected);
      this.onOptionsChange({ newOptions });
    };
  },
  bindings: {
    onOptionsChange: '&'
  },
  template
};
