var filterUtils = (function() {
    'use strict';
    function regexFilter(input, regex) {
        if(input.match(regex))
            return null;
        return input;
    }

    function matchFilter(input, match) {
        if(input == match)
            return null;
        return input;
    }

    function wildcardFilter(input, wildcard) {
        var regex = new RegExp('^' + wildcard.split(/\*+/).map(regExpEscape).join('.*') + '$');
        if(input.match(regex))
            return null;
        return input;
    }

    function regExpEscape (s) {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }

    function filter(input, filters) {
            for (f of filters) {
                ret = "";
                switch(f.type) {
                    case "regex":
                        ret = regexFilter(input, f.pattern);
                        break;
                    case "wildcard":
                        ret = wildcardFilter(input, f.pattern);
                        break;
                    case "exact":
                        ret = matchFilter(input, f.pattern);
                        break;
                }
                if (!ret)
                    return ret;
            }
            return ret;
    }
    
    return {
        filter: filter               
    };
    
}());
export {filterUtils};