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

         console.log("scope.domainOwner=====", scope.domainOwner);

        var domainFiltered = [];
        // let items = [];



        scope.$watchCollection('existingEntities', function(/*value*/) {
          if(scope.existingEntities) {
            scope.existingEntityIDs = scope.existingEntities.map(function (value) {
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
          return regex.test(input);
        };

        scope.validDomain = (input) => {
          var regex = /[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
           return regex.test(input);
        };


        scope.getDomains = (input) => {
          var domains = [];
          if(input) {
            var domainName = input.replace(/.*@/, "");
            var reg = new RegExp(".*\\..*\\..*");
            var multipleDomains = reg.test(domainName);
            if(multipleDomains){
              var higherLevelDomain = input.substring(input.indexOf(".") + 1);
              domains.push(higherLevelDomain);
            }
            domains.push(domainName);
            return domains;
          }
        };

        scope.filterDomains = (domains) => {
          let items = [];
          domainFiltered = scope.domainOwner.filter(function (ownerDomain) {
            return domains.indexOf(ownerDomain) !== -1;
          });
          if(domainFiltered.length > 0) {
            domainFiltered.forEach(function(item) {
              items.push({fn:item, id:item,userUniqueID:item});
            });
          }
          return items;
        };


        scope.getTypeahead = (input) => {
          var promise = [];
          if (scope.validEmail(input) /*|| scope.validDomain(input)*/) {
            var emailDefered = $q.defer();
            var emailPromise = emailDefered.promise;
            promise.push(emailPromise);
            UserService.queryUserByEmail(input).then(
              function(results) {
                console.log(`results===${results}`);
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
                let items;
                let domain = scope.getDomains(input);
                if(domain.length > 0) {
                  items = scope.filterDomains(domain);
                  if(items.length !== 0) {
                  emailDefered.resolve({
                  items
                  });
                } }else {
                  console.log(`error part domain3333`);
                  emailDefered.resolve({
                    notfound: true,
                    notfoundemail: true,
                    newEmail: input
                  });
                }
              });

            //added this since the top part just finds the name, to find the domain,
            // however for ibm.com it output twice
            var domainDefered = $q.defer();
            var domainPromise = domainDefered.promise;
            promise.push(domainPromise);
            let items= [];
            var domain = scope.getDomains(input);
            if(domain.length !== 0) {
              items = scope.filterDomains(domain);
              if (items.length !== 0) {
                domainDefered.resolve({
                  items
                });
              }
              else {
                domainDefered.resolve({
                  notfound: true,
                  notfoundemail: true,
                  newEmail: input
                });
              }
            }
          }

          //searching by domain
          if(scope.validDomain(input) && !scope.validEmail(input)) {
            var domainDefered = $q.defer();
            var domainPromise = domainDefered.promise;
            promise.push(domainPromise);
            let items = [];
            var domain = scope.getDomains(input);
            if (domain.length !== 0) {
              items = scope.filterDomains(domain);
              if (items.length !== 0) {
                domainDefered.resolve({
                  items
                });
              } else {
                domainDefered.resolve({
                  notfound: true,
                  notfoundemail: true,
                  newEmail: input
                });
              }
            }
          }


          if (!scope.validEmail(input)) {
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
            var result = entities.reduce(function(a, b) {
              return a.concat(b);
            }, []);

            if (result.length < 1) {
              return [{
                notfound: true
              }];
            }

          /*  result =  _.uniqBy(result, function(o){
              return o.userUniqueID;
            });*/
            console.log(`result========, ${result}`);
            result = result.map(function(entity) {
              console.log("entity before ====", entity);
              if(entity.items && Array.isArray(entity.items)) {
                console.log("Array.isArray(entity.fn)", Array.isArray(entity.fn));
                const newDomain = entity.items;
                console.log(`newDomain====, ${newDomain}`);
                delete entity.items;
                  newDomain.forEach(function(domain) {
                  console.log("Array.isArray(entity)", domain);
                // _.merge( entity, domain);
                //   2nd option
                  entity.fn = domain.fn;
                  entity.id = domain.id;
                    entity.userUniqueID = domain.userUniqueID;
                  // console.log("entity after assigning=====", entity);
                });


              }
              if (entity.fn) {
                console.log("entity.fn =====", entity.fn);
               entity.name = entity.fn;
               delete entity.fn;
               }
              else if (entity.title) {
                entity.name = entity.title;
                delete entity.title;
              }
              entity.id = entity.id || entity.userUniqueID || entity.groupid;
              entity.exists = scope.existingEntityIDs.indexOf(entity.id) > -1;
              console.log("entity2====", entity);
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
