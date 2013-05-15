var ExampleApp = angular.module('ExampleApp', ['ModelCore']);

//Model Itself
ExampleApp.factory("Users",function(ModelCore) {
  return ModelCore.instance({
    $type : "Users",
    $pkField : "idUser",
    $settings : {
      urls : {
        base : "./fake.json"
      }
    }
  });
});

function MainCrtl($scope, Users) {
  $scope.AllUsers = new Users();
  $scope.AllUsers.$find();

  $scope.OneUser = new Users();
  $scope.OneUser.$get(1).success(function() {
    console.log("Done!",$scope.OneUser.$fetch());
});






}