/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');

}

function initTagName(currentTagName = null)
{
	if (currentTagName != null)
	{
		document.getElementById('tagName').value = currentTagName;
		return;
	}

	var tagList = JSON.parse(localStorage.getItem('tagList'));

	if (tagList == null)
	{
		tagList = [];
	}

	document.getElementById('tagName').value = 'tag' + (tagList.length + 1);
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

document.getElementById('btnSelect').onclick = onSelect;
document.getElementById('btnAccept').onclick = onAcceptSelection;
document.getElementById('btnCancel').onclick = onCancelSelection;
document.getElementById('btnResult').onclick = onResult;
document.getElementById('btnClear').onclick = onClear;

//set tag name
var currentTagName = localStorage.getItem('currentTagName');
initTagName(currentTagName);

//init PageTagger

var pageTagger = new PageTagger();
pageTagger.init(true);



function onSelect () {
	
	var tagName = document.getElementById("tagName").value;

	pageTagger.select(tagName);
	
}

function onAcceptSelection()
{
	pageTagger.acceptSelection();
}

function onCancelSelection()
{
	pageTagger.cancel();
}

function onResult()
{
	pageTagger.result();
}

function onClear()
{
	localStorage.clear();
}


