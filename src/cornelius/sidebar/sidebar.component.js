import './sidebar.scss';
import template from './sidebar.template.html';

export const sidebar = {
  controller: function () {
    this.apply = function () {
      console.log(this.source, this.score);
    };
    this.$onInit = function () {
      this.score = 90;
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
