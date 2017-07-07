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


		  s.innerHTML = "console.log(selector_gadget.path_output_field.value); var selector=selector_gadget.path_output_field.value;  localStorage.setItem('selector', selector);";
		  document.body.appendChild(s);

		  var selector = localStorage.getItem('selector');
      var selectedContents = [selector];

		  var selectedElements = document.querySelectorAll(selector);
      for (var i = 0 ; i < selectedElements.length; i++)
      {
        var element = selectedElements[i];
        if (element.tagName.toLowerCase() == "img")
        {
          selectedContents.push(element.src);
        }
       else
        {
          selectedContents.push(element.textContent);
        }
      }

      return selectedContents;
    }

    //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
    chrome.tabs.executeScript({
        code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
  
  		//console.log(results[0]);

  		var selectedSelectors = JSON.parse(localStorage.getItem("selectedSelectors"));
  		if (selectedSelectors == null)
  		{
  			selectedSelectors = [];
  		}
  		selectedSelectors.push(results[0][0]);
  		localStorage.setItem("selectedSelectors", JSON.stringify(selectedSelectors));

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
	var selectedSelectors = JSON.parse(localStorage.getItem("selectedSelectors"));
	var selectedContents = JSON.parse(localStorage.getItem("selectedContents"));

	var resultObject = new Object();

	var selectorsObject = new Object();

	var i;

	for (i = 0 ; i < selectedSelectors.length; i++)
	{
		var selector = selectedSelectors[i];
		selectorsObject[tagList[i]] = selector;
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

  		console.log(selectedSelectors);
  		var i;
  		for (i = 0 ; i < selectedSelectors.length; i++)
  		{
  			var randomColor = getRandomColor();
  			var elements = document.querySelectorAll(selectedSelectors[i]);
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
        code: 'var selectedSelectors=' + JSON.stringify(selectedSelectors) + ';' + '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
    }, (results) => {
        
	});

	return resultObject;
}

