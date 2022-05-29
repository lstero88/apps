var lastRowClickedIndex = -1;
var clickEventType = -1;
var focusedFileName;
var readOnlyFileName;

var appFileName = "app3.html";


 

function setAttribute(object, attributeName, attributeValue) {
	var attributeNode = document.createAttribute(attributeName);
	attributeNode.value = attributeValue;
	object.setAttributeNode(attributeNode);
}

function getAllTextFilesFromBackEnd() {
	let documentData = {
		command: 'listTextFilesInFolder',
		appHTML: appFileName,
		parameters: ""
	};
	//ws.send(JSON.stringify(documentData));

 

	socket.emit('client_msg', documentData);
 
 
}

function buildTable(headerArray, fileArray) {
	var myTableDiv = document.getElementById("leftBox");
	var table = document.createElement('TABLE');
	var tr, td;
	table.border = '0';
	table.width = '95%';
	table.setAttribute("id", "myTable");
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	table.style.whiteSpace = "nowrap";
	tr = document.createElement('TR');
	tableBody.appendChild(tr);
	var headerBackground = "#DEDEDE";
	for(var h = 0; h < headerArray.length; h++) {
		td = document.createElement('TD');
		td.width = '125';
		td.height = '45';
		td.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
		td.appendChild(document.createTextNode(headerArray[h]));
		tr.appendChild(td);
	}
	td = document.createElement('TD');
	td.width = '125';
	td.height = '45';
	td.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	td.appendChild(document.createTextNode(""));
	tr.appendChild(td);
	td = document.createElement('TD');
	td.width = '100';
	td.setAttribute('style', 'font-size: 22px; font-weight: bold; background: ' + headerBackground);
	td.appendChild(document.createTextNode(""));
	tr.appendChild(td);
	for(var i = 0; i < fileArray.length; i++) {
		tr = document.createElement('TR');
		tr.id = "row" + i;
		tableBody.appendChild(tr);
		var btnBackgroundColor = "#FFFFFF";
		var btnBorderColor = "#D4D4D4";
		for(var j = 0; j < headerArray.length + 2; j++) {
			td = document.createElement('TD');
			td.width = '105';
			td.height = '45';
			td.setAttribute('style', 'font-size: 13px;');
			if(j == 0) {
				td.appendChild(document.createTextNode(fileArray[i].name));
			} else if(j == 1) {
				td.appendChild(document.createTextNode(fileArray[i].fileSize + " bytes"));
			} else if(j == 2) {
				td.appendChild(document.createTextNode(fileArray[i].fileType));
			} else if(j == 3) {
				td.appendChild(document.createTextNode(fileArray[i].fileCreationDate));
			} else if(j == 4) {
				var btnEditFile = document.createElement("BUTTON");
				var btnEditFileText = document.createTextNode("Edit File");
				var btnEditFileID = "btnEditFile_" + i;
				boldtext2 = document.createElement('strong');
				boldtext2.appendChild(btnEditFileText);
				btnEditFile.appendChild(boldtext2);
				btnEditFile.style.width = "auto";
				btnEditFile.style.height = "50px";
				btnEditFile.style.border = "1px solid " + btnBorderColor;
				btnEditFile.style.backgroundColor = btnBackgroundColor;
				btnEditFile.style.color = "#000";
				btnEditFile.id = btnEditFileID;
				btnEditFile.className = "classEditFileButtons";
				td.appendChild(btnEditFile);
			} else if(j == 5) {
				var btnDeleteFile = document.createElement("BUTTON");
				var btnDeleteFileText = document.createTextNode("Delete File");
				var btnDeleteFileID = "btnDeleteFile_" + i;
				btnDeleteFile.style.height = "50px";
				btnDeleteFile.style.border = "1px solid " + btnBorderColor;
				btnDeleteFile.style.backgroundColor = btnBackgroundColor;
				btnDeleteFile.style.color = "#000";
				btnDeleteFile.id = btnDeleteFileID;
				btnDeleteFile.className = "classDeleteFileButtons";
				boldtext2 = document.createElement('strong');
				boldtext2.appendChild(btnDeleteFileText);
				btnDeleteFile.appendChild(boldtext2);
				td.appendChild(btnDeleteFile);
			} else {
				td.appendChild(document.createTextNode(""));
			}
			tr.appendChild(td);
		}
	}
	myTableDiv.appendChild(table);
	var btnNewFile = document.createElement("BUTTON");
	var btnNewFileText = document.createTextNode("New Text File");
	var btnNewFileID = "btnNewFile";
	var boldtext3;
	boldtext3 = document.createElement('strong');
	boldtext3.appendChild(btnNewFileText);
	btnNewFile.appendChild(boldtext3);
	btnNewFile.style.width = "150px";
	btnNewFile.style.height = "50px";
	btnNewFile.style.backgroundColor = "#DBF3FA";
	btnNewFile.style.marginLeft = "10px";
	btnNewFile.style.color = "#000";
	myTableDiv.appendChild(btnNewFile);
	btnNewFile.onclick = function() {
		document.getElementById("popup_container").style.display = "block";
		document.getElementById('popup_content').innerHTML = "";
		var popup_content = document.getElementById('popup_content');
		var h2Text = document.createElement('h2');
		var headerTextNode = document.createTextNode("Create new file");
		h2Text.appendChild(headerTextNode);
		popup_content.appendChild(h2Text);
		var br;
		var boldtext = document.createElement('strong');
		var textnode = document.createTextNode("File name:");
		boldtext.appendChild(textnode);
		popup_content.appendChild(boldtext);
		document.getElementById("popup_content").style.margin = "0px 10px 20px 30px";
		document.getElementById("popup_content").style.font = "bold 20px arial,serif";
		document.getElementById("popup_content").style.height = "250px";
		br = document.createElement("br");
		popup_content.appendChild(br);
		var txtFileName = document.createElement("INPUT");
		txtFileName.setAttribute("id", "txtNewFileName");
		txtFileName.style.width = '250px';
		popup_content.appendChild(txtFileName);
		br = document.createElement("br");
		popup_content.appendChild(br);
		br = document.createElement("br");
		popup_content.appendChild(br);
		var btnSaveFile = document.createElement("BUTTON");
		var btnSaveFileText = document.createTextNode("Create File");
		var btnBackgroundColor = "black";
		var btnHoverColorCreate = "green";
		var btnHoverColorCancel = "red";
		btnSaveFile.style.width = "200px";
		btnSaveFile.style.height = "50px";
		btnSaveFile.style.backgroundColor = btnBackgroundColor;
		btnSaveFile.style.color = "white";
		btnSaveFile.setAttribute("id", "btnSaveFile");
		btnSaveFile.style.margins = "50px 50px 50px 50px";
		var boldtext2;
		boldtext2 = document.createElement('strong');
		boldtext2.appendChild(btnSaveFileText);
		btnSaveFile.appendChild(boldtext2);
		popup_content.appendChild(btnSaveFile);
		document.getElementById("btnSaveFile").onclick = function() {
			var newTextFileName = document.querySelector('#txtNewFileName');
			var m = newTextFileName.value.length;
			if(m == 0) {
				return;
			}
			var len1 = newTextFileName.value.length - 1;
			var a1 = newTextFileName.value.substring(len1 - 3);
			a1 == ".txt" ? null : newTextFileName.value += ".txt";  
			focusedFileName = newTextFileName.value;
			let documentData = {
				command: 'createEmptyTextFile',
				appHTML: appFileName,
				parameters: newTextFileName.value
			};
			//ws.send(JSON.stringify(documentData));
			socket.emit('client_msg', documentData);
		};
		document.getElementById("btnSaveFile").onmouseover = function() {
			this.style.backgroundColor = btnHoverColorCreate;
		};
		document.getElementById("btnSaveFile").onmouseout = function() {
			this.style.backgroundColor = btnBackgroundColor;
		};
		var textnodeSpace = document.createTextNode("  ");
		popup_content.appendChild(textnodeSpace);
		var btnCancelFile = document.createElement("BUTTON");
		var btnCancelFileText = document.createTextNode("Cancel File");
		btnCancelFile.style.width = "200px";
		btnCancelFile.style.height = "50px";
		btnCancelFile.style.backgroundColor = btnBackgroundColor;
		btnCancelFile.style.color = "white";
		btnCancelFile.setAttribute("id", "btnCancelFile");
		btnCancelFile.style.margins = "50px 50px 50px 50px";
		boldtext2 = document.createElement('strong');
		boldtext2.appendChild(btnCancelFileText);
		btnCancelFile.appendChild(boldtext2);
		popup_content.appendChild(btnCancelFile);
		document.getElementById("btnCancelFile").onmouseover = function() {
			this.style.backgroundColor = btnHoverColorCancel;
		};
		document.getElementById("btnCancelFile").onmouseout = function() {
			this.style.backgroundColor = btnBackgroundColor;
		};
		document.getElementById("btnCancelFile").addEventListener("click", function() {
			closePopup();
		});
		document.querySelector('.btn2').addEventListener("click", function() {
			closePopup();
		});
	}
}

function newTextFileCreated() {
	closePopup();
	document.getElementById('leftBox').innerHTML = "";
	getAllTextFilesFromBackEnd2();
}

function getAllTextFilesFromBackEnd2() {
	let documentData = {
		command: 'listTextFilesInFolder2',
		appHTML: appFileName,
		parameters: ""
	};
	socket.emit('client_msg', documentData);
	
}

function textFilesRetrieved2(a) {
	var headerArray = [];
	var fileArray = [];
	a.forEach(function(element, index) {
		if(index == 0) {
			for(var i = 0; i < element.length; i++) {
				headerArray.push(element[i]);
			}
		} else {
			let fileEntry = {
				name: element[0],
				fileSize: element[1],
				fileType: element[2],
				fileCreationDate: element[3]
			};
			fileArray.push(fileEntry);
		}
	});
	buildTable(headerArray, fileArray);
	setTableElementAttributes(fileArray);
	highlightRowContainingNewTextFile();
	
	
}

function highlightRowContainingNewTextFile() {
	for(let i = 1; i < document.getElementById("myTable").rows.length; i++) 
	{
		if(document.getElementById("myTable").rows[i].cells[0].innerHTML == focusedFileName)
		{
			document.getElementById("myTable").rows[i].cells[0].click();
			break;
		}
	}
}

function displayLoadingDataMessage() {
	var nullCheck1 = document.getElementById('rightBox_container_1') == null ? true : false;
	if(!nullCheck1) {
		var rightBox = document.getElementById('rightBox_container_1');
		rightBox.innerHTML = "Loading data, please wait....";
		rightBox.style.paddingLeft = "10px";
	} else {
		var div1 = document.createElement("div");
		div1.setAttribute("id", "rightBox_container_1");
		document.querySelector('#rightBox').appendChild(div1);
	}
}

function closePopup() {
	document.getElementById("popup_container").style.display = "none";
}

function strongText(domNodeID, textNodeObject) {
	var x = document.createElement('strong');
	x.appendChild(textNodeObject);
	domNodeID.appendChild(x);
}

function reassignButtonIDs() {
	let allEditButtons = document.querySelectorAll(".classEditFileButtons");
	let allDeleteButtons = document.querySelectorAll(".classDeleteFileButtons");
	let allButtonLength = allEditButtons.length;
	for(let j = 0; j < allButtonLength; j++) {
		allEditButtons[j].id = "btnEditFile_" + j;
		allDeleteButtons[j].id = "btnDeleteFile_" + j;
	}
}

function deleteTextFileSuccess() {
	document.getElementById('myTable').deleteRow(lastRowClickedIndex);
	reassignButtonIDs();
	focusedFileName = "";
	readOnlyFileName = "";
	lastRowClickedIndex = -1;
}

function textFileDataSaved() {
	let a1 = document.querySelector('#saveStatus');
	if(a1 != null) {
		document.querySelector('#saveStatus').innerHTML = "File saved! ";
		var txtString = document.querySelector('#txtEdit').value;
		document.querySelector('#myTable').rows[lastRowClickedIndex].cells[1].innerHTML = unescape(encodeURIComponent(txtString)).length + " bytes"
	}
}

function populateTextArea(loadSource, readOnlyDataLoaded) {
	var elem = loadSource;
	var ifReadOnlyFrameIsNull = elem == null ? true : false;
	if(ifReadOnlyFrameIsNull) {
		return;
	}
	var a1 = document.getElementById('rightBox_container_1');
	var txtData;
	if(!readOnlyDataLoaded) {
		a1.removeChild(elem);
		txtData = a1.innerHTML.replace(/<br ?\/?>/ig, "\n");
	} else {
		txtData = loadSource.replace(/<br ?\/?>/ig, "\n")
	}
	txtData = txtData.trim();
	a1.innerHTML = "";
	var lineBreakElement = document.createElement("br");
	a1.appendChild(lineBreakElement);
	var headerTextElement = document.createTextNode(`Edit file ${focusedFileName}`);
	var h1 = document.createElement("h1");
	h1.appendChild(headerTextElement);
	strongText(a1, h1);
	var saveFileTextNode = document.createTextNode("Save Changes");
	var saveButton = document.createElement("BUTTON");
	saveButton.style.width = "150px";
	saveButton.style.height = "35px";
	saveButton.style.background = "#004999";
	saveButton.style.color = "#FFF";
	saveButton.setAttribute("id", "saveButton");
	saveButton.appendChild(saveFileTextNode);
	a1.appendChild(saveButton);
	saveButton.onclick = function() {};
	saveButton.onmouseover = function() {
		document.querySelector('#saveButton').style.background = "#0062CC";
	};
	saveButton.onmouseout = function() {
		document.querySelector('#saveButton').style.background = "#004999";
	};
	var span1 = document.createElement("span");
	span1.style.marginLeft = "10px";
	span1.setAttribute("id", "saveStatus");
	a1.appendChild(span1);
	saveButton.onclick = function() {
		document.querySelector('#saveStatus').innerHTML = "Saving file. Please wait... ";
		let txtData = document.getElementById('txtEdit').value;
		let textFileData = [focusedFileName, txtData];
		let documentData = {
			command: 'saveTextFile',
			appHTML: appFileName,
			parameters: textFileData
		};
		 
		socket.emit('client_msg', documentData);
	};
	lineBreakElement = document.createElement("br");
	a1.appendChild(lineBreakElement);
	lineBreakElement = document.createElement("br");
	a1.appendChild(lineBreakElement);
	var txtEdit = document.createElement("TEXTAREA");
	txtEdit.style.width = "95%";
	txtEdit.style.height = "70%";
	txtEdit.value = txtData;
	txtEdit.setAttribute('id', 'txtEdit');
	a1.appendChild(txtEdit);
	document.getElementById('txtEdit').addEventListener('keydown', function(e) {
		if(e.key == 'Tab') {
			e.preventDefault();
			var start = this.selectionStart;
			var end = this.selectionEnd;
			this.value = this.value.substring(0, start) + "\t" + this.value.substring(end);
			this.selectionStart = this.selectionEnd = start + 1;
		}
		let checkSaveStatusMessage = document.querySelector('#saveStatus').innerHTML == "File saved! " ? 'true' : 'false';
		if(checkSaveStatusMessage) {
			document.querySelector('#saveStatus').innerHTML = "";
		};
	});
}

function loadTextEditWindow() {
	var readOnlyFrame = document.getElementById('read_only_frame');
	var loadfromBackEnd = focusedFileName != readOnlyFileName ? true : false;
	if(!loadfromBackEnd) {
		populateTextArea(document.querySelector('#read_only_frame'), false);
	} else {
		let documentData = {
			command: 'loadTextFile2',
			appHTML: appFileName,
			parameters: focusedFileName
		};
		//ws.send(JSON.stringify(documentData));
		socket.emit('client_msg', documentData);
		displayLoadingDataMessage();
	
	}
}

function determineClickEventType() {

	 

	setTimeout(() => {
		switch(clickEventType) {
			case 0:
				displayLoadingDataMessage();
				let documentData = {
					command: 'loadTextFile',
					appHTML: appFileName,
					parameters: focusedFileName
				};
				//ws.send(JSON.stringify(documentData));
				socket.emit('client_msg', documentData);
				break;
			case 1:
				loadTextEditWindow();
				break;
			case 2:
				if(confirm(`Are you sure that you want to delete file ${focusedFileName}?`)) {
					document.querySelector('#rightBox').innerHTML = "";
					let documentData = {
						command: 'deleteTextFile',
						appHTML: appFileName,
						parameters: focusedFileName
					};
					//ws.send(JSON.stringify(documentData));
					socket.emit('client_msg', documentData);
				}
				break;
			default:
				break;
		}
		clickEventType = -1;
	}, 1);
}

function setTableElementAttributes(fileArray) {
	var tableID = document.getElementById('myTable');
	var tableOutput = tableID.innerHTML.length;
	var firstCellPosition = 6;
	var rLength = tableID.rows.length;
	if(tableOutput > 0) {
		var table = document.getElementById('myTable');
		var cells = document.getElementById('myTable').getElementsByTagName('td');
		var selectedRowBackColor = "#000080";
		var selectedRowForeColor = "#FFFFFF";
		var btnElementID;
		for(var i = firstCellPosition; i < cells.length; i++) {
			var cell = cells[i];
			cell.addEventListener('click', function() {
				rLength = tableID.rows.length;
				var rowId = this.parentNode.rowIndex;
				var rowsNotSelected = table.getElementsByTagName('tr');
				for(var row = 1; row < rowsNotSelected.length; row++) {
					rowsNotSelected[row].style.backgroundColor = "";
					rowsNotSelected[row].style.color = "";
					rowsNotSelected[row].classList.remove('selected');
				}
				var rowSelected = table.getElementsByTagName('tr')[rowId];
				rowSelected.style.backgroundColor = selectedRowBackColor;
				rowSelected.style.color = selectedRowForeColor;
				rowSelected.className += " selected";
				focusedFileName = rowSelected.childNodes[0].textContent;
				if(clickEventType <= 0) {
					clickEventType = 0;
					determineClickEventType();
				}
				lastRowClickedIndex = rowId;
				let a = lastRowClickedIndex - 1;
				if(lastRowClickedIndex > -1) {
					var btnEditFileModifyBackground;
					for(var b = 0; b < rLength - 1; b++) {
						btnEditFileModifyBackground = "btnEditFile_" + b;
						if(b == a) {
							document.getElementById(btnEditFileModifyBackground).style.backgroundColor = "#DEDEDE";
						} else {
							document.getElementById(btnEditFileModifyBackground).style.backgroundColor = "#FFFFFF";
						}
					}
				}
			});
			cell.addEventListener('mouseleave', function() {
				var rowId = this.parentNode.rowIndex;
				var rowSelected = table.getElementsByTagName('tr')[rowId];
				if(lastRowClickedIndex != rowId) {
					rowSelected.style.backgroundColor = "";
				}
			});
			cell.addEventListener('mouseenter', function() {
				var rowId = this.parentNode.rowIndex;
				var rowsNotSelected = table.getElementsByTagName('tr');
				for(var row = 1; row < rowsNotSelected.length; row++) {
					rowsNotSelected[row].style.backgroundColor = "";
					rowsNotSelected[row].style.color = "";
					rowsNotSelected[row].classList.remove('selected');
				}
				var rowSelected = table.getElementsByTagName('tr')[rowId];
				rowSelected.style.backgroundColor = "#87CEEB";
				rowSelected.style.color = "#111111";
				rowSelected.className += " selected";
				if(lastRowClickedIndex > -1) {
					table.getElementsByTagName('tr')[lastRowClickedIndex].style.backgroundColor = selectedRowBackColor;
					table.getElementsByTagName('tr')[lastRowClickedIndex].style.color = selectedRowForeColor;
				}
			})
		}
		var btnHoverColor = "#D4F1F4";
		var btnBackgroundColor = "#FFFFFF";
		var btnBackgroundColor_highlighted = "#DEDEDE";
		var btnDeleteBackGroundColor = "#FF7F7F";
		for(var i = 0; i < rLength - 1; i++) {
			btnElementID = 'btnEditFile_' + i;
			document.getElementById(btnElementID).onmouseover = function() {
				this.style.backgroundColor = btnHoverColor;
			}
		};
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnEditFile_' + i;
		document.getElementById(btnElementID).onmouseout = function() {
			this.style.backgroundColor = btnBackgroundColor;
			a = lastRowClickedIndex - 1;
			if(lastRowClickedIndex > -1) {
				var btnEditFileModifyBackground;
				rLength = tableID.rows.length;
				for(var b = 0; b < rLength - 1; b++) {
					btnEditFileModifyBackground = "btnEditFile_" + b;
					if(b == a) {
						document.querySelectorAll(".classEditFileButtons")[b].style.backgroundColor = btnBackgroundColor_highlighted;
					} else {
						document.querySelectorAll(".classEditFileButtons")[b].style.backgroundColor = btnBackgroundColor;
					}
				}
			}
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnEditFile_' + i;
		document.getElementById(btnElementID).onclick = function() {
			clickEventType = 1;
			determineClickEventType();
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnDeleteFile_' + i;
		document.getElementById(btnElementID).onmouseover = function() {
			this.style.backgroundColor = btnDeleteBackGroundColor;
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnDeleteFile_' + i;
		document.getElementById(btnElementID).onmouseout = function() {
			this.style.backgroundColor = btnBackgroundColor;
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnDeleteFile_' + i;
		document.getElementById(btnElementID).onclick = function() {
			clickEventType = 2;
			determineClickEventType();
		}
	}
}

function textFilesRetrieved(a) {
	var headerArray = [];
	var fileArray = [];
	a.forEach(function(element, index) {
		if(index == 0) {
			for(var i = 0; i < element.length; i++) {
				headerArray.push(element[i]);
			}
		} else {
			let fileEntry = {
				name: element[0],
				fileSize: element[1],
				fileType: element[2],
				fileCreationDate: element[3]
			};
			fileArray.push(fileEntry);
		}
	});
	buildTable(headerArray, fileArray);
	setTableElementAttributes(fileArray);
}
getAllTextFilesFromBackEnd();