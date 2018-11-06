import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal) {
    this.open = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static'
      });
    };
  },
  template
};
