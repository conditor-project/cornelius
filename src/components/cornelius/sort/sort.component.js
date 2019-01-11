import './sort.scss';
import template from './sort.template.html';

export const sort = {
  controller: function () {
    this.$onInit = function () {
      this.options = ['titre (A-Z)', 'titre (Z-A)'];
      this.optionSelected = this.options[0];
    };
  },
  bindings: {
    onOptionsChange: '&'
  },
  template
};
