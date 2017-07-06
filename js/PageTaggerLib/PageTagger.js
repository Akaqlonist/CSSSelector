var selectedClasses = [];

function PageTagger() {

	this.showSelection = true;
}

PageTagger.prototype.init = function(options = true)
{
	this.showSelection = options;
}

PageTagger.prototype.select = function(tagName)
{
	function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
  		//console.log(document.body);
  		var s=document.createElement('div');
		s.innerHTML='Loading...';
		s.style.color='black';
		s.style.padding='20px';
		s.style.position='fixed';
		s.style.zIndex='9999';
		s.style.fontSize='3.0em';
		s.style.border='2px%20solid%20black';
		s.style.right='40px';
		s.style.top='40px';
		s.setAttribute('class','selector_gadget_loading');
		s.style.background='white';
		document.body.appendChild(s);

		var selectorGadgetUrl = chrome.extension.getURL('../js/PageTaggerLib/SelectorGadget/SelectorGadget.js');
		var cssUrl = chrome.extension.getURL('../js/PageTaggerLib/SelectorGadget/SelectorGadget.css');
		var jqueryUrl = chrome.extension.getURL('../js/jquery-1.9.1.min.js');
		var diffUrl = chrome.extension.getURL('../js/PageTaggerLib/SelectorGadget/diff_match_patch.js');
		var domUrl = chrome.extension.getURL('../js/PageTaggerLib/SelectorGadget/dom.js');
		var interfaceUrl = chrome.extension.getURL('../js/PageTaggerLib/SelectorGadget/interface.js');


		s=document.createElement('script');
		s.setAttribute('type','text/javascript');
		s.innerHTML = "var cssUrl='" + cssUrl + "'; var jqueryUrl='" + jqueryUrl + "'; var diffUrl='" + diffUrl + "'; var domUrl='" + domUrl + "'; var interfaceUrl='" + interfaceUrl + "';"
		document.body.appendChild(s);

		s=document.createElement('script');
		s.setAttribute('type','text/javascript');
		s.setAttribute('src', selectorGadgetUrl);
		document.body.appendChild(s);

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        //Here we have just the innerHTML and not DOM structure
        //console.log(results.body.innerHTML);
        //console.log(results[0]);
        //var mainDocument = results[0];
        localStorage.setItem("currentTagName", tagName);
        window.close();
        
	});	
}

PageTagger.prototype.acceptSelection = function()
{
	function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
  		s=document.createElement('script');
		s.setAttribute('type','text/javascript');


		s.innerHTML = "console.log(selector_gadget.selected[0].className); var classNames=selector_gadget.selected[0].className.split(' '); var selectedClassName = ''; var i; for(i = 0; i < classNames.length; i++){if(classNames[i].includes('sg_') == false){selectedClassName = selectedClassName + classNames[i] + ' ';}} selectedClassName = selectedClassName.replace(/\s+$/, ''); localStorage.setItem('selectedClass', selectedClassName); console.log(localStorage.getItem('selectedClass'));";
		document.body.appendChild(s);

		var selectedClass = localStorage.getItem('selectedClass');


		var selectedElements = document.getElementsByClassName(selectedClass);
		var i;
		var selectedContents = [selectedClass];
		for (i=0; i < selectedElements.length; i++)
		{
			if (selectedElements[i].tagName.toLowerCase() == "img")
			{
				selectedContents.push(selectedElements[i].src);
			}
			else
			{
				selectedContents.push(selectedElements[i].textContent);
			}
			
		}

        return selectedContents;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
  
  		//console.log(results);

  		var selectedClasses = JSON.parse(localStorage.getItem("selectedClasses"));
  		if (selectedClasses == null)
  		{
  			selectedClasses = [];
  		}
  		selectedClasses.push(results[0][0]);
  		localStorage.setItem("selectedClasses", JSON.stringify(selectedClasses));

  		var selectedContents = JSON.parse(localStorage.getItem("selectedContents"));
  		if (selectedContents == null)
  		{
  			selectedContents = [];
  		}
  		var contentData = [];
  		for (var i = 1; i < results[0].length; i++)
  		{
  			contentData.push(results[0][i]);
  		}
  		selectedContents.push(contentData);
  		localStorage.setItem("selectedContents", JSON.stringify(selectedContents));

  		var tagList = JSON.parse(localStorage.getItem("tagList"));
  		if (tagList == null)
  		{
  			tagList = [];
  		}
  		tagList.push(localStorage.getItem("currentTagName"));

  		localStorage.setItem("tagList", JSON.stringify(tagList));

  		console.log(selectedClasses);
  		console.log(selectedContents);

  		initTagName();

  		this.cancel();
	});	
}

PageTagger.prototype.cancel = function()
{
	function modifyDOM() {
        //You can play with your DOM here or check URL against your regex
  		s=document.createElement('script');
		s.setAttribute('type','text/javascript');
		s.innerHTML = "selector_gadget.unbind();"
		document.body.appendChild(s);

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
  
	});	
}

PageTagger.prototype.result = function()
{
	var tagList = JSON.parse(localStorage.getItem("tagList"));
	var selectedClasses = JSON.parse(localStorage.getItem("selectedClasses"));
	var selectedContents = JSON.parse(localStorage.getItem("selectedContents"));

	var resultObject = new Object();

	var selectorsObject = new Object();

	var i;

	for (i = 0 ; i < selectedClasses.length; i++)
	{
		var className = selectedClasses[i];
		selectorsObject[tagList[i]] = className;
	}


	resultObject["selectors"] = selectorsObject;

	var dataObject = [];

	for (i = 0 ; i < selectedContents[0].length; i++)
	{
		var j;
		var data = new Object();
		for (j = 0 ; j < tagList.length; j++)
		{
			data[tagList[j]] = selectedContents[j][i];
		}

		dataObject.push(data);
	}

	resultObject["data"] = dataObject;

	console.log(JSON.stringify(resultObject));

	//hightlight whole selection

	function modifyDOM() {
        //You can play with your DOM here or check URL against your regex

        function getRandomColor(){
        	var letters = '0123456789ABCDEF';
        	var color = '#';
        	for(var i = 0 ; i < 6; i++)
        	{
        		color += letters[Math.floor(Math.random() * 16)];
        	}
        	return color;
        }

  		console.log(selectedClasses);
  		var i;
  		for (i = 0 ; i < selectedClasses.length; i++)
  		{
  			var randomColor = getRandomColor();
  			var elements = document.getElementsByClassName(selectedClasses[i]);
  			console.log(elements.length);
  			for(var j = 0; j < elements.length; j++)
  			{
  				var element = elements[j];

  				if (element.tagName.toLowerCase() == 'img')
  				{
  					element.style.backgroundColor = randomColor;
  					element.style.backgroundImage = 'none';
  					element.style.borderWidth = 'thick';
  					element.style.borderColor = randomColor;
  					element.style.borderStyle = 'solid';
  				}
  				else
  				{
  					element.style.backgroundColor = randomColor;
  				}
  				
  			}
  		}

        return document.body.innerHTML;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: 'var selectedClasses=' + JSON.stringify(selectedClasses) + ';' + '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        
	});

	return resultObject;
}

