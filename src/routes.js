export const homeState = {
  name: 'hello',
  url: '/home'
};

let numberModalOpened = 0;
export const recordState = {
  name: 'record',
  url: '/record/{idConditor}',
  params: {
    idConditor: null,
    data: null
  },
  onEnter: function ($stateParams, $state, $uibModal, $uibModalStack, conditorApiService) {
    $uibModalStack.dismissAll();
    const modalInstance = $uibModal.open({
      component: 'recordModal',
      size: 'xl',
      resolve: {
        record: () => {
          const isTheGoodRecord = ($stateParams.data) ? $stateParams.data.idConditor === $stateParams.idConditor : false;
          if ($stateParams.data && isTheGoodRecord) return $stateParams.data;
          return conditorApiService.getRecordById($stateParams.idConditor).then(response => response.data);
        }
      }
    });
    numberModalOpened++;
    modalInstance.result
      .catch(() => console.info('Record modal dismissed'))
      .finally(() => {
        numberModalOpened--;
        if (numberModalOpened === 0) $state.go('home');
      });
  }
};
