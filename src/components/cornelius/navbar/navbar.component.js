import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal) {
    this.open = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static'
      }).result.then(function (data) {
        console.info('i was closed with :', data);
      }, function () {
        console.info('Modal dismissed at :', new Date());
      });
    };
  },
  template
};
