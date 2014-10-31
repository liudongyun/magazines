angular.module("app").config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(false);
  $locationProvider.hashPrefix('!');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home.html',
    controller: 'HomeController'
  }).state('list-of-books', {
    url: '/list-of-books',
    templateUrl: 'books.html',
    controller: 'BooksController'   
  }).state('hermes', {
    url: '/hermes',
    templateUrl: 'hermes.html',
    controller: 'HermesController'   
  });

  $urlRouterProvider.otherwise('/hermes');

});
