let lastRowClickedIndex = -1;
let clickEventType = -1;
let focusedFileName;
let isReadOnly = false;
let appFileName = "app4.html";
let trEventStore_mouseout;
let trEventStore_mouseover;
let trEventStore_click;

function csvFileSaved() {
	document.getElementById('saveStatus').innerHTML = "File saved!";
}
let body = document.querySelector('body');

function buildEditableOutput(csvData) {
	let editableCSV = class {
		constructor(headerData, fileData) {
			this.headerData = headerData;
			this.fileData = fileData;
		}
	};
	let txtValues;
	let currentValue;
	const header = csvData.shift();
	const fin = new editableCSV(header, csvData);
	const newDivContainer = document.createElement('DIV');
	newDivContainer.style.backgroundColor = "#FFFFFF";
	newDivContainer.setAttribute('id', 'newDivContainer');
	newDivContainer.style.width = "100%";
	newDivContainer.style.height = "90%";
	newDivContainer.style.overflowY = "scroll";
	let spanContainer = document.createElement("span");
	let text = document.createTextNode(`Edit view of ${focusedFileName}`);
	let h1 = document.createElement('H1');
	h1.setAttribute('style', 'margin-left: 10px;');
	h1.appendChild(text);
	spanContainer.appendChild(h1);
	spanContainer.style.color = "#111111";
	let btnSave = document.createElement("BUTTON");
	let btnSaveTextNode = document.createTextNode("Save CSV File");
	btnSave.setAttribute("id", "saveButton");
	btnSave.appendChild(btnSaveTextNode);
	btnSave.setAttribute('style', 'font-size: 16px; font-weight: bold; background: #FFFFFF; margin-left: 15px; width: 200px; height: 50px');
	btnSave.onmouseover = function() {
		this.style.backgroundColor = "#C9F6FF";
	};
	btnSave.onmouseout = function() {
		this.style.backgroundColor = "#FFFFFF";
	};
	btnSave.onclick = function() {
		let arrayCSVData = [];
		let lineArray = [];
		const getTableHeaders = document.getElementById('myTable2').querySelectorAll('.csvHeaderText');
		for(let a = 0; a < getTableHeaders.length; a++) {
			let headerValue = getTableHeaders[a].querySelector('INPUT').value;
			lineArray.push(headerValue);
		}
		arrayCSVData.push([lineArray]);
		lineArray = [];
		const tableRef = document.getElementById('myTable2');
		for(let b = 1; b < tableRef.rows.length; b++) {
			for(let c = 3; c < tableRef.rows[b].cells.length; c++) {
				let d1 = tableRef.rows[b].cells[c].querySelector('INPUT').value;
				if(d1.includes(",")) {
					d1 = '"' + d1.replace(/"/g, '""') + '"';
				}
				lineArray.push(d1);
			}
			//return;
			arrayCSVData.push([lineArray]);
			lineArray = [];
		}
		for(let e = 0; e < getTableHeaders.length; e++) {
			lineArray.push("");
			if(getTableHeaders.length == 1) {
				lineArray.push("");
			}
		}
		lineArray = [];
		document.getElementById('saveStatus').innerHTML = "Saving file. Please wait...";
		let csvFileData = [focusedFileName, arrayCSVData];
		let documentData = {
			command: 'saveCSVFile',
			appHTML: appFileName,
			parameters: csvFileData
		};
		socket.emit('client_msg', documentData);
	};
	newDivContainer.appendChild(spanContainer);
	newDivContainer.appendChild(btnSave);
	let spanContainer2 = document.createElement("span");
	text = document.createTextNode(``);
	spanContainer2.setAttribute("id", "saveStatus");
	spanContainer2.setAttribute('style', 'font-size: 16px; font-weight: bold; color: #000000; background: #FFFFFF; margin-left: 12px;');
	spanContainer2.appendChild(text);
	newDivContainer.appendChild(spanContainer2);
	let lineBreak;
	lineBreak = document.createElement('br');
	newDivContainer.appendChild(lineBreak);
	lineBreak = document.createElement('br');
	newDivContainer.appendChild(lineBreak);
	newDivContainer.style.marginLeft = "0px";
	newDivContainer.style.marginTop = "20px";
	document.getElementById('content_container').appendChild(newDivContainer);
	document.getElementById('content_container').style.overflowX = "scroll";
	const table = document.createElement('TABLE');
	let tr, th, td;
	table.setAttribute("id", "myTable2");
	table.style.whiteSpace = "nowrap";
	table.style.width = "auto";
	var tableHeader = document.createElement('THEAD');
	table.appendChild(tableHeader);
	const tableBody = document.createElement('TBODY');
	const trSelectedColor = "#FFFF00";
	const hoverColor = "#D4F1F4";
	tr = document.createElement('TR');
	tr.style.backgroundColor = "#FFFFFF";
	tr.style.color = "#000000";
	let headerBackground = "#FFFFF8";
	let headerTextBoxBackground = "#FFFFF8";
	let leftBorderColor = "#000080";
	table.style.backgroundColor = headerBackground;
	tableHeader.appendChild(tr);
	th = document.createElement('TH');
	th.height = '45';
	th.className = "csvHeader";
	let rowNumberLabel = "Row #";
	th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	th.appendChild(document.createTextNode(rowNumberLabel));
	tableHeader.appendChild(th);
	th = document.createElement('TH');
	th.width = '75';
	th.height = '45';
	th.className = "csvHeader";
	th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	th.appendChild(document.createTextNode(""));
	tableHeader.appendChild(th);
	th = document.createElement('TH');
	th.width = '75';
	th.height = '45';
	th.className = "csvHeader";
	th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	th.appendChild(document.createTextNode(""));
	tableHeader.appendChild(th);
	for(let i = 0; i < fin.headerData.length; i++) {
		th = document.createElement('TH');
		th.width = '125';
		th.height = '45';
		th.className = "csvHeaderText";
		th.setAttribute('style', 'text-align: center; font-size: 16px; font-weight: bold; background: ' + headerBackground);
		currentValue = fin.headerData[i];
		txtValues = document.createElement("INPUT");
		txtValues.setAttribute("type", "text");
		txtValues.setAttribute("value", currentValue);
		txtValues.setAttribute('style', 'font-weight: bold; background: ' + headerTextBoxBackground);
		th.appendChild(txtValues);
		let deleteColumnXText = "X";
		let deleteColumnXTextNode = document.createTextNode(deleteColumnXText);
		let btnDeleteColumn = document.createElement("BUTTON");
		btnDeleteColumn.id = `deleteColumnBtn_${i}`;
		btnDeleteColumn.className = "deleteColumn";
		btnDeleteColumn.appendChild(deleteColumnXTextNode);
		btnDeleteColumn.setAttribute('style', 'font-size: 13px; color: #000000; font-weight: bold; width: 30px; height: 30px; float: right; margin-right: -15px;');
		th.appendChild(btnDeleteColumn);
		tableHeader.appendChild(th);
		btnDeleteColumn.onclick = function(e) {
			let cellNumber = parseInt(this.id.split('_')[1]);
			if(confirm(`Are you sure that you want to delete column?`)) {
				let b1 = document.querySelectorAll('th').length - 1;
				for(let b2 = 3; b2 < b1; b2++) {
					if(parseInt(document.querySelectorAll('th')[b2].querySelector("BUTTON").id.split('_')[1]) == cellNumber) {
						let tble = document.getElementById("myTable2");
						let row = tble.rows;
						document.getElementsByTagName("th")[b2].remove();
						//for (var j = 1; j < row.length; j++) {
						for(var j = 1; j < row.length; j++) {
							try {
								row[j].deleteCell(b2);
							} catch(e) {}
						}
						reassignBtnDeleteColumnIDs();
						break;
					}
				}
			}
			return;
		};
	}
	th = document.createElement('TH');
	th.className = "csvHeader";
	th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	let addColumnText = "Add Column";
	let domAddColumnTextNode = document.createTextNode(addColumnText);
	let btnAddColumn = document.createElement("BUTTON");
	btnAddColumn.setAttribute("id", "addColumn");
	btnAddColumn.setAttribute('style', 'font-size: 13px; color: #000000; font-weight: bold;');
	btnAddColumn.appendChild(domAddColumnTextNode);
	th.appendChild(btnAddColumn);
	tableHeader.appendChild(th);
	btnAddColumn.onclick = function() {
		let x1 = document.getElementById('myTable2');
		let newHeaderLabel = "new header label";
		th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
		th = document.createElement('TH');
		th.width = '125';
		th.height = '45';
		th.className = "csvHeaderText";
		th.setAttribute('style', 'text-align: center; font-size: 16px; font-weight: bold; background: ' + headerBackground);
		let length2 = tableHeader.children.length;
		let length3 = document.querySelectorAll('.csvHeaderText').length;
		currentValue = "col" + parseInt(length3);
		txtValues = document.createElement("INPUT");
		txtValues.setAttribute("type", "text");
		txtValues.setAttribute("value", currentValue);
		txtValues.setAttribute('style', 'font-weight: bold; background: ' + headerTextBoxBackground);
		let deleteColumnXText = "X";
		let deleteColumnXTextNode = document.createTextNode(deleteColumnXText);
		let btnDeleteColumn = document.createElement("BUTTON");
		btnDeleteColumn.appendChild(deleteColumnXTextNode);
		let d3 = document.querySelectorAll('.deleteColumn').length;
		btnDeleteColumn.id = `deleteColumnBtn_${d3}`;
		btnDeleteColumn.className = "deleteColumn";
		btnDeleteColumn.setAttribute('style', 'font-size: 13px; color: #000000; font-weight: bold; width: 30px; height: 30px; float: right; margin-right: -15px;');
		th.appendChild(btnDeleteColumn);
		btnDeleteColumn.onclick = function(e) {
			if(confirm(`Are you sure that you want to delete column?`)) {
				let cellNumber = parseInt(this.id.split('_')[1]);
				let b1 = document.querySelectorAll('th').length - 1;
				for(let b2 = 3; b2 < b1; b2++) {
					if(parseInt(document.querySelectorAll('th')[b2].querySelector("BUTTON").id.split('_')[1]) == cellNumber) {
						let tble = document.getElementById("myTable2");
						let row = tble.rows;
						document.getElementsByTagName("th")[b2].remove();
						for(var j = 1; j < row.length; j++) {
							try {
								row[j].deleteCell(b2);
							} catch(e) {}
						}
						reassignBtnDeleteColumnIDs();
						break;
					}
				}
			}
		};
		th.appendChild(txtValues);
		tableHeader.insertBefore(th, tableHeader.children[length2 - 1]);
		for(let b = 1; b < x1.rows.length; b++) {
			currentValue = "";
			txtValues = document.createElement("INPUT");
			txtValues.setAttribute("type", "text");
			txtValues.setAttribute("value", currentValue);
			txtValues.setAttribute('style', 'font-weight: normal; background: #FFFFFF');
			td = document.createElement('TD');
			td.className = 'td1';
			td.setAttribute('style', 'font-size: 16px;');
			td.appendChild(txtValues);
			x1.rows[b].insertBefore(td, x1.rows[b].cells[x1.rows[b].cells.length]);
		}
		let len1 = document.querySelectorAll('.csvHeaderText').length;
		let rIndex;
		let a1;
		if(document.getElementsByClassName('tr_selected').length > 0) {
			for(let z = 3; z < len1 + 3; z++) {
				rIndex = document.querySelector(".tr_selected").rowIndex;
				a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = trSelectedColor;
			}
		}
		reassignBtnDeleteColumnIDs();
	};
	document.getElementById("newDivContainer").appendChild(table);
	var cells = document.getElementById('myTable2').getElementsByTagName('td');
	for(var i = 0; i < cells.length; i++) {
		let cell = cells[i];
		cell.addEventListener('click', function() {
			lastRowClickedIndex = this.parentNode.rowIndex;
		});
	}
	for(var i = 0; i < fin.fileData.length; i++) {
		tr = document.createElement('TR');
		tr.onmouseover = function(e) {
			if(this.className != "tr_selected") {
				let len1 = document.querySelectorAll('.csvHeaderText').length;
				let rIndex;
				let a1;
				this.style.backgroundColor = hoverColor;
				for(let z = 3; z < len1 + 3; z++) {
					rIndex = this.rowIndex;
					a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = hoverColor;
				}
			}
		};
		if(trEventStore_mouseover == null) {
			trEventStore_mouseover = tr.onmouseover;
		}
		tr.onmouseout = function() {
			let len1 = document.querySelectorAll('.csvHeaderText').length;
			let rIndex;
			let a1;
			if(this.className != "tr_selected") {
				this.style.backgroundColor = "#FFF";
				for(let z = 3; z < len1 + 3; z++) {
					rIndex = this.rowIndex;
					a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = "#FFF";
				}
			}
		};
		if(trEventStore_mouseout == null) {
			trEventStore_mouseout = tr.onmouseout;
		}
		tr.onclick = function() {
			let len1;
			let rIndex;
			let a1;
			if(document.getElementsByClassName('tr_selected').length > 0) {
				let len1 = document.querySelectorAll('.csvHeaderText').length;
				for(let z = 3; z < len1 + 3; z++) {
					try {
						rIndex = myTable2.querySelector('.tr_selected').rowIndex;
						a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = "#FFFFFF";
					} catch {}
				}
				document.getElementsByClassName("tr_selected")[0].style.backgroundColor = "#FFF";
				const tr_selected_list = document.getElementsByClassName('tr_selected');
				for(var i = 0; i < tr_selected_list.length; i++) {
					tr_selected_list[i].classList.remove('tr_selected');
				}
				this.style.backgroundColor = trSelectedColor;
				this.className = "tr_selected";
				for(let z = 3; z < len1 + 3; z++) {
					try {
						rIndex = myTable2.querySelector('.tr_selected').rowIndex;
						a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = trSelectedColor;
					} catch {}
				}
			} else {
				this.style.backgroundColor = trSelectedColor;
				this.className = "tr_selected";
				let len1 = document.querySelectorAll('.csvHeaderText').length;
				for(let z = 3; z < len1 + 3; z++) {
					try {
						rIndex = myTable2.querySelector('.tr_selected').rowIndex;
						a1 = document.getElementById('myTable2').rows[rIndex].cells[z].getElementsByTagName('input')[0].style.background = trSelectedColor;
					} catch {}
				}
			}
		};
		if(trEventStore_click == null) {
			trEventStore_click = tr.onclick;
		}
		tr.className = "editableRows";
		tr.style.backgroundColor = "#FFFFFF";
		tr.style.color = "#000000";
		tableBody.appendChild(tr);
		td = document.createElement('TD');
		td.className = 'td1';
		td.setAttribute('style', 'font-size: 16px;');
		td.appendChild(document.createTextNode(i));
		tr.appendChild(td);
		td = document.createElement('TD');
		td.className = 'td1';
		td.setAttribute('style', 'font-size: 16px; text-align: center');
		let insertInsertRowText = "Insert Row";
		let domInsertRowTextNode = document.createTextNode(insertInsertRowText);
		let btnInsertRow = document.createElement("BUTTON");
		btnInsertRow.setAttribute('style', 'font-size: 16px; font-weight: bold; background: #FFFFFF;');
		btnInsertRow.style.width = '100px';
		btnInsertRow.style.height = '40px';
		btnInsertRow.className = "btnInsertRow";
		btnInsertRow.id = `btnInsertRow_${i}`;
		btnInsertRow.appendChild(domInsertRowTextNode);
		btnInsertRow.onmouseover = function() {
			this.style.backgroundColor = "#C9F6FF";
		};
		btnInsertRow.onmouseout = function() {
			this.style.backgroundColor = "#FFFFFF";
		};
		btnInsertRow.onclick = function() {
			let csvTableHeaderLength = document.getElementById('myTable2').querySelectorAll('.csvHeaderText').length;
			let selectedRowID = parseInt(this.id.split('_')[1]);
			let theTable = document.getElementById('myTable2');
			let row;
			let cell;
			let text;
			let txtValues;
			row = theTable.insertRow(selectedRowID + 2);
			row.setAttribute('style', 'background: #FFF;');
			row.className = "editableRows";
			for(let a = 0; a < csvTableHeaderLength; a++) {
				cell = row.insertCell(a);
				cell.className = 'td1';
				cell.setAttribute('style', 'font-size: 16px; text-align: center;');
				txtValues = document.createElement("INPUT");
				txtValues.setAttribute("type", "text");
				txtValues.setAttribute("value", "");
				//txtValues.style.width  = '85%';
				//txtValues.style.height = '30px';
				cell.appendChild(txtValues);
			}
			cell = row.insertCell(0);
			cell.className = 'td1';
			cell.setAttribute('style', 'font-size: 16px; text-align: center');
			let insertDeleteText = "Delete Line";
			let domDeleteLineNode = document.createTextNode(insertDeleteText);
			let btnDeleteLine = document.createElement("BUTTON");
			btnDeleteLine.setAttribute('style', 'font-size: 16px; font-weight: bold; background: #FFFFFF;');
			btnDeleteLine.className = "btnDeleteLine";
			btnDeleteLine.id = `btnDeleteLineLine_${i}`;
			btnDeleteLine.style.width = '105px';
			btnDeleteLine.style.height = '40px';
			btnDeleteLine.appendChild(domDeleteLineNode);
			cell.appendChild(btnDeleteLine);
			btnDeleteLine.onmouseover = function() {
				this.style.backgroundColor = "#C9F6FF";
			};
			btnDeleteLine.onmouseout = function() {
				this.style.backgroundColor = "#FFFFFF";
			};
			cell = row.insertCell(0);
			cell.className = 'td1';
			cell.setAttribute('style', 'font-size: 16px; text-align: center;');
			let insertInsertRowText = "Insert Row";
			let domInsertRowTextNode = document.createTextNode(insertInsertRowText);
			let btnInsertRow = document.createElement("BUTTON");
			btnInsertRow.setAttribute('style', 'font-size: 16px; font-weight: bold; background: #FFFFFF;');
			btnInsertRow.style.width = '100px';
			btnInsertRow.style.height = '40px';
			btnInsertRow.className = "btnInsertRow";
			btnInsertRow.id = `btnInsertRow_${i}`;
			btnInsertRow.appendChild(domInsertRowTextNode);
			cell.appendChild(btnInsertRow);
			cell = row.insertCell(0);
			cell.className = 'td1';
			cell.setAttribute('style', 'font-size: 16px; color: #000000');
			txt = document.createTextNode("");
			cell.appendChild(txt);
			btnInsertRow.onmouseover = function() {
				this.style.backgroundColor = "#C9F6FF";
			};
			btnInsertRow.onmouseout = function() {
				this.style.backgroundColor = "#FFFFFF";
			};
			reassignEditRowValues();
		};
		td.appendChild(btnInsertRow);
		tr.appendChild(td);
		td = document.createElement('TD');
		td.className = 'td1';
		td.setAttribute('style', 'font-size: 16px; text-align: center');
		const insertDeleteText = "Delete Line";
		const domDeleteLineNode = document.createTextNode(insertDeleteText);
		const btnDeleteLine = document.createElement("BUTTON");
		btnDeleteLine.setAttribute('style', 'font-size: 16px; font-weight: bold; background: #FFFFFF;');
		btnDeleteLine.className = "btnDeleteLine";
		btnDeleteLine.id = `btnDeleteLineLine_${i}`;
		btnDeleteLine.style.width = '105px';
		btnDeleteLine.style.height = '40px';
		btnDeleteLine.onclick = function() {
			let selectedRowID = parseInt(this.id.split('_')[1]);
			if(confirm(`Are you sure that you want to delete row ${selectedRowID}?`)) {
				document.getElementById('myTable2').deleteRow(selectedRowID + 1);
				reassignEditRowValues();
				if(document.getElementById('myTable2').rows.length == 1) {
					let csvHeaderText = myTable2.querySelectorAll('.csvHeaderText');
					let buildCSVArray = [];
					let line1 = [];
					let line2 = [];
					let a1;
					for(let i = 0; i < csvHeaderText.length; i++) {
						a1 = myTable2.querySelectorAll('.csvHeaderText')[i].querySelector('INPUT').value;
						line1.push(a1);
						line2.push(" ");
					}
					buildCSVArray = [line1, line2];
					document.getElementById('content_container').removeChild(document.getElementById('newDivContainer'));
					buildEditableOutput(buildCSVArray);
				}
				assignNullEventHandlers();
			}
		};
		btnDeleteLine.onmouseover = function() {
			this.style.backgroundColor = "#C9F6FF";
		};
		btnDeleteLine.onmouseout = function() {
			this.style.backgroundColor = "#FFFFFF";
		};
		btnDeleteLine.appendChild(domDeleteLineNode);
		td.appendChild(btnDeleteLine);
		tr.appendChild(td);
		for(var j = 0; j < fin.fileData[i].length; j++) {
			td = document.createElement('TD');
			td.className = 'td1';
			td.setAttribute('style', 'font-size: 16px; text-align: center;');
			currentValue = fin.fileData[i][j];
			txtValues = document.createElement("INPUT");
			txtValues.setAttribute("type", "text");
			txtValues.setAttribute("value", currentValue);
			td.appendChild(txtValues);
			tr.appendChild(td);
		}
	}
	table.appendChild(tableBody);
	document.getElementById("newDivContainer").appendChild(table);
	table.style.marginLeft = "10px";
}

function insertLineBreaks(domElement, lineBreakCount) {
	for(let i = 0; i < lineBreakCount; i++) {
		domElement.appendChild(document.createElement('BR'));
	}
}

function createNewFile() {
	document.getElementById('content_container').innerHTML = "";
	const newDivContainer = document.createElement('DIV');
	newDivContainer.style.backgroundColor = "#FFFFFF";
	newDivContainer.style.color = "#000000";
	newDivContainer.setAttribute('id', 'newDivContainer');
	newDivContainer.style.width = "100%";
	newDivContainer.style.height = "90%";
	newDivContainer.style.marginLeft = "20px";
	newDivContainer.style.marginTop = "20px";
	document.getElementById('content_container').appendChild(newDivContainer);
	const newFileContentContainer = document.createElement("DIV");
	newDivContainer.appendChild(newFileContentContainer);
	let createNewFile = document.createTextNode("Create new file");
	let h1Element = document.createElement('h1');
	h1Element.appendChild(createNewFile);
	newFileContentContainer.append(h1Element);
	let chooseFileNameText = document.createTextNode("Choose a filename");
	let h3Element = document.createElement('h3');
	h3Element.appendChild(chooseFileNameText);
	newFileContentContainer.append(h3Element);
	newDivContainer.appendChild(newFileContentContainer);
	newFileContentContainer.style.width = 'auto';
	newFileContentContainer.style.height = 'auto';
	newFileContentContainer.setAttribute('id', 'newFileContentContainer');
	newFileContentContainer.style.marginLeft = '5%';
	newFileContentContainer.style.paddingTop = '3%';
	let newTextFileInput = document.createElement('INPUT');
	newTextFileInput.style.width = "200px";
	newTextFileInput.style.height = "30px";
	newTextFileInput.style.fontSize = "14px";
	newTextFileInput.setAttribute("id", 'newcsvFileName');
	newFileContentContainer.appendChild(newTextFileInput);
	let selectedColumnLength = document.createTextNode("Number of columns");
	h3Element = document.createElement('h3');
	h3Element.appendChild(selectedColumnLength);
	newFileContentContainer.append(h3Element);
	let newColumnLengthInput = document.createElement('INPUT');
	newColumnLengthInput.style.width = "50px";
	newColumnLengthInput.style.height = "30px";
	newColumnLengthInput.style.fontSize = "14px";
	newColumnLengthInput.setAttribute("id", 'newColumnLengthInput');
	newFileContentContainer.appendChild(newColumnLengthInput);
	insertLineBreaks(newFileContentContainer, 2);
	let btnCreateNewFile = document.createElement('BUTTON');
	let btnCreateNewFileText = document.createTextNode('Create File');
	btnCreateNewFile.appendChild(btnCreateNewFileText);
	btnCreateNewFile.className = 'navBtn1';
	newFileContentContainer.appendChild(btnCreateNewFile);
	insertLineBreaks(newFileContentContainer, 2);
	let spanContainer2 = document.createElement("span");
	text = document.createTextNode(``);
	spanContainer2.setAttribute("id", "saveNewFileStatus");
	spanContainer2.setAttribute('style', 'font-size: 16px; font-weight: bold; color: #000000; background: #FFFFFF;');
	spanContainer2.style.marginLeft = '5%';
	spanContainer2.appendChild(text);
	newDivContainer.appendChild(spanContainer2);
	btnCreateNewFile.onclick = () => {
		if(document.getElementById('newcsvFileName').value.length == 0) {
			alert("You did not enter a file name.");
			return;
		}
		let newcsvFileName = document.getElementById('newcsvFileName').value;
		let len1 = newcsvFileName.length - 1;
		let a1 = newcsvFileName.substring(len1 - 3);
		if(a1 != ".csv") {
			newcsvFileName += ".csv";
			document.getElementById('newcsvFileName').value = newcsvFileName;
		}
		let totalColumnLength = document.getElementById('newColumnLengthInput').value;
		if(isNaN(totalColumnLength) || (totalColumnLength.length == 0)) {
			alert("You did not enter a valid value for the column length.");
			return;
		}
		document.getElementById('saveNewFileStatus').innerHTML = "Creating new file, please wait..";
		let buildCSVArray = [];
		let line1 = [];
		let line2 = [];
		for(let i = 0; i < totalColumnLength; i++) {
			line1.push("col" + i);
			line2.push(" ");
		}
		buildCSVArray = [
			[line1],
			[line2]
		];
		focusedFileName = newcsvFileName;
		let csvFileData = [focusedFileName, buildCSVArray];
		let documentData = {
			command: 'saveCSVFile2',
			appHTML: appFileName,
			parameters: csvFileData
		};
		socket.emit('client_msg', documentData);
	}
}

function csvFileCreated() {
	isReadOnly = false;
	document.querySelector('#content_container').innerHTML = "Loading CSV File, please wait...";
	documentData = {
		command: 'loadCSVFile',
		appHTML: appFileName,
		parameters: focusedFileName
	};
	socket.emit('client_msg', documentData);
}

function loadFileWindow() {
	document.getElementById('content_container').innerHTML = "";
	let documentData = {
		command: 'listCSVFilesInFolder',
		appHTML: appFileName,
		parameters: ""
	};
	socket.emit('client_msg', documentData);
}

function csvFileListRetrieved(a) {
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

function buildReadOnlyOutput(csvData) {
	let readOnlyCSV = class {
		constructor(headerData, fileData) {
			this.headerData = headerData;
			this.fileData = fileData;
		}
	};
	const header = csvData.shift();
	const fin = new readOnlyCSV(header, csvData);
	const newDivContainer = document.createElement('DIV');
	newDivContainer.style.backgroundColor = "#FFFFFF";
	newDivContainer.setAttribute('id', 'newDivContainer');
	newDivContainer.style.width = "90%";
	newDivContainer.style.height = "90%";
	newDivContainer.style.overflowY = "scroll";
	let spanContainer;
	let text;
	spanContainer = document.createElement("span");
	text = document.createTextNode(`Read-only view of ${focusedFileName}`);
	let h1 = document.createElement('H1');
	h1.appendChild(text);
	spanContainer.appendChild(h1);
	spanContainer.style.color = "#111111";
	newDivContainer.appendChild(spanContainer);
	newDivContainer.style.marginLeft = "20px";
	newDivContainer.style.marginTop = "20px";
	document.getElementById('content_container').appendChild(newDivContainer);
	document.getElementById('content_container').style.overflowX = "scroll";
	const table = document.createElement('TABLE');
	let tr, th, td;
	table.width = 'auto';
	table.setAttribute("id", "myTable2");
	table.style.whiteSpace = "nowrap";
	var tableHeader = document.createElement('THEAD');
	table.appendChild(tableHeader);
	tr = document.createElement('TR');
	tr.style.backgroundColor = "#FFFFFF";
	tr.style.color = "#000000";
	let headerBackground = "#FFFFF0";
	let leftBorderColor = "#000080";
	table.style.backgroundColor = headerBackground;
	tableHeader.appendChild(tr);
	th = document.createElement('TH');
	//	th.width = '125';
	//th.height = '45';
	let rowNumberLabel = "Row #";
	th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
	th.appendChild(document.createTextNode(rowNumberLabel));
	tableHeader.appendChild(th);
	for(let i = 0; i < fin.headerData.length; i++) {
		th = document.createElement('TH');
		th.setAttribute('style', 'font-size: 16px; font-weight: bold; background: ' + headerBackground);
		th.appendChild(document.createTextNode(fin.headerData[i]));
		tableHeader.appendChild(th);
	}
	document.getElementById("newDivContainer").appendChild(table);
	var tableBody = document.createElement('TBODY');
	for(var i = 0; i < fin.fileData.length; i++) {
		tr = document.createElement('TR');
		tr.onmouseover = function() {
			this.style.backgroundColor = "#D4F1F4";
		};
		tr.onmouseout = function() {
			this.style.backgroundColor = "#FFF";
		};
		tr.style.backgroundColor = "#FFFFFF";
		tr.style.color = "#000000";
		tableBody.appendChild(tr);
		for(var j = 0; j < fin.fileData[i].length + 1; j++) {
			if(j == 0) {
				td = document.createElement('TD');
				td.className = 'td1';
				td.setAttribute('style', 'font-size: 16px;');
				td.appendChild(document.createTextNode(i));
				tr.appendChild(td);
			} else {
				td = document.createElement('TD');
				td.className = 'td1';
				td.setAttribute('style', 'font-size: 16px;');
				td.appendChild(document.createTextNode(fin.fileData[i][j - 1]));
				tr.appendChild(td);
			}
		}
	}
	table.appendChild(tableBody);
	document.getElementById("newDivContainer").appendChild(table);
	document.getElementById('myTable2').style.marginLeft = "10px";
}

function csvFileLoaded(a) {
	document.getElementById('content_container').innerHTML = "";
	if(isReadOnly) {
		buildReadOnlyOutput(a);
	} else {
		buildEditableOutput(a);
	}
}

function deleteCSVFileSuccess() {
	document.getElementById('myTable').deleteRow(lastRowClickedIndex);
	reassignFileMenuButtonIDs();
	focusedFileName = "";
	lastRowClickedIndex = -1;
}

function determineClickEventType() {
	setTimeout(() => {
		let theCSVFile = focusedFileName;
		let documentData;
		switch(clickEventType) {
			case 0:
				isReadOnly = true;
				document.querySelector('#content_container').innerHTML = "Loading CSV File, please wait...";
				documentData = {
					command: 'loadCSVFile',
					appHTML: appFileName,
					parameters: theCSVFile
				};
				socket.emit('client_msg', documentData);
				break;
			case 1:
				isReadOnly = false;
				documentData = {
					command: 'loadCSVFile',
					appHTML: appFileName,
					parameters: theCSVFile
				};
				socket.emit('client_msg', documentData);
				break;
			case 2:
				if(confirm(`Are you sure that you want to delete file ${focusedFileName}?`)) {
					documentData = {
						command: 'deleteCSVFile',
						appHTML: appFileName,
						parameters: focusedFileName
					};
					socket.emit('client_msg', documentData);
				}
				break;
			default:
				break;
		}
		clickEventType = -1;
	}, 1);
}

function reassignTableRowNumbers() {
	var tableRef = document.getElementById('myTable2').querySelectorAll('.editableRows');
	let counter = 1;
	for(var i = 1; i < document.getElementById('myTable2').rows.length; i++) {
		document.getElementById('myTable2').rows[counter].cells[0].innerHTML = counter - 1;
		counter += 1;
	}
	assignNullEventHandlers();
}

function assignNullEventHandlers() {
	const trSelectedColor = "#FFFF00";
	let tr = document.getElementById('myTable2').querySelectorAll('tr.editableRows');
	let btnInsertRow = document.getElementById('myTable2').querySelectorAll('.btnInsertRow');
	let btnDeleteLine = document.getElementById('myTable2').querySelectorAll('.btnDeleteLine');
	for(let i = 0; i < tr.length; i++) {
		tr[i].onmouseover = trEventStore_mouseover;
		tr[i].onmouseout = trEventStore_mouseout;
		tr[i].onclick = trEventStore_click;
	}
	for(let m = 0; m < btnInsertRow.length; m++) {
		if(btnInsertRow[m].onclick == null) {
			for(var n = 0; n < btnInsertRow.length; n++) {
				if(btnInsertRow[n].onmouseover != null) {
					btnDeleteLine[m].onclick = btnDeleteLine[n].onclick;
					btnInsertRow[m].onclick = btnInsertRow[n].onclick;
					break;
				}
			}
		}
	}
}

function reassignBtnDeleteColumnIDs() {
	let allDeleteColumnButtons = document.querySelectorAll('.deleteColumn').length;
	let counter = 0;
	for(let j = 0; j < document.querySelectorAll('.deleteColumn').length; j++) {
		document.querySelectorAll('.deleteColumn')[j].id = "deleteColumnBtn_" + counter;
		counter += 1;
	}
}

function reassignEditRowValues() {
	let allInsertRowButtons = document.querySelectorAll(".btnInsertRow");
	let allDeleteButtons = document.querySelectorAll(".btnDeleteLine");
	let counter = 0;
	for(var j = 0; j < allInsertRowButtons.length; j++) {
		allInsertRowButtons[j].id = "btnInsertRow_" + j;
	}
	for(var k = 0; k < allInsertRowButtons.length; k++) {
		allDeleteButtons[k].id = "btnDeleteLine_" + k;
	}
	reassignTableRowNumbers();
}

function reassignFileMenuButtonIDs() {
	let allEditButtons = document.querySelectorAll(".classEditFileButtons");
	let allDeleteButtons = document.querySelectorAll(".classDeleteFileButtons");
	let allReadOnlyButtons = document.querySelectorAll(".classReadOnlyButtons");
	let allButtonLength = allEditButtons.length;
	for(let j = 0; j < allButtonLength; j++) {
		allEditButtons[j].id = "btnEditFile_" + j;
		allDeleteButtons[j].id = "btnDeleteFile_" + j;
		allReadOnlyButtons[j].id = "btnReadOnly_" + j;
	}
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
			cell.addEventListener('dblclick', function() {
				if(clickEventType <= 0) {
					clickEventType = 0;
					determineClickEventType();
				}
			});
			cell.addEventListener('click', function(e) {
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
				lastRowClickedIndex = rowId;
				let a = lastRowClickedIndex - 1;
				if(lastRowClickedIndex > -1) {
					let btnEditFileModifyBackground;
					let btnReadOnlyBackground;
					for(var b = 0; b < rLength - 1; b++) {
						btnEditFileModifyBackground = "btnEditFile_" + b;
						btnReadOnlyBackground = "btnReadOnly_" + b;
						if(b == a) {
							if(e.target != undefined) {
								document.getElementById(btnEditFileModifyBackground).style.backgroundColor = "#DEDEDE";
								document.getElementById(btnReadOnlyBackground).style.backgroundColor = "#DEDEDE";
							}
						} else {
							if(e.target != undefined) {
								document.getElementById(btnEditFileModifyBackground).style.backgroundColor = "#FFFFFF";
								document.getElementById(btnReadOnlyBackground).style.backgroundColor = "#FFFFFF";
							}
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
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnReadOnly_' + i;
		document.getElementById(btnElementID).onmouseover = function() {
			this.style.backgroundColor = btnHoverColor;
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnReadOnly_' + i;
		document.getElementById(btnElementID).onmouseout = function() {
			this.style.backgroundColor = btnBackgroundColor;
		}
	}
	for(var i = 0; i < rLength - 1; i++) {
		btnElementID = 'btnReadOnly_' + i;
		document.getElementById(btnElementID).onclick = function() {
			clickEventType = 0;
			determineClickEventType();
		}
	}
}

function buildTable(headerArray, fileArray) {
	var newDivContainer = document.createElement('DIV');
	newDivContainer.style.width = "25px";
	newDivContainer.style.height = "25px";
	newDivContainer.style.backgroundColor = "#FFFFFF";
	newDivContainer.style.color = "#000000";
	newDivContainer.setAttribute('id', 'newDivContainer');
	document.getElementById('content_container').appendChild(newDivContainer);
	newDivContainer.style.width = "100%";
	newDivContainer.style.height = "90%";
	newDivContainer.style.marginLeft = "0%";
	newDivContainer.style.marginTop = "1%";
	newDivContainer.style.paddingLeft = "10px";
	newDivContainer.style.overflowY = "scroll";
	newDivContainer.appendChild(document.createElement('br'));
	var txtNode1 = document.createTextNode("Choose a file to open:");
	var h2Node = document.createElement('h2');
	h2Node.appendChild(txtNode1);
	newDivContainer.appendChild(h2Node);
	var table = document.createElement('TABLE');
	var tr, td;
	table.border = '0';
	table.width = '90%';
	table.setAttribute("id", "myTable");
	var tableBody = document.createElement('TBODY');
	table.appendChild(tableBody);
	table.style.whiteSpace = "nowrap";
	tr = document.createElement('TR');
	tableBody.appendChild(tr);
	var headerBackground = "#DEDEDE";
	for(var h = 0; h < headerArray.length; h++) {
		td = document.createElement('TD');
		td.width = '105';
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
	td = document.createElement('TD');
	td.width = '100';
	td.setAttribute('style', 'font-size: 22px; font-weight: bold; background: ' + headerBackground);
	td.appendChild(document.createTextNode(""));
	tr.appendChild(td);
	for(var i = 0; i < fileArray.length; i++) {
		tr = document.createElement('TR');
		tableBody.appendChild(tr);
		var btnBackgroundColor = "#FFFFFF";
		var btnBorderColor = "#D4D4D4";
		for(var j = 0; j < headerArray.length + 3; j++) {
			td = document.createElement('TD');
			td.width = '105';
			td.height = '45';
			td.setAttribute('style', 'font-size: 16px;');
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
			} else if(j == 6) {
				var btnReadOnly = document.createElement("BUTTON");
				var btnReadOnlyText = document.createTextNode("Open as Read-Only");
				var btnReadOnlyID = "btnReadOnly_" + i;
				boldtext2 = document.createElement('strong');
				boldtext2.appendChild(btnReadOnlyText);
				btnReadOnly.appendChild(boldtext2);
				btnReadOnly.style.width = "auto";
				btnReadOnly.style.height = "50px";
				btnReadOnly.style.border = "1px solid " + btnBorderColor;
				btnReadOnly.style.backgroundColor = btnBackgroundColor;
				btnReadOnly.style.color = "#000";
				btnReadOnly.id = btnReadOnlyID;
				btnReadOnly.className = "classReadOnlyButtons";
				td.appendChild(btnReadOnly);
			} else {
				td.appendChild(document.createTextNode(""));
			}
			tr.appendChild(td);
		}
	}
	newDivContainer.appendChild(table);
}