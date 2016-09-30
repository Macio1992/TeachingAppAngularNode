angular.module('teachingApp', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('users', {
            url: '/users',
            templateUrl: '/views/users.html',
            controller: 'mainController'
        })
})

.controller('mainController', function($scope, $http){
    $scope.message = 'its users message';

    $http.get('/loggedin').then((response) => {
        console.log(response);
        
    });

});