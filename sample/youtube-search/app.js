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
        base : "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyBgu9gTtZQBVovfWnhw58Om5unY0YeRvak"
      }
    }
  });
});

function MainCrtl($scope, Videos) {
  $scope.models = new Videos();

  //Using regular find
  $scope.models.$find({q : "php", maxResults : 10 }).success(function() {
    console.log($scope.models.$dataset);

    //Using $find with query, options and incremental == true
    $scope.models.$find({q : "angularjs", maxResults : 10 },{},true).success(function() {
      console.log($scope.models.$dataset);

      //Using $find alias $incremental(query,options) that dont need to explicity the true
      $scope.models.$incremental({q : "nodejs", maxResults : 10 }).success(function() {
        console.log($scope.models.$dataset)
      })
    })
  }).error(function(response, code) {
    console.log(code,response);
  });
}