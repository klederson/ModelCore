var ExampleApp = angular.module('ExampleApp', ['ModelCore']);

//Model Itself
ExampleApp.factory("Users",function(ModelCore) {
  return ModelCore.instance({
    $type : "Users",
    $pkField : "idUser",
    $settings : {
      urls : {
        base : "/sample/jsonDocument/fake.json"
      }
    },
    $myCustomAction : function(aaa) {
      console.log(aaa,this);
    }
  });
});

function MainCrtl($scope, Users) {
  //Setup a model to example a $find() call
  $scope.AllUsers = new Users();
  
  //Get All Users from the API
  $scope.AllUsers.$find().success(function() {
    var current;
    while(current = $scope.AllUsers.$fetch()) { //fetching on masters object
      console.log("Fetched Data into Master Object",$scope.AllUsers.$toObject()) //reading fetched from master
      //or just get the fetched object itself
      console.log("Real fetched Object",current.$toObject())
    }
  });


  //Setup a model to example a $get(id) call
  $scope.OneUser = new Users();
  
  //Hey look there are promisses =)
  //Get the user with idUser 1 - look at $pkField
  $scope.OneUser.$get(1).success(function() {
    console.log("Done! One User found!",$scope.OneUser.$fetch());
});






}