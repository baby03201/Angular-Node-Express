var user = angular.module('userApplication', []);

user.controller('userController', function($scope,userService){
    // List of the users
    $scope.users = [];
    $scope.groups = [];

    initialize();
    loadUsers();

    /*
     * Public Methods
     */
    $scope.deleteUser = function( user ) {
        userService.removeUser( user.id )
            .then( loadUsers );
    };
    
    $scope.updateGroup = function( user ){
        userService.updateGroup( user.id, user.gid )
            .then( loadUsers );
    };
    /*
     * Private Methods
     */
    function initialize(){
        userService.listGroup()
            .then(
                function( groups ) {
                    $scope.groups = groups;
                }
            );
    }

    function applyRemoteData( newUsers ) {
        $scope.users = newUsers;
    }
    
    function loadUsers() {
        userService.getUsers()
            .then(
                function( users ) {
                    applyRemoteData( users );
                }
            );
    } 
});

user.service('userService',function( $http, $q ) {
    return{
        getUsers: getUsers,
        removeUser: removeUser,
        listGroup: listGroup,
        updateGroup: updateGroup
    };
    
    function getUsers(){
        var request = $http({
            method  : "get",
            url     : "api/users",
            params  : {
                action: "get"
            }
        });

        return(request.then( handleSuccess, handleError ));
    }
    
    function removeUser( userId ){

        var request = $http({
            method  : "delete",
            url     : "api/users/" + userId
        });
        return(request.then( handleSuccess, handleError ));
    }
    
    function listGroup(){
        var request = $http({
            method  : "get",
            url     : "api/users/group",
            params  : {
                action  : "get"
            }
        });

        return(request.then( handleSuccess, handleError ));
    }

    function updateGroup( userId, groupId ){
        var request = $http({
            method  : "post",
            url     : "api/users/"+userId+"/group/"+groupId,
            params  : {
                action: "post"
            }
        });
        return(request.then( handleSuccess, handleError ));
    }

    //private methods
    function handleError( response ){
        if(
            ! angular.isObject( response.data ) ||
            ! response.data.message
          ) {
            return( $q.reject("Unknown error occured") );
            }
        return( $q.reject( response.data.message ));
    }

    function handleSuccess( response ){
        return (response.data);
    }
});
