import template from './cornelius.template.html';

export const cornelius = {
  controller: function () {
    this.$onInit = function () {
      this.filterOptions = {
        source: {
          hal: true,
          pubmed: true,
          sudoc: true,
          wos: true
        },
        score: 90,
        typeConditor: 'All'
      };
    };
  },
  template
};
