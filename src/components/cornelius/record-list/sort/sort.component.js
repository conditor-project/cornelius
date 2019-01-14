import './sort.scss';
import template from './sort.template.html';
import angular from 'angular';

export const sort = {
  controller: function () {
    this.$onInit = function () {
      this.options = [
        {
          text: 'titre (A-Z)',
          field: 'title.default.normalized',
          order: 'asc'
        },
        {
          text: 'titre (Z-A)',
          field: 'title.default.normalized',
          order: 'desc'
        }
      ];
      this.optionSelected = this.options[0];
    };
    this.onFormChange = function () {
      const newOptions = angular.copy(this.optionSelected);
      this.onOptionsChange({ newOptions });
    };
  },
  bindings: {
    onOptionsChange: '&'
  },
  template
};
