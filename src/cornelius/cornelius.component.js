import template from './cornelius.template.html';

export const cornelius = {
  controller: function () {
    this.$onInit = function () {
      this.filterOptions = {
        source: {
          hal: true,
          prodinra: true,
          pubmed: true,
          sudoc: true
        },
        score: 90
      };
    };
  },
  template
};
