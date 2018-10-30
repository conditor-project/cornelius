import './sidebar.scss';
import template from './sidebar.template.html';

export const sidebar = {
  controller: function ($scope) {
    $scope.apply = function () {
      console.log(this.$ctrl);
    };
    this.$onInit = function () {
      this.source = {
        hal: true,
        prodinra: true,
        pubmed: true,
        sudoc: true
      };
    };
  },
  bindings: {
    source: '<'
  },
  template
};
