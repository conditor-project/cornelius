import './item-list.scss';
import template from './item-list.template.html';
import records from './records.json';

export const itemList = {
  controller: function () {
    this.$onInit = function () {
      this.items = records;
    };

    this.$onChanges = function () {
      console.log('itemList: ', this.filterOptions);
    };
  },
  bindings: {
    filterOptions: '<'
  },
  template
};
