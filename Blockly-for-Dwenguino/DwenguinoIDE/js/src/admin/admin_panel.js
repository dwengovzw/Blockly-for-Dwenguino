import ServerConfig from '../server_config.js';

let AdminPanel = {
    
    setupAdminPanel: function(){
        this.showUserInfo();
        this.showStatistics();

        $("#export-logging-entries").on("click", function(){
            AdminPanel.exportLoggingEntries();
        })

        $( "#datepicker-from" ).datepicker();
        $( "#datepicker-until" ).datepicker();
    },

    showUserInfo: function(){
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user"}
        ).done(function(data){
            // The user is still logged in
            let firstname = data.firstname;
            $('#userName').text(firstname);

        }).fail(function(response, status)  {
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user"}
                    ).done(function(data){
                        // The user is still logged in
                        let firstname = data.firstname;
                        $('#userName').text(firstname);
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else if(response.status == 401){
                // The user was never logged in so there is no user info.
            } else {
                console.log(status, response);
            }
        });
    }, 

    showStatistics: function() {
        AdminPanel.showTotalNumberOfUsers();
        AdminPanel.showTotalNumberOfVerifiedUsers();
        AdminPanel.showTotalNumberOfLogItems();
        AdminPanel.showTotalNumberOfRecentLogItems();
        AdminPanel.showRecentLogEntries();
        AdminPanel.showRecent100LogEntries();
    },

    showTotalNumberOfUsers: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/admin/totalUsers"}
        ).done(function(data){
            // The user is still logged in
            let totalUsers = data.totalUsers;
            $('#totalUsers').text(totalUsers);

        }).fail(function(response, status)  {
            
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user/admin/totalUsers"}
                    ).done(function(data){
                        // The user is still logged in
                        let totalUsers = data.totalUsers;
                        $('#totalUsers').text(totalUsers);
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else {
                console.log(status,response);
            }
        });
    },

    showTotalNumberOfVerifiedUsers: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/admin/totalVerifiedUsers"}
        ).done(function(data){
            // The user is still logged in
            let totalVerifiedUsers = data.totalVerifiedUsers;
            $('#totalVerifiedUsers').text(totalVerifiedUsers);

        }).fail(function(response, status)  {
            
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user/admin/totalVerifiedUsers"}
                    ).done(function(data){
                        // The user is still logged in
                        let totalVerifiedUsers = data.totalVerifiedUsers;
                        $('#totalVerifiedUsers').text(totalVerifiedUsers);
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else {
                console.log(status,response);
            }
        });
    },

    showTotalNumberOfLogItems: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/admin/totalLogItems"}
        ).done(function(data){
            // The user is still logged in
            let totalLogItems = data.totalLogItems;
            $('#totalLogEntries').text(totalLogItems);

        }).fail(function(response, status)  {
            
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user/admin/totalLogItems"}
                    ).done(function(data){
                        // The user is still logged in
                        let totalLogItems = data.totalLogItems;
                        $('#totalLogEntries').text(totalLogItems);
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else {
                console.log(status,response);
            }
        });
    },

    showTotalNumberOfRecentLogItems: function() {
        var self = this;
        $.ajax({
            type: "GET",
            url: ServerConfig.getServerUrl() + "/user/admin/totalRecentLogItems"}
        ).done(function(data){
            // The user is still logged in
            let totalLogItems = data.totalLogItems;
            $('#totalLogEntriesRecently').text(totalLogItems);

        }).fail(function(response, status)  {
            
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "GET",
                        url: ServerConfig.getServerUrl() + "/user/admin/totalRecentLogItems"}
                    ).done(function(data){
                        // The user is still logged in
                        let totalLogItems = data.totalLogItems;
                        $('#totalLogEntriesRecently').text(totalLogItems);
            
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else {
                console.log(status,response);
            }
        });
    },

    showRecentLogEntries: function() {
        var self = this;

        if ( $.fn.dataTable.isDataTable( '#recentLogEntries' ) ) {
            let table = $('#recentLogEntries').DataTable();
            table.destroy();
        }

        var table = $('#recentLogEntries').DataTable( {
            ajax: {
                url: ServerConfig.getServerUrl() + '/user/admin/getRecentLogItems',
                dataSrc: '',
                deferRender: true,
                error: function (response, error, code)
                {
                    console.log(code);
                    if(response.status == 403){
                        $.ajax({
                            type: "POST",
                            url: ServerConfig.getServerUrl() + "/auth/renew"}
                        ).done(function(data){
                            AdminPanel.showRecentLogEntries();
                        });
                    }
                }
            },
            columns: [ 
                {   data: 'timestamp' },
                {   data: 'eventName' },
                {   data: 'userId'},
                {   data: 'sessionId'},
                {   data: 'data',
                    render: function(data, type, row){
                        return '<textarea>' + data + '</textarea>';
                    } 
                }
             ]
        } );

        $('#recentLogEntriesVisibility a.toggle-vis').on( 'click', function (e) {
            e.preventDefault();
     
            // Get the column API object
            var column = table.column( $(this).attr('data-column') );
     
            // Toggle the visibility
            column.visible( ! column.visible() );
        } );
    },

    showRecent100LogEntries: function() {
        var self = this;

        if ( $.fn.dataTable.isDataTable( '#recent100LogEntries' ) ) {
            let table = $('#recent100LogEntries').DataTable();
            table.destroy();
        }

        var table = $('#recent100LogEntries').DataTable( {
            ajax: {
                url: ServerConfig.getServerUrl() + '/user/admin/getRecent100LogItems',
                dataSrc: '',
                // deferRender: true,
                error: function (response, error, code)
                {
                    console.log(code);
                    if(response.status == 403){
                        $.ajax({
                            type: "POST",
                            url: ServerConfig.getServerUrl() + "/auth/renew"}
                        ).done(function(data){
                            AdminPanel.showRecent100LogEntries();
                        });
                    }
                }
            },
            columns: [ 
                {   data: 'timestamp' },
                {   data: 'eventName' },
                {   data: 'userId'},
                {   data: 'sessionId'},
                {   data: 'data',
                    render: function(data, type, row){
                    return '<textarea>' + data + '</textarea>';
                } 
            }
             ]
        } );

        $('#recent100LogEntriesVisibility a.toggle-vis').on( 'click', function (e) {
            e.preventDefault();
     
            // Get the column API object
            var column = table.column( $(this).attr('data-column') );
     
            // Toggle the visibility
            column.visible( ! column.visible() );
        } );
    },

    exportLoggingEntries: function() {
        var self = this;
        const today = new Date();
        let date = AdminPanel.formatDate(today)
            
        let fileName = 'dwengo_logging_entries_' + date + '.json';

        let dateFrom = $("#datepicker-from").datepicker('getDate');
        let dateUntil = $("#datepicker-until").datepicker('getDate');

        let data = { 
            "dateFrom": dateFrom,
            "dateUntil": dateUntil
        }

        $.ajax({
            type: "POST",
            url: ServerConfig.getServerUrl() + "/user/admin/exportLogItems",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data)
        }).done(function(data){
            // The user is still logged in
            let text = JSON.stringify(data, null, 2);     
            AdminPanel.download(fileName, text);

        }).fail(function(response, status)  {
            
            if(response.status == 403){
                // The user was previously logged in, but the access token is invalid. Try to refresh the token.
                $.ajax({
                    type: "POST",
                    url: ServerConfig.getServerUrl() + "/auth/renew"}
                ).done(function(data){
                    // The user has successfully renewed the access token
                    $.ajax({
                        type: "POST",
                        url: ServerConfig.getServerUrl() + "/user/admin/exportLogItems",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(data)
                    }).done(function(data){
                        // The user is still logged in
                        let text = JSON.stringify(data, null, 2);
                       AdminPanel.download(fileName, text);
                        
                    }).fail(function(response, status)  {
                        console.log(status, response);
                    });
                }).fail(function(response, status)  {
                    console.log(status, response);
                });
            } else {
                console.log(status,response);
            }
        });
    },

    download: function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
  
        element.style.display = 'none';
        document.body.appendChild(element);
  
        element.click();
  
        document.body.removeChild(element);
      },
  
    formatDate: function(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        let formattedDate = '' + year + '' + ("0"+ month).slice(-2) + '' + ("0" + day).slice(-2) + '-' + ("0" + hours).slice(-2) + ("0" + minutes).slice(-2);

        return formattedDate;
    }
        
}

$(function() {
    AdminPanel.setupAdminPanel();
});
  
export default AdminPanel;