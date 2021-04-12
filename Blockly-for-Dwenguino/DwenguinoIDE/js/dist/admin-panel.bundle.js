!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t){e.exports=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},function(e,t){function n(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}e.exports=function(e,t,o){return t&&n(e.prototype,t),o&&n(e,o),e}},function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(1),l=n.n(a),i=function(){function e(){r()(this,e)}return l()(e,null,[{key:"getServerUrl",value:function(){return"http://localhost:12032"}}]),e}(),s={setupAdminPanel:function(){this.showUserInfo(),this.showStatistics(),$("#export-logging-entries").on("click",(function(){s.exportLoggingEntries()}))},showUserInfo:function(){$.ajax({type:"GET",url:i.getServerUrl()+"/user"}).done((function(e){var t=e.firstname;$("#userName").text(t)})).fail((function(e,t){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user"}).done((function(e){var t=e.firstname;$("#userName").text(t)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):401==e.status||console.log(t,e)}))},showStatistics:function(){s.showTotalNumberOfUsers(),s.showTotalNumberOfVerifiedUsers(),s.showTotalNumberOfLogItems(),s.showTotalNumberOfRecentLogItems(),s.showRecentLogEntries(),s.showRecent100LogEntries()},showTotalNumberOfUsers:function(){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalUsers"}).done((function(e){var t=e.totalUsers;$("#totalUsers").text(t)})).fail((function(e,t){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalUsers"}).done((function(e){var t=e.totalUsers;$("#totalUsers").text(t)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):console.log(t,e)}))},showTotalNumberOfVerifiedUsers:function(){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalVerifiedUsers"}).done((function(e){var t=e.totalVerifiedUsers;$("#totalVerifiedUsers").text(t)})).fail((function(e,t){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalVerifiedUsers"}).done((function(e){var t=e.totalVerifiedUsers;$("#totalVerifiedUsers").text(t)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):console.log(t,e)}))},showTotalNumberOfLogItems:function(){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalLogItems"}).done((function(e){var t=e.totalLogItems;$("#totalLogEntries").text(t)})).fail((function(e,t){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalLogItems"}).done((function(e){var t=e.totalLogItems;$("#totalLogEntries").text(t)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):console.log(t,e)}))},showTotalNumberOfRecentLogItems:function(){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalRecentLogItems"}).done((function(e){var t=e.totalLogItems;$("#totalLogEntriesRecently").text(t)})).fail((function(e,t){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/totalRecentLogItems"}).done((function(e){var t=e.totalLogItems;$("#totalLogEntriesRecently").text(t)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):console.log(t,e)}))},showRecentLogEntries:function(){$.fn.dataTable.isDataTable("#recentLogEntries")&&$("#recentLogEntries").DataTable().destroy();$("#recentLogEntries").DataTable({ajax:{url:i.getServerUrl()+"/user/admin/getRecentLogItems",dataSrc:"",deferRender:!0,error:function(e,t,n){console.log(n),403==e.status&&$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){s.showRecentLogEntries()}))}},columns:[{data:"timestamp"},{data:"event.name"},{data:"user_id"},{data:"session_id"},{data:"event.data"}]})},showRecent100LogEntries:function(){$.fn.dataTable.isDataTable("#recent100LogEntries")&&$("#recent100LogEntries").DataTable().destroy();$("#recent100LogEntries").DataTable({ajax:{url:i.getServerUrl()+"/user/admin/getRecent100LogItems",dataSrc:"",deferRender:!0,error:function(e,t,n){console.log(n),403==e.status&&$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){s.showRecent100LogEntries()}))}},columns:[{data:"timestamp"},{data:"event.name"},{data:"user_id"},{data:"session_id"},{data:"event.data"}]})},exportLoggingEntries:function(){var e=new Date,t="dwengo_logging_entries_"+s.formatDate(e)+".json";$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/exportLogItems"}).done((function(e){var n=JSON.stringify(e,null,2);s.download(t,n)})).fail((function(e,n){403==e.status?$.ajax({type:"POST",url:i.getServerUrl()+"/auth/renew"}).done((function(e){$.ajax({type:"GET",url:i.getServerUrl()+"/user/admin/exportLogItems"}).done((function(e){var n=JSON.stringify(e,null,2);s.download(t,n)})).fail((function(e,t){console.log(t,e)}))})).fail((function(e,t){console.log(t,e)})):console.log(n,e)}))},download:function(e,t){var n=document.createElement("a");n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n)},formatDate:function(e){var t=e.getFullYear(),n=e.getMonth()+1,o=e.getDate(),r=e.getHours(),a=e.getMinutes();return""+t+("0"+n).slice(-2)+("0"+o).slice(-2)+"-"+("0"+r).slice(-2)+("0"+a).slice(-2)}};$((function(){s.setupAdminPanel()}));t.default=s}]);