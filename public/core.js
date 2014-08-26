var user = angular.module('userApplication', ['core-switch']);

user.controller('userController', function($scope,userService){
    // List of the users
    $scope.users = [];
    $scope.groups = [];
    $scope.boolAddButton = 0;

    // Add user form
    $scope.data = {
        username    : "",
        email       : "",
        password    : "123456",
        permissionGroupID   : 0
    };

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
    
    $scope.toggleButton = function(){
        $scope.boolAddButton = 1;
	$scope.data.username = "";
        $scope.data.email ="";
        $scope.data.permissionGroupID = 0;
    };
    
    $scope.addUser = function( ) {
        $scope.boolAddButton = 0;
        userService.addUser( $scope.data )
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
        updateGroup: updateGroup,
        addUser: addUser
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
    
    function addUser( user ){
        var request = $http({
            method  : "post",
            url     : "api/users/register",
            params  : {
                action : "post"
            },
            data    : {
                user   : user
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
