import template from './cornelius.template.html';

export const cornelius = {
  controller: function ($uibModal, jwtService) {
    this.$onInit = function () {
      this.filterOptions = {
        source: {
          hal: true,
          prodinra: true,
          pubmed: true,
          sudoc: true
        },
        score: 90
      };
      if (!jwtService.getTokenJwt()) this.openJwtModal({ force: true });
    };

    this.openJwtModal = function (options) {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          options: () => options
        }
      });
    };
  },
  template
};
