import './sidebar.scss';
import template from './sidebar.template.html';
import angular from 'angular';

export const sidebar = {
  controller: function () {
    this.$onChanges = function () {
      console.log('sidebar: ', this.filterOptions);
    };

    this.apply = function () {
      const newFilterOptions = angular.copy(this.filterOptions);
      this.onFilterOptionsChange({ newFilterOptions });
    };
  },
  bindings: {
    filterOptions: '<',
    onFilterOptionsChange: '&'
  },
  template
};
