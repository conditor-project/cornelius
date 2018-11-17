export function myEnterKeypress () {
  return {
    link: function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        const keyCodePressed = event.which || event.keyCode;
        const keyCodeIsEnter = (keyCodePressed === 13);
        if (keyCodeIsEnter) {
          scope.$apply(function () {
            scope.$eval(attrs.myEnterKeypress);
          });
          event.preventDefault();
        }
      });
    }
  };
}
