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
        },
        {
          text: 'date de publication (\u25BC)',
          field: 'publicationDate.date',
          order: 'desc'
        },
        {
          text: 'date de publication (\u25B2)',
          field: 'publicationDate.date',
          order: 'asc'
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
