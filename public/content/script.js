                function choicesShowHide(x, qType) {
                    x.style.display = (qType.value === "mco" || qType.value === "mca") ? "block" : "none";
                }
                class SurveyForm {
                    constructor (frm){
                        this.qText = frm.elements["txtQuestionText"];
                        this.qList = frm.elements["lstQuestions"];
                        this.qTextArray = frm.elements["txtQuestionsArray"];
                        this.qType = frm.elements["lstQuestionType"];
                        this.cTextArray = frm.elements["txtChoicesArray"];
                        this.cList = frm.elements["lstChoices"];
                        this.cText = frm.elements["txtChoiceText"];
                        this.editButton = frm.elements["btnEditQuestion"];
                        this.cancelEditButton = frm.elements["btnCancelEditQuestion"];
                        this.addButton = frm.elements["btnAddQuestion"];
                        this.deleteButton = frm.elements["btnDeleteQuestion"];
                    }
                }
                // ***************************** List and Text Items Functions **********************************
                function addItemToList(txt, lst) { 
                    lst.options[lst.length] = new Option(txt, txt); 
                }
                function deleteListItem(lst) {                    
                    let selectedList=[];
                    let n = lst.selectedOptions.length;
                    if (n ==0)
                        alert("Please select an item from the ListBox");  
                    else
                        for (let i = n-1; i >= 0; i--){
                            selectedList.push(lst.selectedOptions[i].index);
                            lst.options[lst.selectedOptions[i].index]=null;                            
                        }
                    return selectedList.sort();
                }
                function getListItems(lst){
                    let listItemsArray = [];
                    for (let i = 0; i < lst.options.length; i++){
                        let item = '{"choice" : "' + lst.options[i].value + '"}';
                        listItemsArray.push(item);
                    }
                        return listItemsArray;
                }
                function addItemToTextArray (txt, item){
                    let questions=[];
                    if (txt.value) {
                        questions = JSON.parse(txt.value);
                    }
                    questions.push(JSON.parse(item));
                    txt.value =  JSON.stringify(questions);                                    
                }
                function deleteItemFromTextArray (txt, selectedList){
                    if (txt.value) {
                        let questions = JSON.parse(txt.value);
                        for (let i = selectedList.length-1; i >=0 ; i--)
                            questions.splice(selectedList[i], 1);
                        txt.value = JSON.stringify(questions);  
                    }                                   
                }
                function displayItemsFromTextArray(){
                    //
                }
                function validateInputField(inputField, msg){
                    if (inputField.value)
                        return true;
                    alert(msg);
                    return false;                    
                }
                // ***************************** Choices Processing Functions **********************************
                function addChoice(txtChoice, lstChoices, txtChoicesArray) { 
                    if (! validateChoice(form))
                        return false;
                    addItemToList(txtChoice.value, lstChoices);
                    addItemToTextArray (txtChoicesArray, '{"choice" : "' + txtChoice.value +'"}');
                    txtChoice.value = "";
                }
                function deleteChoice(lstChoices) { 
                    let selectedList = deleteListItem(lstChoices);
                    deleteItemFromTextArray (txtChoicesArray, selectedList)                  
                }
                function clearChoice(frm){
                    form = new SurveyForm (frm);
                    form.cText.value="";
                }
                function displayChoice(frm){
                    form = new SurveyForm (frm);
                    form.cText.value=form.lstChoices.options[form.lstChoices.selectedIndex];
                }
                function validateChoice(form){
                    if (! validateInputField(form.cText, "Please Enter a Choice First"))
                        return false;                   
                    return true;
                }
                        
                // ***************************** Questions Processing Functions **********************************
                function addQuestion(frm) { 
                    form = new SurveyForm (frm);
                    if (! validateQuestion (form))
                        return false;
                    let question =  composeQuestion(form);
                    addItemToList(form.qText.value, form.qList);
                    addItemToTextArray (form.qTextArray, question);
                    clearQuestion(form);
                }               
                
                function deleteQuestion(frm) { 
                    form = new SurveyForm (frm);
                    let selectedList = deleteListItem(form.qList);
                    deleteItemFromTextArray (form.qTextArray, selectedList)
                    clearQuestion(form);
                }
                function displayQuestion(form){
                    let selectedQuestion = form.qList.selectedOptions[0].index;
                    let questions = JSON.parse(form.qTextArray.value);
                    let nQuestions = questions.length;
                    // Load question multiple choices if applicable to Text Array
                    if (questions[selectedQuestion].QMC)
                        form.cTextArray.value = JSON.stringify(questions[selectedQuestion].QMC);                    
                    
                    // Display question Text
                    form.qText.value = questions[selectedQuestion].QText;
                    // Display question Type
                    if (selectedQuestion == -1)
                        alert("Please Select a Question to edit");  
                    else{
                        for (let idx = 0; idx < form.qType.options.length; idx++)
                            if (form.qType.options[idx].value == questions[selectedQuestion].QType)
                                form.qType.selectedIndex = idx;
                    }
                    // Display question choices of the selected question to the choices list if applicable
                    if (selectedQuestion == -1)
                        alert("Please Select a Question to edit");  
                    else{
                        if (form.cTextArray.value){      // check if the question has choices
                            let choices = JSON.parse(form.cTextArray.value);
                            for (let idx = 0; idx < choices.length; idx++)
                                addItemToList(choices[idx].choice, form.cList);
                        }
                    }
                }
                function clearQuestion(form){
                    form.qText.value = "";
                    form.qType.selectedIndex = -1;
                    form.cText.value = "";
                    form.cTextArray.value = "";
                    form.cList.options.length = 0;
                }
                function validateQuestion(form){
                    if (! validateInputField(form.qText, "Please Enter a question First")) 
                        return false;
                    if (! validateInputField(form.qType, "Please Select a Question Type First"))
                        return false;     
                    if ((form.qType.value === "mco" || form.qType.value === "mca"))
                        if(! validateInputField(form.cTextArray, "Please Add choices to MCQ Type First"))
                            return false;                   
                    return true;
                }
                function composeQuestion(form){
                    let item ="";
                    item = '{"QText" : "' + form.qText.value + '" , "QType" : "' + form.qType.value + '"';                    
                    item += (form.qType.value == "mco" || form.qType.value == "mca") ? ', "QMC" : ' + form.cTextArray.value + '}' : '}';
                    return item;
                }
                // ***************************** Survey Processing Functions **********************************
                function loadSample(frm){
                    form = new SurveyForm (frm);
                    let questions =  [{"QText" : "What is your postal code?", "QType" : "open"},
                    {"QText" : "Are you satisfied with the product?", "QType" : "yn"},
                    {"QText" : "Will you recommend the product to a friend?", "QType" : "yn"},
                    {"QText" : "Are you :", "QType" : "mco", "QMC" : 
                        [{"choice" : "Single"},{"choice" : "Married"},{"choice" : "Single parent"},{"choice" : "Divorced"}]}, 
                    {"QText" : "Certificates obtained :", "QType" : "mca", "QMC" : 
                        [{"choice" : "Certificate x"},{"choice" : "Certificate y"},{"choice" : "Certificate z"},{"choice" : "Certificate w"}]}];
                                        
                    form.qTextArray.value = JSON.stringify(questions);
                    if (questions.length ==0)
                        alert("Please select a survey to edit");  
                    else
                        for (let i = 0; i < questions.length; i++)
                            addItemToList(questions[i].QText, form.qList);                   
                }
                function clearSurvey(frm){
                    form = new SurveyForm (frm);
                    clearQuestion(form);
                    form.qList.options.length = 0;
                }
                function displaySaveMode (form){
                    form.editButton.value = "Save Changes";
                    form.addButton.disabled = "disabled";
                    form.deleteButton.disabled = "disabled";
                    form.qList.disabled = "disabled";
                    form.cancelEditButton.style.display = "inline";
                }
                function displayEditMode (form){
                    form.editButton.value = "Edit Question";
                    form.addButton.disabled = "";
                    form.deleteButton.disabled = "";
                    form.qList.disabled = "";
                    form.cancelEditButton.style.display = "none";
                }
                function loadQuestion(frm){
                    form = new SurveyForm (frm);
                    if (form.qList.options.length == 0){                        
                        alert("Please Select a Question to edit"); 
                        return false; 
                    }
                    if (form.qList.selectedOptions.length == 0){                        
                        alert("Please Select a Question to edit"); 
                        return false; 
                    }
                    let selectedQuestion = form.qList.selectedOptions[0].index;
                    if (form.editButton.value == "Edit Question"){
                        displaySaveMode(form);
                        clearQuestion(form);
                        displayQuestion(form);
                    }else{
                        displayEditMode(form);
                        let questions = JSON.parse(form.qTextArray.value);
                        let q = composeQuestion(form);
                        questions[selectedQuestion] = JSON.parse(q);
                        form.qTextArray.value = JSON.stringify(questions);
                        clearSurvey(frm);
                        if (questions.length ==0)
                        alert("Please select a survey to edit");  
                    else
                        for (let i = 0; i < questions.length; i++)
                            addItemToList(questions[i].QText, form.qList);   
                    }
                }
                function cancelEditQuestion(frm){
                    form = new SurveyForm (frm);
                    displayEditMode(form);
                    clearQuestion(form);
                }
                function loadSurvey(frm){
                    if (frm.name = "questionsCustomization" )
                    form = new SurveyForm (frm);
                    if (form.qTextArray.value == "")
                        return false;
                    questions = JSON.parse(form.qTextArray.value);
                    console.log(questions);
                    if (questions.length ==0)
                        alert("Please select a survey to edit");  
                    else
                        for (let i = 0; i < questions.length; i++)
                            addItemToList(questions[i].QText, form.qList);   
                }
                // ***************************** Survey Questions Display Functions **********************************
                
            function constructSurvey(survey, frmSurvey) {
				let list = JSON.parse(survey).questions;
                if (list[0] == null) {
                    alert("There are no questions in this survey");
                    frmSurvey.elements["btnSubmit"].disabled="disabled";
                    return false;
                }
                // Create div.
                const div = document.createElement("div");
				
                // add json elements to the div.
                for (let i = 0; i < list.length; i++) {
					if (list[i]["QType"]== "open" ) {
						let lblQuestionText = document.createElement("label");												
						lblQuestionText.innerHTML = list[i]["QText"].toString() + ":";
						div.appendChild(lblQuestionText);
						let txtAnswerInput = document.createElement("input");
						txtAnswerInput.type = "text";
                        txtAnswerInput.name = "Q" + i;
						div.appendChild(txtAnswerInput);					
					}
						
					if (list[i]["QType"]== "yn" ) {
						let radioValues = ["Yes", "No"];
						let fldQuestionText = document.createElement("fieldset");
						fldQuestionText.id = "fsAnswersYN";
						let lgdQuestionText = document.createElement("legend");						
						lgdQuestionText.innerHTML = list[i]["QText"].toString();
						fldQuestionText.appendChild(lgdQuestionText);					
						for (let j = 0; j < radioValues.length; j++) {
							let radAnswerInput = document.createElement("input");						
							let lblRadioText = document.createElement("label");
							radAnswerInput.type = "radio";
							radAnswerInput.name = "Q" + i;
							radAnswerInput.value = radioValues[j];
							lblRadioText.innerHTML = radioValues[j];
							fldQuestionText.appendChild(radAnswerInput);							
							fldQuestionText.appendChild(lblRadioText);							
							//div.appendChild(document.createElement("br"));
						}					
						div.appendChild(fldQuestionText);						
					}
					if (list[i]["QType"]== "mco" || list[i]["QType"]== "mca") {					
						let radioValues = [];						
						for (let j = 0; j < (list[i]["QMC"]).length; j++) {						
							radioValues.push(list[i]["QMC"][j].choice);
						}
						
						let fldQuestionText = document.createElement("fieldset");
						fldQuestionText.id = "fsAnswersYN";
						let lgdQuestionText = document.createElement("legend");						
						lgdQuestionText.innerHTML = list[i]["QText"].toString();
						fldQuestionText.appendChild(lgdQuestionText);					
						for (let j = 0; j < radioValues.length; j++) {
							let radAnswerInput = document.createElement("input");						
							let lblRadioText = document.createElement("label");
							if (list[i]["QType"]== "mco") {	
								radAnswerInput.type = "radio";
							} else {
								radAnswerInput.type = "checkbox";
							}
							
							radAnswerInput.name = "Q" + i;
							radAnswerInput.value = radioValues[j];
							lblRadioText.innerHTML = radioValues[j];
							fldQuestionText.appendChild(radAnswerInput);							
							fldQuestionText.appendChild(lblRadioText);
							fldQuestionText.appendChild(document.createElement("br"));							
						}					
						div.appendChild(fldQuestionText);						
					}
													
					div.appendChild(document.createElement("br"));
					div.appendChild(document.createElement("br"));
				}
                // let btnSubmit = document.createElement("button");
                //     btnSubmit.className="btn btn-primary";
                //     btnSubmit.type="submit";
                //     btnSubmit.id = "btnSubmit";
                //     //btnSubmit.onclick="composeAnswer(frmSurvey)"
                //     btnSubmit.class="btn btn-primary";
                //     btnSubmit.innerHTML = '<i class="fas fa-edit"></i> Submit'
				// 	div.appendChild(btnSubmit);
                // Now, add the newly created table with json data, to a container.
                // const divShowSurvey = document.getElementById('divSurvey');
                const divShowSurvey = frmSurvey;
                //divShowSurvey.innerHTML = "";
                divShowSurvey.appendChild(div);
            }
    