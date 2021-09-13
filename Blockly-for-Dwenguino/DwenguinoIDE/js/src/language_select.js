var DwenguinoBlocklyLanguageSettings = {};
DwenguinoBlocklyLanguageSettings.LANGUAGE_NAME = {
      'en': 'English',
      'nl': 'Nederlands',
      'es': 'Español',
      'fr': 'français',
      'it': 'Italiano',   
      'de': 'Deutsch',
      'my': 'Malay',
      'pl': 'Polski',
      'el': 'Ελληνικά',
      'ar': 'عربى'
  };

//Set default language setting
DwenguinoBlocklyLanguageSettings.DEFAULT_LANG = 'nl';

DwenguinoBlocklyLanguageSettings.translate = function(translationKey){
  let translation = DwenguinoBlocklyLanguageSettings.findValueForTranslationKey(translationKey, MSG);
  if (translation){
    return translation;
  }else{
    translation = DwenguinoBlocklyLanguageSettings.findValueForTranslationKey(translationKey, MSG_FALLBACK);
    if (translation){
      return translation;
    }else{
      return "No translation";
    }
  }
};

DwenguinoBlocklyLanguageSettings.translateFrom = function(subdevision, translationKey){
  let translation = DwenguinoBlocklyLanguageSettings.findValueForTranslationKey(translationKey, MSG[subdevision]);
  if (translation){
    return translation;
  }else{
    translation = DwenguinoBlocklyLanguageSettings.findValueForTranslationKey(translationKey, MSG_FALLBACK[subdevision]);
    if (translation){
      return translation;
    }else{
      return "No translation";
    }
  }
};

/**
 * @Brief returns the value for a translation key
 * @Param translationKey an array containing the the keys of the subsequent subobjects
 */
DwenguinoBlocklyLanguageSettings.findValueForTranslationKey = function(translationKey, translationObject){
  let i = 0;
  while (translationObject[translationKey[i]]){
    translationObject = translationObject[translationKey[i]];
    i++;
  }
  if (typeof translationObject === 'string'){
    return translationObject;
  }else{ 
    return undefined;
  }
};

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
document.write('<script src="./DwenguinoIDE/msg/' + DwenguinoBlocklyLanguageSettings.getLang() + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="./blockly/msg/js/' + DwenguinoBlocklyLanguageSettings.getLang() + '.js"></script>\n');
