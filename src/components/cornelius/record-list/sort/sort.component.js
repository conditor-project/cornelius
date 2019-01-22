import './sort.scss';
import template from './sort.template.html';
import angular from 'angular';

export const sort = {
  controller: function () {
    this.$onInit = function () {
      this.options = [
        {
          text: 'titre (A-Z)',
          query: 'title.default.normalized:asc'
        },
        {
          text: 'titre (Z-A)',
          query: 'title.default.normalized:desc'
        },
        {
          text: 'date de publication (\u25BC)',
          query: 'publicationDate.date:desc'
        },
        {
          text: 'date de publication (\u25B2)',
          query: 'publicationDate.date:asc'
        },
        {
          text: 'taux de similarité (\u25BC)',
          query: 'nearDuplicates.similarityRate:desc:avg:{nested:{path:nearDuplicates}}'
        },
        {
          text: 'taux de similarité (\u25B2)',
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
