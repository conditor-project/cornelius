import './pagination.scss';
import template from './pagination.template.html';

export const pagination = {
  bindings: {
    currentPage: '<',
    links: '<',
    onPaginate: '&'
  },
  template
};
