/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _classCallCheck)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\n//# sourceURL=webpack://dwenguinoblockly-package/./node_modules/@babel/runtime/helpers/esm/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ _createClass)\n/* harmony export */ });\nfunction _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\n//# sourceURL=webpack://dwenguinoblockly-package/./node_modules/@babel/runtime/helpers/esm/createClass.js?");

/***/ }),

/***/ "./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js":
/*!************************************************************************!*\
  !*** ./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _server_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../server_config.js */ \"./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js\");\n\nvar AdminPanel = {\n  setupAdminPanel: function setupAdminPanel() {\n    this.showUserInfo();\n    this.showStatistics();\n    $(\"#export-logging-entries\").on(\"click\", function () {\n      AdminPanel.exportLoggingEntries();\n    });\n    $(\"#datepicker-from\").datepicker();\n    $(\"#datepicker-until\").datepicker();\n  },\n  showUserInfo: function showUserInfo() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user\"\n    }).done(function (data) {\n      // The user is still logged in\n      var firstname = data.firstname;\n      $('#userName').text(firstname);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user\"\n          }).done(function (data) {\n            // The user is still logged in\n            var firstname = data.firstname;\n            $('#userName').text(firstname);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else if (response.status == 401) {// The user was never logged in so there is no user info.\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showStatistics: function showStatistics() {\n    AdminPanel.showTotalNumberOfUsers();\n    AdminPanel.showTotalNumberOfVerifiedUsers();\n    AdminPanel.showTotalNumberOfLogItems();\n    AdminPanel.showTotalNumberOfRecentLogItems();\n    AdminPanel.showRecentLogEntries();\n    AdminPanel.showRecent100LogEntries();\n  },\n  showTotalNumberOfUsers: function showTotalNumberOfUsers() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalUsers\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalUsers = data.totalUsers;\n      $('#totalUsers').text(totalUsers);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalUsers\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalUsers = data.totalUsers;\n            $('#totalUsers').text(totalUsers);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfVerifiedUsers: function showTotalNumberOfVerifiedUsers() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalVerifiedUsers\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalVerifiedUsers = data.totalVerifiedUsers;\n      $('#totalVerifiedUsers').text(totalVerifiedUsers);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalVerifiedUsers\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalVerifiedUsers = data.totalVerifiedUsers;\n            $('#totalVerifiedUsers').text(totalVerifiedUsers);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfLogItems: function showTotalNumberOfLogItems() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalLogItems\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalLogItems = data.totalLogItems;\n      $('#totalLogEntries').text(totalLogItems);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalLogItems\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalLogItems = data.totalLogItems;\n            $('#totalLogEntries').text(totalLogItems);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showTotalNumberOfRecentLogItems: function showTotalNumberOfRecentLogItems() {\n    var self = this;\n    $.ajax({\n      type: \"GET\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalRecentLogItems\"\n    }).done(function (data) {\n      // The user is still logged in\n      var totalLogItems = data.totalLogItems;\n      $('#totalLogEntriesRecently').text(totalLogItems);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"GET\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/totalRecentLogItems\"\n          }).done(function (data) {\n            // The user is still logged in\n            var totalLogItems = data.totalLogItems;\n            $('#totalLogEntriesRecently').text(totalLogItems);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  showRecentLogEntries: function showRecentLogEntries() {\n    var self = this;\n\n    if ($.fn.dataTable.isDataTable('#recentLogEntries')) {\n      var _table = $('#recentLogEntries').DataTable();\n\n      _table.destroy();\n    }\n\n    var table = $('#recentLogEntries').DataTable({\n      ajax: {\n        url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + '/user/admin/getRecentLogItems',\n        dataSrc: '',\n        deferRender: true,\n        error: function error(response, _error, code) {\n          console.log(code);\n\n          if (response.status == 403) {\n            $.ajax({\n              type: \"POST\",\n              url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n            }).done(function (data) {\n              AdminPanel.showRecentLogEntries();\n            });\n          }\n        }\n      },\n      columns: [{\n        data: 'timestamp'\n      }, {\n        data: 'eventName'\n      }, {\n        data: 'userId'\n      }, {\n        data: 'sessionId'\n      }, {\n        data: 'data',\n        render: function render(data, type, row) {\n          return '<textarea>' + data + '</textarea>';\n        }\n      }]\n    });\n    $('#recentLogEntriesVisibility a.toggle-vis').on('click', function (e) {\n      e.preventDefault(); // Get the column API object\n\n      var column = table.column($(this).attr('data-column')); // Toggle the visibility\n\n      column.visible(!column.visible());\n    });\n  },\n  showRecent100LogEntries: function showRecent100LogEntries() {\n    var self = this;\n\n    if ($.fn.dataTable.isDataTable('#recent100LogEntries')) {\n      var _table2 = $('#recent100LogEntries').DataTable();\n\n      _table2.destroy();\n    }\n\n    var table = $('#recent100LogEntries').DataTable({\n      ajax: {\n        url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + '/user/admin/getRecent100LogItems',\n        dataSrc: '',\n        // deferRender: true,\n        error: function error(response, _error2, code) {\n          console.log(code);\n\n          if (response.status == 403) {\n            $.ajax({\n              type: \"POST\",\n              url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n            }).done(function (data) {\n              AdminPanel.showRecent100LogEntries();\n            });\n          }\n        }\n      },\n      columns: [{\n        data: 'timestamp'\n      }, {\n        data: 'eventName'\n      }, {\n        data: 'userId'\n      }, {\n        data: 'sessionId'\n      }, {\n        data: 'data',\n        render: function render(data, type, row) {\n          return '<textarea>' + data + '</textarea>';\n        }\n      }]\n    });\n    $('#recent100LogEntriesVisibility a.toggle-vis').on('click', function (e) {\n      e.preventDefault(); // Get the column API object\n\n      var column = table.column($(this).attr('data-column')); // Toggle the visibility\n\n      column.visible(!column.visible());\n    });\n  },\n  exportLoggingEntries: function exportLoggingEntries() {\n    var self = this;\n    var today = new Date();\n    var date = AdminPanel.formatDate(today);\n    var fileName = 'dwengo_logging_entries_' + date + '.json';\n    var dateFrom = $(\"#datepicker-from\").datepicker('getDate');\n    var dateUntil = $(\"#datepicker-until\").datepicker('getDate');\n    var data = {\n      \"dateFrom\": dateFrom,\n      \"dateUntil\": dateUntil\n    };\n    $.ajax({\n      type: \"POST\",\n      url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/exportLogItems\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      data: JSON.stringify(data)\n    }).done(function (data) {\n      // The user is still logged in\n      var text = JSON.stringify(data, null, 2);\n      AdminPanel.download(fileName, text);\n    }).fail(function (response, status) {\n      if (response.status == 403) {\n        // The user was previously logged in, but the access token is invalid. Try to refresh the token.\n        $.ajax({\n          type: \"POST\",\n          url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/auth/renew\"\n        }).done(function (data) {\n          // The user has successfully renewed the access token\n          $.ajax({\n            type: \"POST\",\n            url: _server_config_js__WEBPACK_IMPORTED_MODULE_0__.default.getServerUrl() + \"/user/admin/exportLogItems\",\n            headers: {\n              \"Content-Type\": \"application/json\"\n            },\n            data: JSON.stringify(data)\n          }).done(function (data) {\n            // The user is still logged in\n            var text = JSON.stringify(data, null, 2);\n            AdminPanel.download(fileName, text);\n          }).fail(function (response, status) {\n            console.log(status, response);\n          });\n        }).fail(function (response, status) {\n          console.log(status, response);\n        });\n      } else {\n        console.log(status, response);\n      }\n    });\n  },\n  download: function download(filename, text) {\n    var element = document.createElement('a');\n    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));\n    element.setAttribute('download', filename);\n    element.style.display = 'none';\n    document.body.appendChild(element);\n    element.click();\n    document.body.removeChild(element);\n  },\n  formatDate: function formatDate(date) {\n    var year = date.getFullYear();\n    var month = date.getMonth() + 1;\n    var day = date.getDate();\n    var hours = date.getHours();\n    var minutes = date.getMinutes();\n    var formattedDate = '' + year + '' + (\"0\" + month).slice(-2) + '' + (\"0\" + day).slice(-2) + '-' + (\"0\" + hours).slice(-2) + (\"0\" + minutes).slice(-2);\n    return formattedDate;\n  }\n};\n$(function () {\n  AdminPanel.setupAdminPanel();\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdminPanel);\n\n//# sourceURL=webpack://dwenguinoblockly-package/./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js?");

/***/ }),

/***/ "./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js":
/*!********************************************************************!*\
  !*** ./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/esm/classCallCheck.js\");\n/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/esm/createClass.js\");\n\n\n\n/**\n * Class that is used for the local server configuration.\n * The application will be available on port 12032.\n * \n * \n */\nvar ServerConfig = /*#__PURE__*/function () {\n  function ServerConfig() {\n    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__.default)(this, ServerConfig);\n  }\n\n  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__.default)(ServerConfig, null, [{\n    key: \"getServerUrl\",\n    value:\n    /**\n     * \n     * @static\n     * @returns {string} The server URL on which you can access the Dwenguino simulator app.\n     */\n    function getServerUrl() {\n      var serverport = window.location.port != \"\" ? \":\" + window.location.port : \"\";\n      return window.location.protocol + \"//\" + window.location.hostname + serverport;\n    }\n  }]);\n\n  return ServerConfig;\n}();\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ServerConfig);\n\n//# sourceURL=webpack://dwenguinoblockly-package/./Blockly-for-Dwenguino/DwenguinoIDE/js/src/server_config.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./Blockly-for-Dwenguino/DwenguinoIDE/js/src/admin/admin_panel.js");
/******/ 	
/******/ })()
;