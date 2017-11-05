/**
 * @ngdoc directive
 * @name tispWebApp:addEntityDirective
 *
 * @description
 *
 *
 * @restrict A
 * */
angular.module('tispWebApp')
  .directive('addEntity', function($q, UserService, GroupService, $filter, xfeAPI) {
    return {
      restrict: 'E',
      scope: {
        "addNewEntity": "&addNewEntity",
        "searchGroups": "=",
        "existingEntities": "=",
        "waitFor": "=?",
        "owner": "=?",
        "isDisabled": "=?",
        "domains": "="
      },
      templateUrl: "../../views/templates/addEntity.html",


      link: function(scope) {
        "use strict";
        scope.emailNotfound = false;
        scope.inputFieldContents = '';
        scope.selectedItem = '';
        scope.typeaheadItems = [];
        scope.MAX_GROUP_RESULT = 5;
        scope.existingEntityIDs = [];
        scope.domainOwner = scope.domains;

        console.log("scope.domains=====", scope.domains);
        console.log("scope.domainOwner=====", scope.domainOwner);

        var domainFiltered = [];

        scope.$watchCollection('existingEntities', function(/*value*/) {
          if(scope.existingEntities) {
            scope.existingEntityIDs = scope.existingEntities.map(function (value) {
              console.log(value);
              return value.memberId || value.groupid || value.userUniqueID;
            });
            if(scope.owner) {
              scope.existingEntityIDs.push(scope.owner.userUniqueID);
            }
          }
          console.log("Existing Entities", scope.existingEntities);
        });

        scope.validEmail = function(input) {
          var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          console.log(" regex.test(input)",  regex.test(input));
          return regex.test(input);
        };

        scope.validDomain = (input) => {
          var regex = /[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
          return regex.test(input);
        };


        scope.getDomain = function(input) {
          console.log(" input",  input);
          var domains = [];
          if(input) {
            var domainName = input.replace(/.*@/, "");
            console.log(" domainName",  domainName);
            var reg = new RegExp(".*\\..*\\..*");
            var multipleDomains = reg.test(domainName);
            console.log(" multipleDomains",  multipleDomains);
            if(multipleDomains){
              var higherLevelDomain = input.substring(input.indexOf(".") + 1);
              console.log(" higherLevelDomain",  higherLevelDomain);
              domains.push(higherLevelDomain);
            }
            domains.push(domainName);
            return domains;
          }
        };



        scope.getTypeahead = function(input) {
          // scope.getOwnerDomain();
          var promise = [];
          if (scope.validEmail(input)) {
            var emailDefered = $q.defer();
            var emailPromise = emailDefered.promise;
            promise.push(emailPromise);
            UserService.queryUserByEmail(input).then(
              function(results) {
                if (!results.user.userUniqueID) {
                  emailDefered.resolve({
                    notfound: true,
                    notfoundemail: true,
                    newEmail: input
                  });
                } else {
                  emailDefered.resolve({
                    fn: results.user.name,
                    id: results.user.userUniqueID,
                    userUniqueID: results.user.userUniqueID
                  });
                }
              }, function() {

                var domain = scope.getDomain(input);
                console.log("domain function()=====", domain);
                if(domain.length > 0) {
                  domainFiltered = scope.domainOwner.filter(function (ownerDomain) {
                    console.log("ownerDomain=====", ownerDomain);
                    return domain.indexOf(ownerDomain) !== -1;
                  });

                  console.log("domainFiltered========", domainFiltered);

                  var domainsArray = [];

                  for(let i=0; i < domainFiltered.length; i++){
                    domainFiltered[i] = {
                      fn: domainFiltered[i],
                      id: domainFiltered[i],
                      userUniqueID:  domainFiltered[i]
                    };
                    domainsArray.push(domainFiltered[i]);
                  }



                  emailDefered.resolve(domainsArray);
                }  else {
                  emailDefered.resolve({
                    notfound: true,
                    notfoundemail: true,
                    newEmail: input
                  });
                }

              });
          }

          //searching by domain
          if(scope.validDomain(input)) {
            var domainDefered = $q.defer();
            var domainPromise = domainDefered.promise;
            promise.push(domainPromise);
            var domain = scope.getDomain(input);
            console.log("domain function()=====", domain);
            if(domain.length > 0) {
              domainFiltered = scope.domainOwner.filter(function (ownerDomain) {
                console.log("ownerDomain=====", ownerDomain);
                return domain.indexOf(ownerDomain) !== -1;
              });

              console.log("domainFiltered========", domainFiltered);

              var domainsArray = [];

              for(let i=0; i < domainFiltered.length; i++){
                domainFiltered[i] = {
                  fn: domainFiltered[i],
                  id: domainFiltered[i],
                  userUniqueID:  domainFiltered[i]
                };
                domainsArray.push(domainFiltered[i]);
              }



              domainDefered.resolve(domainsArray);
            }  else {
              domainDefered.resolve({
                notfound: true,
                notfoundemail: true,
                newEmail: input
              });
            }

          }

          if (!scope.validEmail(input)) {
            console.log("3.results====");
            var usersDefered = $q.defer();
            var usersPromise = usersDefered.promise;
            promise.push(usersPromise);
            UserService.typeAheadSearchProfile(input).then(function(result) {
              usersDefered.resolve(result);
            });
          }

          if (!scope.validEmail(input) && scope.searchGroups) {
            console.log("4.results====");
            var groupsDefered = $q.defer();
            var groupsPromise = groupsDefered.promise;
            promise.push(groupsPromise);

            var processGroups = function(groups) {
              var filteredResults = $filter('filter')(groups, function(value) {
                if (value.description){
                  return (value.title.toLowerCase().indexOf(input.toLowerCase()) >= 0 || value.description.toLowerCase().indexOf(input.toLowerCase()) >= 0);
                }else {
                  return (value.title.toLowerCase().indexOf(input.toLowerCase()) >= 0);
                }
              });
              filteredResults = filteredResults.map(function(item) {
                item.type = 'group';
                return item;
              });
              groupsDefered.resolve(angular.copy(filteredResults).slice(0, scope.MAX_GROUP_RESULT));
            };

            GroupService.getGroups(true).then(function(groups) {
              processGroups(groups);
            }, angular.noop, function(cachedGroups) {
              processGroups(cachedGroups);
            });
          }

          var finalPromise = $q.all(promise);
          return finalPromise.then(function(entities) {
            console.log("5.====");
            console.log("entities=======", entities);
            var result = entities.reduce(function(a, b) {
              return a.concat(b);
            }, []);

            if (result.length < 1) {
              return [{
                notfound: true
              }];
            }

            result = result.map(function(entity) {

                if (entity.fn) {
                console.log("entity.fn =====", entity.fn);
                entity.name = entity.fn;
                delete entity.fn;
              }
              else if (entity.title) {
                entity.name = entity.title;
                delete entity.title;
              }
              entity.id = entity.id || entity.userUniqueID || entity.groupid || 123;
              entity.exists = scope.existingEntityIDs.indexOf(entity.id) > -1;
              return entity;
            });

            var resultWithPicture = result.map(function (element) {
              if (element.userUniqueID !== undefined) {
                var pictureId = element.userUniqueID.split('/').pop();
                element.picture = xfeAPI + '/user/' + pictureId + '.jpeg';
              }
              if (element.groupid !== undefined) {
                element.picture = xfeAPI + '/groups/' + element.groupid + '.jpeg';
              }
              return element;
            });

            return resultWithPicture;
          });
        };

        scope.addItem = function(item) {
          // TODO: When $event is supported by angular-bootstrap, use it to prevent default here on items that already exist (checked by item.exists). That way "disabled" items can be non-clickable
          scope.selectedItem = '';
          scope.inputFieldContents = '';
          if (item.notfound) {
            return;
          }
          if(item.exists) {
            return;
          }
          console.log(scope.existingEntities);
          scope.addNewEntity({
            selectedItem: item
          });
        };


      }
    };
  });
