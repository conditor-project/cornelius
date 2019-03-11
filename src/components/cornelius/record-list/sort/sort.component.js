import './sort.scss';
import template from './sort.template.html';
import angular from 'angular';

export const sort = {
  controller: function () {
    this.$onInit = function () {
      this.options = [
        {
          text: 'titre <i class="fa fa-sort-alpha-asc" aria-hidden="true"></i>',
          query: 'title.default.normalized:asc'
        },
        {
          text: 'titre <i class="fa fa-sort-alpha-desc" aria-hidden="true"></i>',
          query: 'title.default.normalized:desc'
        },
        {
          text: 'date de publication <i class="fa fa-sort-numeric-desc" aria-hidden="true"></i>',
          query: 'publicationDate.date:desc'
        },
        {
          text: 'date de publication <i class="fa fa-sort-numeric-asc" aria-hidden="true"></i>',
          query: 'publicationDate.date:asc'
        },
        {
          text: 'taux de similarité <i class="fa fa-sort-amount-desc" aria-hidden="true"></i>',
          query: 'nearDuplicates.similarityRate:desc:avg:{nested:{path:nearDuplicates}}'
        },
        {
          text: 'taux de similarité <i class="fa fa-sort-amount-asc" aria-hidden="true"></i>',
          query: 'nearDuplicates.similarityRate:asc:avg:{nested:{path:nearDuplicates}}'
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
