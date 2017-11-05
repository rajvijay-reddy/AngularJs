angular.module('todo')
.service('ListService', function() {
  this.list = {};
  this.getList = function() { return this.list; };
  this.saveList = function(list) { this.list = list; };
});
