var user = angular.module('userApplication', ['core-switch','custom-directive']);

user.controller('userController', function($scope,userService){
    // List of the users
    $scope.users = [];
    $scope.groups = [];
    $scope.boolAddButton = 0;
    // Edit user form
    $scope.editDetail = {
        id      : "",
        username: "",
        email   : ""
    };
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

    $scope.editButtonClicked = function( user ) {
        $scope.editDetail.username = user.username;
        $scope.editDetail.email = user.email;
        $scope.editDetail.id = user.id;
    };

    $scope.inputKeyUp = function (){
        var send = 1;
        for ( var i = 0 ; i < $scope.users.length ; i++ ) {
            if ( $scope.users[i].id == $scope.editDetail.id ){
                if ( $scope.users[i].username != $scope.editDetail.username || 
                     $scope.users[i].email != $scope.editDetail.email ) {
                    $scope.users[i].username = $scope.editDetail.username;
                    $scope.users[i].email = $scope.editDetail.email;
                } else {  
                    send = 0;
                }
                if( send == 1 )
                    userService.updateUser( $scope.users[i] );
                break;
            }
        }
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
        addUser: addUser,
        updateUser: updateUser
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

    function updateUser( user ){
        var request = $http({
            method  : "put",
            url     : "api/users",
            params  : {
                action  : "put"
            },
            data    : {
                id    : user.id,
                username: user.username,
                email   : user.email
            }
        });
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

