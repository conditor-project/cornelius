import template from './jwt-modal.template.html';

export const jwtModal = {
  controller: function () {
    this.$onInit = function () {
      this.items = ['item1', 'item2', 'item3'];
      this.selected = {
        item: this.items[0]
      };
    };

    this.ok = function () {
      this.modalInstance.close(this.selected.item);
    };

    this.cancel = function () {
      this.modalInstance.dismiss('cancel');
    };
  },
  bindings: {
    modalInstance: '<'
  },
  template
};
