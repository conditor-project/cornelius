import './item-list.scss';
import template from './item-list.template.html';
import records from './records.json';

export const itemList = {
  controller: function () {
    this.items = records;
  },
  template
};
