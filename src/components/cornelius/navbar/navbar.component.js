import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal) {
    this.open = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static'
      }).result.then(function (selectedItem) {
        console.info('i was closed with :', selectedItem);
      }, function () {
        console.info('Modal dismissed at :', new Date());
      });
    };
  },
  template
};
