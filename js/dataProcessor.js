function enforcePolicy(object) {
	moduleName = object.module;
	paramsInfo = object.output.params;
	var ptr = JsonPointer.noConflict();
	for(pInfo of paramsInfo) {
		jpointers = JSONPath.JSONPath({path: pInfo.jpath, resultType: "pointer" ,json: object.output.data});
		for (jp of jpointers) {
			var val = ptr.get(object.output.data, jp);
			val = objectPrivacy(val, pInfo.type, 2)
			ptr.set(object.output.data, jp, val);
			
		}
	}
	return object;
}


obj = { module: "facebook",
       output: {
         data: {
           url: "https://www.authsaz.com/test/privacy/policy?t=30&u=fdfd"
         }, 
         params: [{jpath: "$.url", type: "url"} ]
       }
      };
           