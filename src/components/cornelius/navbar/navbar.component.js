import './navbar.scss';
import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal) {
    this.openJwtModal = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static'
      });
    };
  },
  template
};
