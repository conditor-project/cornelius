export function jwtModalService ($uibModal) {
  let isOpen = false;
  let modalInstance;
  return {
    open: function (options = { force: false }) {
      if (isOpen) return modalInstance;
      const modal = $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          options: () => options
        }
      }).result;

      isOpen = true;
      modalInstance = modal;

      modal.finally(() => {
        isOpen = false;
      });
      return modal;
    }
  };
}
