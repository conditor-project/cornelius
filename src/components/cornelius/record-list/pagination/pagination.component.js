import './pagination.scss';
import template from './pagination.template.html';

export const pagination = {
  controller: function () {
    this.$onChanges = function () {
      this.startPage = (this.currentPage - 1) * this.pageSize + 1;
      this.endPage = this.currentPage * this.pageSize;
    };
  },
  bindings: {
    currentPage: '<',
    pageSize: '<',
    links: '<',
    onPaginate: '&'
  },
  template
};
