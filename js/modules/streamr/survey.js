console.log("modules/Streamr/survey.js");
import {Streamr} from './manifest.js';
Streamr.survey_matches = ["*://*.streamr.com/*"];
Streamr.survey = {
	name: "UX Survey",
	title: "UX Survey",
	viewGroup: "Survey",
	is_enabled: true,
	pages: [
		{
			name: "Profession",
			elements: [
				{
					type: "dropdown",
					name: "question1",
					title: "Please select the category that best describes your profession: ",
					choices: [
						{
							value: "Art",
							text: "Art"
						},
						{
							value: "Education",
							text: "Education"
						},
						{
							value: "HealthCare",
							text: "HealthCare"
						},
						{
							value: "Media",
							text: "Media"
						},
						{
							value: "Sales/Marketing",
							text: "Sales/Marketing"
						},
						{
							value: "Student",
							text: "Student"
						},
						{
							value: "IT/Technology",
							text: "IT/Technology"
						},
						{
							value: "Other",
							text: "Other"
						}
					]
				}
			]
		},
		{
			name: "Accessiblity",
			elements: [
				{
					type: "radiogroup",
					name: "question2",
					title: "Was the information easy to find? ",
					choices: [
						{
							value: "Yes",
							text: "Yes"
						},
						{
							value: "No",
							text: "No"
						}
					]
				},
				{
					type: "radiogroup",
					name: "question3",
					title: "Was the information clearly presented?",
					choices: [
						{
							value: "Yes",
							text: "Yes"
						},
						{
							value: "No",
							text: "No"
						}
					]
				},
				{
					type: "radiogroup",
					name: "question4",
					title: "Were you able to find what you were looking for?",
					choices: [
						{
							value: "Yes",
							text: "Yes"
						},
						{
							value: "No",
							text: "No"
						}
					]
				}
			]
		},
		{
			name: "OtherInformation",
			elements: [
				{
					type: "comment",
					name: "question5",
					title: "What other information should we provide on our website?"
				},
				{
					type: "comment",
					name: "question6",
					title: "How could we make the site easier to use?"
				}
			]
		},
		{
			name: "Overall",
			elements: [
				{
					type: "matrix",
					name: "question7",
					title: "Overall, how would you rate our site?",
					columns: [
						{
							value: 1,
							text: "Gtreat"
						},
						{
							value: 2,
							text: "Good"
						},
						{
							value: 3,
							text: "Average"
						},
						{
							value: 4,
							text: "Fair"
						},
						{
							value: 5,
							text: "Poor"
						}
					],
					choices: [
						1,
						2,
						3,
						4,
						5
					],
					rows: [
						"Accessibility",
						"Content",
						"Presentation"
					]
				}
			]
		}
	]
}