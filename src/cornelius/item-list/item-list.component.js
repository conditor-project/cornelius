import './item-list.scss';
import template from './item-list.template.html';
import records from './records.json';

export const itemList = {
  controller: function () {
    this.$onInit = function () {
      this.items = records;
    };

    this.$onChanges = function () {
      const sources = Object.keys(this.filterOptions.source).filter(source => this.filterOptions.source[source]);
      if (sources.length > 0) this.items = records.filter(item => sources.includes(item.source));
    };
  },
  bindings: {
    filterOptions: '<'
  },
  template
};
