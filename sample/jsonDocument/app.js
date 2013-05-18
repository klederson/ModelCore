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
    },
    $myCustomAction : function(aaa) {
      console.log(aaa);
    }
  });
});

function MainCrtl($scope, Users) {
  $scope.AllUsers = new Users();
  $scope.AllUsers.$find();

  //console.log($scope.AllUsers);

  $scope.OneUser = new Users();
  $scope.OneUser.$get(1).success(function() {
    //console.log("Done!",$scope.OneUser.$fetch());
});






}