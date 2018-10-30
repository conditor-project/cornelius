import './sidebar.scss';
import template from './sidebar.template.html';

export const sidebar = {
  controller: function ($scope) {
    $scope.apply = function () {
      console.log(this.$ctrl);
    };
    this.$onInit = function () {
      this.hal = true;
      this.prodinra = true;
      this.pubmed = true;
      this.sudoc = true;
    };
  },
  template
};
