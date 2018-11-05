import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal) {
    this.$onInit = function () {
      this.items = ['item1', 'item2', 'item3'];
    };

    this.open = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          items: () => this.items
        }
      }).result.then(function (selectedItem) {
        console.info('i was closed with : ', selectedItem);
      }, function () {
        console.info('Modal dismissed at: ' + new Date());
      });
    };
  },
  template
};
