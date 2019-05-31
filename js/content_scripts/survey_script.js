console.log("survey_script.js");

var surveyScript = (function () {	
	var surveys = [];

	function send_msg(msg){
		browser.runtime.sendMessage(msg);
	}

	function showButton() {
		var bt = document.createElement('div');
		bt.id = 'surfstreamr-survey-bt';
		bt.innerHTML = 'Survey';
		var body = document.getElementsByTagName('body')[0];
		body.append(bt);
		bt.onclick = showModal;  
	}



	function showModal() {    
		var display1 = document.getElementById('surfstreamr-surveyModal').style.display;
		var display2 = document.getElementById('surfstreamr-surveyOptionsMain').style.display;
		if(display1 == "block" || display2 == "block") {
			document.getElementById('surfstreamr-surveyModal').style.display = 'none';
			document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'none';
		}
		else {		
			document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'block';
		}
	}

	function startSurvey(message) {
		let selectSurvey = document.getElementById('surfstreamr-selectSurvey');
		let surveyId = selectSurvey.options[selectSurvey.selectedIndex].value;
		if(!surveyId)
			return;
		document.getElementById('surfstreamr-surveyOptionsMain').style.display = 'none';
		document.getElementById('surfstreamr-surveyModal').style.display = 'block';
		var json = {pages: surveys[surveyId].pages};
		window.survey = new Survey.Model(json);
		survey
			.onComplete
			.add(function (result) {
				showModal();
				let respMessage = {
					obj: "DataHandler",
					func: "handle",
					params: [{
							origin: window.location.href,
							header: {
								module: message.moduleName,
								function: "Survey",
								collector: message.surveys[surveyId].name
							},
							data: {
								out: {
									survey: result.data
								},
								schems: [
									{jpath:"$.survey",type:"unknown"}
								]
							}
						}]
				}
				send_msg(respMessage);			
			});

		$("#surfstreamr-surveyElement").Survey({model: survey});
	}

	function handleResponse(message) {
		if(!message || !message.surveys || message.surveys.length == 0)
			return;
		surveys = message.surveys
		var surveyModal = document.createElement('div');
		surveyModal.id = 'surfstreamr-surveyModal';
		var surveyOptionsMain = document.createElement('div');
		surveyOptionsMain.id = 'surfstreamr-surveyOptionsMain';
		var surveyOptions = document.createElement('div');
		surveyOptions.id = 'surfstreamr-surveyOptions';
		var surveyElement = document.createElement('div');	
		surveyElement.id = 'surfstreamr-surveyElement';
		var surveyResult = document.createElement('div');	
		surveyResult.id = 'surfstreamr-surveyResult';
		var body = document.getElementsByTagName('body')[0];
		body.append(surveyModal);
		body.append(surveyOptionsMain);
		surveyOptionsMain.append(surveyOptions);
		surveyModal.append(surveyElement);
		surveyModal.append(surveyResult);
		
		
		var frag = document.createDocumentFragment();
		var title = document.createElement('span');	
		title.id = 'surfstreamr-title';
		title.innerText = "Choose The Survey You Are Going To Do";

		
		var surveySelectWrapper = document.createElement('div');	
		surveySelectWrapper.id = 'surfstreamr-surveySelectWrapper';
		var selectSurvey = document.createElement("select");
		selectSurvey.id = 'surfstreamr-selectSurvey';
		
		
		var startButton = document.createElement("button");
		startButton.id = "surfstreamr-startButton"
		startButton.innerHTML = 'Start Survey';
		startButton.onclick = function(){startSurvey(message)};

		selectSurvey.options.add( new Option("Choose...","") );
		for(let surveyId in surveys) {
		   selectSurvey.options.add( new Option(surveys[surveyId].name,surveyId) );       
		}

		frag.appendChild(title);
		surveySelectWrapper.appendChild(selectSurvey);
		frag.appendChild(surveySelectWrapper);
		surveyOptions.appendChild(frag);
		surveyOptionsMain.appendChild(startButton);
		showButton();
	}

	function handleError(error) {
	  console.log(`Error: ${error}`);
	}
	
	return {
		handleResponse: handleResponse,
		handleError: handleError
	}
}());

if(typeof window.surfStreamrSurveyMessage === 'undefined') {
	window.surfStreamrSurveyMessage = {
		obj: "Survey",
		func: "injectSurvey",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(window.surfStreamrSurveyMessage).then(surveyScript.handleResponse, surveyScript.handleError);  	
}