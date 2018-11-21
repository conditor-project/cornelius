export function jwtModalService ($uibModal) {
  return {
    open: function (options = { force: false }) {
      return $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          options: () => options
        }
      }).result;
    }
  };
}
