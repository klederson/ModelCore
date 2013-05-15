var ExampleApp = angular.module('ExampleApp', ['ModelCore']);

//Model Itself
ExampleApp.factory("Videos",function(ModelCore) {
  return ModelCore.instance({
    $type : "Videos",
    $settings : {
      dataField : {
        many : "items"
      },
      urls : { //
        base : "https://www.googleapis.com/youtube/v3/search?part=snippet&key={{YOURGOOGLEAPIHERE}}"
      }
    }
  });
});

function MainCrtl($scope, Videos) {
  $scope.models = new Videos();

  $scope.models.$find({q : "php", maxResults : 10 }).success(function() {
    console.log($scope.models.$dataset)
  })
}