/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js":
/*!************************************************************************!*\
  !*** ./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _server_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../server_config.js */ \"./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js\");\n\nvar AdminPanel = {\n  setupAdminPanel: function setupAdminPanel() {\n    this.showUserInfo();\n    this.showStatistics();\n    $(\"#export-logging-entries\").on(\"click\", function () {\n      AdminPanel.exportLoggingEntries();\n    });\n    $(\"#datepicker-from\").datepicker();\n    $(\"#datepicker-until\").datepicker();\n  },\n  showUserInfo: function showUserInfo() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user\"\n    }).done(function (data) {\n      // The user is still logged in\n      var firstname = data.firstname;\n      $('#userName').text(firstname);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user\"\n          }).done(function (data) {\n            // The user is still logged in\n            var firstname = data.firstname;\n            $('#userName').text(firstname);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else if (response.status == 401) {// The user was never logged in so there is no user info.\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showStatistics: function showStatistics() {\n    AdminPanel.showTotalNumberOfUsers();\n    AdminPanel.showTotalNumberOfVerifiedUsers();\n    AdminPanel.showTotalNumberOfLogItems();\n    AdminPanel.showTotalNumberOfRecentLogItems();\n    AdminPanel.showRecentLogEntries();\n    AdminPanel.showRecent100LogEntries();\n  },\n  showTotalNumberOfUsers: function showTotalNumberOfUsers() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalUsers\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalUsers = data.totalUsers;\n      $('#totalUsers').text(totalUsers);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalUsers\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalUsers = data.totalUsers;\n            $('#totalUsers').text(totalUsers);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfVerifiedUsers: function showTotalNumberOfVerifiedUsers() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalVerifiedUsers\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalVerifiedUsers = data.totalVerifiedUsers;\n      $('#totalVerifiedUsers').text(totalVerifiedUsers);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalVerifiedUsers\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalVerifiedUsers = data.totalVerifiedUsers;\n            $('#totalVerifiedUsers').text(totalVerifiedUsers);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfLogItems: function showTotalNumberOfLogItems() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalLogItems\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalLogItems = data.totalLogItems;\n      $('#totalLogEntries').text(totalLogItems);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalLogItems\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalLogItems = data.totalLogItems;\n            $('#totalLogEntries').text(totalLogItems);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfRecentLogItems: function showTotalNumberOfRecentLogItems() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalRecentLogItems\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalLogItems = data.totalLogItems;\n      $('#totalLogEntriesRecently').text(totalLogItems);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/totalRecentLogItems\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalLogItems = data.totalLogItems;\n            $('#totalLogEntriesRecently').text(totalLogItems);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showRecentLogEntries: function showRecentLogEntries() {\n    var self = this;\n\n    if ($.fn.dataTable.isDataTable('#recentLogEntries')) {\n      var _table = $('#recentLogEntries').DataTable();\n\n      _table.destroy();\n    }\n\n    var table = $('#recentLogEntries').DataTable({\n      ajax: {\n        url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + '/user/admin/getRecentLogItems',\n        dataSrc: '',\n        deferRender: true,\n        error: function error(response, _error, code) {\n          console.log(code);\n\n          if (response.status == 403) {\n            $.ajax({\n              type: \"POST\",\n              url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n            }).done(function (data) {\n              AdminPanel.showRecentLogEntries();\n            });\n          }\n        }\n      },\n      columns: [{\n        data: 'timestamp'\n      }, {\n        data: 'eventName'\n      }, {\n        data: 'userId'\n      }, {\n        data: 'sessionId'\n      }, {\n        data: 'data',\n        render: function render(data, type, row) {\n          return '<textarea>' + data + '</textarea>';\n        }\n      }]\n    });\n    $('#recentLogEntriesVisibility a.toggle-vis').on('click', function (e) {\n      e.preventDefault(); // Get the column API object\n\n      var column = table.column($(this).attr('data-column')); // Toggle the visibility\n\n      column.visible(!column.visible());\n    });\n  },\n  showRecent100LogEntries: function showRecent100LogEntries() {\n    var self = this;\n\n    if ($.fn.dataTable.isDataTable('#recent100LogEntries')) {\n      var _table2 = $('#recent100LogEntries').DataTable();\n\n      _table2.destroy();\n    }\n\n    var table = $('#recent100LogEntries').DataTable({\n      ajax: {\n        url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + '/user/admin/getRecent100LogItems',\n        dataSrc: '',\n        // deferRender: true,\n        error: function error(response, _error2, code) {\n          console.log(code);\n\n          if (response.status == 403) {\n            $.ajax({\n              type: \"POST\",\n              url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n            }).done(function (data) {\n              AdminPanel.showRecent100LogEntries();\n            });\n          }\n        }\n      },\n      columns: [{\n        data: 'timestamp'\n      }, {\n        data: 'eventName'\n      }, {\n        data: 'userId'\n      }, {\n        data: 'sessionId'\n      }, {\n        data: 'data',\n        render: function render(data, type, row) {\n          return '<textarea>' + data + '</textarea>';\n        }\n      }]\n    });\n    $('#recent100LogEntriesVisibility a.toggle-vis').on('click', function (e) {\n      e.preventDefault(); // Get the column API object\n\n      var column = table.column($(this).attr('data-column')); // Toggle the visibility\n\n      column.visible(!column.visible());\n    });\n  },\n  exportLoggingEntries: function exportLoggingEntries() {\n    var self = this;\n    var today = new Date();\n    var date = AdminPanel.formatDate(today);\n    var fileName = 'dwengo_logging_entries_' + date + '.json';\n    var dateFrom = $(\"#datepicker-from\").datepicker('getDate');\n    var dateUntil = $(\"#datepicker-until\").datepicker('getDate');\n    var data = {\n      \"dateFrom\": dateFrom,\n      \"dateUntil\": dateUntil\n    };\n    $.ajax({\n      type: \"POST\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/exportLogItems\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      data: JSON.stringify(data)\n    }).done(function (data) {\n      // The user is still logged in\n      var text = JSON.stringify(data, null, 2);\n      AdminPanel.download(fileName, text);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"POST\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getServerUrl() + \"/user/admin/exportLogItems\",\n            headers: {\n              \"Content-Type\": \"application/json\"\n            },\n            data: JSON.stringify(data)\n          }).done(function (data) {\n            // The user is still logged in\n            var text = JSON.stringify(data, null, 2);\n            AdminPanel.download(fileName, text);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  download: function download(filename, text) {\n    var element = document.createElement('a');\n    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));\n    element.setAttribute('download', filename);\n    element.style.display = 'none';\n    document.body.appendChild(element);\n    element.click();\n    document.body.removeChild(element);\n  },\n  formatDate: function formatDate(date) {\n    var year = date.getFullYear();\n    var month = date.getMonth() + 1;\n    var day = date.getDate();\n    var hours = date.getHours();\n    var minutes = date.getMinutes();\n    var formattedDate = '' + year + '' + (\"0\" + month).slice(-2) + '' + (\"0\" + day).slice(-2) + '-' + (\"0\" + hours).slice(-2) + (\"0\" + minutes).slice(-2);\n    return formattedDate;\n  }\n};\n$(function () {\n  AdminPanel.setupAdminPanel();\n});\n/* harmony default export */ __webpack_exports__[\"default\"] = (AdminPanel);\n\n//# sourceURL=webpack:///./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js?");

/***/ }),

/***/ "./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js":
/*!********************************************************************!*\
  !*** ./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/createClass.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\n/**\n * Class that is used for the local server configuration.\n * The application will be available on port 12032.\n * \n * \n */\nvar ServerConfig = /*#__PURE__*/function () {\n  function ServerConfig() {\n    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0___default()(this, ServerConfig);\n  }\n\n  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1___default()(ServerConfig, null, [{\n    key: \"getServerUrl\",\n\n    /**\n     * \n     * @static\n     * @returns {string} The server URL on which you can access the Dwenguino simulator app.\n     */\n    value: function getServerUrl() {\n      return 'http://localhost:12032';\n    }\n  }]);\n\n  return ServerConfig;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ServerConfig);\n\n//# sourceURL=webpack:///./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\nmodule.exports = _classCallCheck;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\nmodule.exports = _createClass;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/createClass.js?");

/***/ })

/******/ });