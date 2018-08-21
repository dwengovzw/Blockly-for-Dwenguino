var DwenguinoBlocklyLanguageSettings = {};
//only use english and dutch for now
DwenguinoBlocklyLanguageSettings.LANGUAGE_NAME = {
      'en': 'English',
      'nl': 'Nederlands',
      'it': 'Italiano',
      'fr': 'français',
      'my': 'Malay',
      'el': 'Ελληνικά',
  };

//Set default language setting
DwenguinoBlocklyLanguageSettings.DEFAULT_LANG = 'my';

/**
* Extracts a parameter from the URL.
* If the parameter is absent default_value is returned.
* @param {string} name The name of the parameter.
* @param {string} defaultValue Value to return if paramater not found.
* @return {string} The parameter value or the default value if not found.
*/
DwenguinoBlocklyLanguageSettings.getStringParamFromUrl = function(name, defaultValue) {
var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
DwenguinoBlocklyLanguageSettings.getLang = function() {
  var lang = DwenguinoBlocklyLanguageSettings.getStringParamFromUrl('lang', '');
  if (DwenguinoBlocklyLanguageSettings.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = DwenguinoBlocklyLanguageSettings.DEFAULT_LANG;
  }
  return lang;
};

// Load the Code demo's language strings.
document.write('<script src="msg/' + DwenguinoBlocklyLanguageSettings.getLang() + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="../blockly/msg/js/' + DwenguinoBlocklyLanguageSettings.getLang() + '.js"></script>\n');
