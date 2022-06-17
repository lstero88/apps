
let c;
let chart;
chartType = "barchart";

let appFileName = "app6.html";
let autoScaleX = '1';
let autoScaleY = '1';
let autoGridSpace = '40';
let dataTableID = 'dataTable1';
let footerVisible = true;

function formatJSONDate(date) {
	let year = date.getFullYear();
	let month = (1 + date.getMonth()).toString();
	month = month.length > 1 ? month : '0' + month;
	let day = date.getDate().toString();
	day = day.length > 1 ? day : '0' + day;
	return month + '/' + day + '/' + year;
}

function getCandleStickCSVFile(fileName) {
	let documentData = {
		command: 'getCandleStickCSVFile',
		appHTML: appFileName,
		parameters: fileName
	};
	socket.emit('client_msg', documentData);
}

function getCandlestickCSVFileList() {
	let documentData = {
		command: 'getCandlestickCSVFileList',
		appHTML: appFileName,
	};
	socket.emit('client_msg', documentData);
}

function getGraphFiles() {
	let documentData = {
		command: 'getAllGraphFiles',
		appHTML: appFileName,
	};
	socket.emit('client_msg', documentData);
}

function determineFileListIndex2(buttonObject) {
	let buttons = document.getElementsByClassName("btn4");
	let a = -1;
	for(let i = 0; i < buttons.length; i++) {
		if(buttonObject == buttons[i]) {
			a = i;
		}
	}
	if(a != -1) {
		let colLength = 2;
		let b1 = document.querySelectorAll('.fileLoadtable2 tr td')[a * colLength].innerHTML;
		getCandleStickCSVFile(b1);
		closePopup();
	} else {}
}

function determineFileListIndex(buttonObject) {
	let buttons = document.getElementsByClassName("btn4");
	let a = -1;
	for(let i = 0; i < buttons.length; i++) {
		if(buttonObject == buttons[i]) {
			a = i;
		}
	}
	if(a != -1) {
		let colLength = 4;
		let b1 = document.querySelectorAll('.fileLoadtable tr td')[a * colLength].innerHTML;
		openFile(b1);
		closePopup();
	} else {}
}

function newFile(fileType) {
	chartType = fileType;
	document.getElementById('column3').innerHTML = buildColumn3Data();
	closePopup();
	clearScreen();
	buildSampleChart();
	centerOriginToScreen();
	document.getElementById('title1').innerHTML = '[Untitled]';
}

function newFileWindow() {
	document.getElementById("popup_container").style.display = "block";
	document.getElementById('popup_content').innerHTML = "";
	var popup_content = document.getElementById('popup_content');
	var h2Text = document.createElement('h2');
	var headerTextNode = document.createTextNode("Choose a graph type");
	h2Text.appendChild(headerTextNode);
	popup_content.appendChild(h2Text);
	var br;
	var boldtext = document.createElement('strong');
	document.getElementById("popup_content").style.margin = "0px 10px 20px 30px";
	document.getElementById("popup_content").style.font = "bold 20px arial,serif";
	document.getElementById("popup_content").style.height = "350px";
	document.getElementById("popup").style.height = "70%";
	document.getElementById("popup").style.margin = "15vh auto auto auto";
	var elemDiv = document.createElement('div');
	elemDiv.setAttribute("id", "div1");
	popup_content.appendChild(elemDiv);
	let buildHTML = `
 
				
				
			<div class="imageContainer1">
				<a href="#" onClick="newFile('barchart')">
					<div class="imageDiv1">
						 
							<img src="images/barchart.png" />
							<p style="text-align: center">Bar Chart</p>
						 
					</div>
				</a>
					<a href="#" onClick="newFile('linechart')">
						<div class="imageDiv1">
						 
									<img class="middle-img" src="images/linechart.png"/>
									<p style="text-align: center">Line Chart</p>
						 
						</div>
					</a>
					<a href="#" onClick="newFile('candlestick_chart')">
						<div class="imageDiv1">
				 
								<img class="middle-img" src="images/candlestickchart.png"/>
								<p style="text-align: center">Candlestick Chart</p>
						 
						</div>	
				</a>
				
			</div>	
	
		`;
	document.getElementById('div1').innerHTML = buildHTML;
}

function openCSVFileMenu(fileList) {
	document.getElementById("popup_container").style.display = "block";
	document.getElementById('popup_content').innerHTML = "";
	var popup_content = document.getElementById('popup_content');
	var h2Text = document.createElement('h2');
	var headerTextNode = document.createTextNode("Choose a CSV file to open");
	h2Text.appendChild(headerTextNode);
	popup_content.appendChild(h2Text);
	var br;
	var boldtext = document.createElement('strong');
	document.getElementById("popup_content").style.margin = "0px 10px 20px 30px";
	document.getElementById("popup_content").style.font = "bold 20px arial,serif";
	document.getElementById("popup_content").style.height = "250px";
	var elemDiv = document.createElement('div');
	elemDiv.setAttribute("id", "div1");
	popup_content.appendChild(elemDiv);
	let buildHTML = `
				<table class="fileLoadtable2">
					<thead>
						<tr>
							<th>File Name</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
		`;
	fileList.forEach((element) => {
		buildHTML += `<tr><td>${element}</td><td><button class="btn4" style='margin-left: 25px; width: 130px;' onClick='determineFileListIndex2(this)'>Open</button></tr>`
	});
	buildHTML += `
			</tbody>
		</table>	
		`;
	document.getElementById('div1').innerHTML = buildHTML;
}

function openFileMenu(fileList) {
	document.getElementById("popup_container").style.display = "block";
	document.getElementById('popup_content').innerHTML = "";
	var popup_content = document.getElementById('popup_content');
	var h2Text = document.createElement('h2');
	var headerTextNode = document.createTextNode("Choose a file to open");
	h2Text.appendChild(headerTextNode);
	popup_content.appendChild(h2Text);
	var br;
	var boldtext = document.createElement('strong');
	document.getElementById("popup_content").style.margin = "0px 10px 20px 30px";
	document.getElementById("popup_content").style.font = "bold 20px arial,serif";
	document.getElementById("popup_content").style.height = "250px";
	var elemDiv = document.createElement('div');
	elemDiv.setAttribute("id", "div1");
	popup_content.appendChild(elemDiv);
	let buildHTML = `
				<table class="fileLoadtable">
					<thead>
						<tr>
							<th>File Name</th>
							<th>Graph Type</th>
							<th>Last Modified</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
		`;
	fileList.forEach((element) => {
		buildHTML += `<tr><td>${element[0]}</td><td>${element[1]}</td><td>${element[2]}</td><td><button class="btn4" onClick='determineFileListIndex(this)'>Open</button></tr>`
	});
	buildHTML += `
			</tbody>
		</table>	
		`;
	document.getElementById('div1').innerHTML = buildHTML;
}

function closePopup() {
	document.getElementById("popup_container").style.display = "none";
}

function openFile(fileName) {
	let documentData = {
		command: 'loadGraphFile',
		appHTML: appFileName,
		graphTitle: fileName,
	};
	socket.emit('client_msg', documentData);
}

function saveFile(fileName) {
	let getTitle = document.getElementById('title1').innerHTML;
	let documentData;
	let scaleX, scaleY, gridSpace;
	let xAxisVisibility, yAxisVisibility, gridLinesVisibility, numericLabelingVisibility;
	if(chartType == 'barchart' || chartType == 'linechart') {
		getTitle = getTitle.replace('<b>', '').replace('</b>', '');
		getTitle = getTitle.replace(' ', '');
		if(txtTitle.value != getTitle) {
			getTitle = txtTitle.value;
			document.getElementById('title1').innerHTML = "<b>" + getTitle + "</b>";
		}
		if(getTitle != '[Untitled]') {
			let xValues = document.querySelectorAll('.txtX');
			let yValues = document.querySelectorAll('.txtY');
			let hexColors = document.querySelectorAll('.txtColor');
			let allXValues;
			let buildXAxisData = [];
			let allYValues;
			let buildYAxisData = [];
			let allHexValues;
			let buildHexColors = [];
			allXValues = document.querySelectorAll('.txtX');
			Array.from(allXValues).map((x) => {
				buildXAxisData.push(x.value);
			});
			allYValues = document.querySelectorAll('.txtY');
			Array.from(allYValues).map((y) => {
				buildYAxisData.push(y.value);
			});
			allHexValues = document.querySelectorAll('.txtColor');
			Array.from(allHexValues).map((hexVal) => {
				buildHexColors.push(hexVal.value);
			});
			scaleX = document.getElementById('scaleX').value;
			scaleY = document.getElementById('scaleY').value;
			gridSpace = document.getElementById('gridSpace').value;
			xAxisVisibility = document.getElementById('xAxisVisibility').checked;
			yAxisVisibility = document.getElementById('yAxisVisibility').checked;
			gridLinesVisibility = document.getElementById('gridLinesVisible').checked;
			numericLabelingVisibility = document.getElementById('numericLabelingVisible').checked;
			documentData = {
				command: 'saveGraphFile',
				appHTML: appFileName,
				graphTitle: getTitle,
				parameters: [chartType, buildXAxisData, buildYAxisData, buildHexColors],
				settings: {
					'scaleX': scaleX,
					'scaleY': scaleY,
					'gridSpace': gridSpace
				},
				settings2: {
					'xAxisVisible': xAxisVisibility,
					'yAxisVisible': yAxisVisibility,
					'gridLinesVisible': gridLinesVisibility,
					'numericLabelingVisibility': numericLabelingVisibility
				},
				date_last_modified: formatJSONDate(new Date()),
				'fileName': getTitle
			};
			socket.emit('client_msg', documentData);
		}
	} else if(chartType == 'candlestick_chart') {
		getTitle = getTitle.replace('<b>', '').replace('</b>', '');
		getTitle = getTitle.replace(' ', '');
		getTitle = getTitle.replace('.csv', '');
		if(txtTitle.value != getTitle) {
			getTitle = txtTitle.value;
			document.getElementById('title1').innerHTML = "<b>" + getTitle + "</b>";
		}
		if(getTitle !== '[Untitled]') {
			let candlestick_dates = document.querySelectorAll('.candlestick_date');
			let candlestick_opens = document.querySelectorAll('.candlestick_open');
			let candlestick_highs = document.querySelectorAll('.candlestick_high');
			let candlestick_lows = document.querySelectorAll('.candlestick_low');
			let candlestick_closes = document.querySelectorAll('.candlestick_close');
			let candlestick_dates_array = [];
			let candlestick_opens_array = [];
			let candlestick_highs_array = [];
			let candlestick_lows_array = [];
			let candlestick_closes_array = [];
			Array.from(candlestick_dates).map((x) => {
				candlestick_dates_array.push(x.value);
			});
			Array.from(candlestick_opens).map((x) => {
				candlestick_opens_array.push(x.value);
			});
			Array.from(candlestick_highs).map((x) => {
				candlestick_highs_array.push(x.value);
			});
			Array.from(candlestick_lows).map((x) => {
				candlestick_lows_array.push(x.value);
			});
			Array.from(candlestick_closes).map((x) => {
				candlestick_closes_array.push(x.value);
			});
			scaleX = document.getElementById('scaleX').value;
			scaleY = document.getElementById('scaleY').value;
			gridSpace = document.getElementById('gridSpace').value;
			xAxisVisibility = document.getElementById('xAxisVisibility').checked;
			yAxisVisibility = document.getElementById('yAxisVisibility').checked;
			gridLinesVisibility = document.getElementById('gridLinesVisible').checked;
			numericLabelingVisibility = document.getElementById('numericLabelingVisible').checked;
			documentData = {
				command: 'saveGraphFile2',
				appHTML: appFileName,
				graphTitle: getTitle,
				parameters: [chartType, candlestick_dates_array, candlestick_opens_array, candlestick_highs_array, candlestick_lows_array, candlestick_closes_array],
				settings: {
					'scaleX': scaleX,
					'scaleY': scaleY,
					'gridSpace': gridSpace
				},
				settings2: {
					'xAxisVisible': xAxisVisibility,
					'yAxisVisible': yAxisVisibility,
					'gridLinesVisible': gridLinesVisibility,
					'numericLabelingVisibility': numericLabelingVisibility
				},
				date_last_modified: formatJSONDate(new Date()),
				'fileName': getTitle
			};
			socket.emit('client_msg', documentData);
		}
	}
}
class canvasClass {
	constructor(querySelector, width, height, gridlineColor, gridSpace, numericLabelingVisible, scaleX, scaleY, xPlotMarkersVisible, yPlotMarkersVisible, xAxisVisible, yAxisVisible, updateSettings) {
		this.canvasWidth = width;
		this.canvasHeight = height;
		this.originX = this.canvasWidth / 2;
		this.originY = this.canvasHeight / 2;
		let canvas = document.createElement("canvas");
		canvas.id = "myCanvas";
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;
		this.updateSettings = updateSettings;
		canvas.style.border = "solid 0px #000000";
		this.ctx = canvas.getContext('2d');
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ctx.translate(0.5, 0.5);
		document.querySelector(querySelector).appendChild(canvas);
		this.h1 = 0;
		this.v1 = 0;
		this.h2 = 0;
		this.v2 = 0;
		this.startXAxis_X = 0;
		this.startXAxis_Y = this.originY;
		this.endXAxis_X = this.canvasWidth;
		this.endXAxis_Y = this.originY;
		this.startYAxis_X = this.originX;
		this.startYAxis_Y = 0;
		this.endYAxis_X = this.originX;
		this.endYAxis_Y = this.canvasHeight;
		this.gridSpace = gridSpace;
		this.gridlineColor = gridlineColor;
		this.numericLabelingVisible = numericLabelingVisible;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.xPlotMarkersVisible = xPlotMarkersVisible;
		this.yPlotMarkersVisible = yPlotMarkersVisible;
		this.xAxisVisible = xAxisVisible;
		this.yAxisVisible = yAxisVisible;
		this.domain = null;
		this.range = null;
		this.canvasMouseMoveEventEnabled = true;
		this.eventPageX;
		this.eventPageY;
		this.drag = false;
		this.dragStart = 0;
		this.dragEnd = 0;
		this.maxMouseDragLimit = ["N/A", "N/A", "N/A", "N/A"]; // top, right, down, left
		this.trueMouseX;
		this.trueMouseY;
		this.mouseX;
		this.mouseY;
		canvas.addEventListener("mousemove", this);
		canvas.addEventListener("mouseout", this);
		canvas.addEventListener("mousedown", this);
		canvas.addEventListener("mouseup", this);
		this.canvas = canvas;
	}
	drawDisplayElements() {
		if(this.yAxisVisible == 1) {
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = "gray";
			this.ctx.beginPath();
			this.ctx.moveTo(this.startYAxis_X, this.startYAxis_Y);
			this.ctx.lineTo(this.endYAxis_X, this.endYAxis_Y);
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = this.gridLineColor;
		}
		if(this.yPlotMarkersVisible == 1) {
			this.ctx.strokeStyle = this.gridlineColor;
			for(i = (this.originX); i >= 0; i -= this.gridSpace) {
				if(i != (this.originX)) {
					this.ctx.beginPath();
					this.ctx.moveTo(i, 0);
					this.ctx.lineTo(i, this.canvasHeight);
					this.ctx.stroke();
				}
			}
			for(var i = (this.originX); i <= this.canvasWidth; i += this.gridSpace) {
				if(i != (this.originX)) {
					this.ctx.strokeStyle = this.gridLineColor;
					this.ctx.beginPath();
					this.ctx.moveTo(i, 0);
					this.ctx.lineTo(i, this.canvasHeight);
					this.ctx.stroke();
				}
			}
		}
		if(this.xPlotMarkersVisible == 1) {
			this.ctx.strokeStyle = this.gridlineColor;
			for(let j = this.originY; j >= 0; j -= this.gridSpace) {
				if(j != (this.originY)) {
					this.ctx.beginPath();
					this.ctx.moveTo(this.canvasWidth, j);
					this.ctx.lineTo(0, j);
					this.ctx.stroke();
				}
			}
			for(let j = this.originY; j <= this.canvasHeight; j += this.gridSpace) {
				if(j != (this.originY / 2)) {
					this.ctx.strokeStyle = this.gridLineColor;
					this.ctx.beginPath();
					this.ctx.moveTo(this.canvasWidth, j);
					this.ctx.lineTo(0, j);
					this.ctx.stroke();
				}
			}
		}
		if(this.xAxisVisible == 1) {
			this.ctx.lineWidth = 2;
			this.ctx.strokeStyle = "gray";
			this.ctx.beginPath();
			this.ctx.moveTo(this.startXAxis_X, this.startXAxis_Y);
			this.ctx.lineTo(this.endXAxis_X, this.endXAxis_Y);
			this.ctx.stroke();
			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = this.gridLineColor;
		}
	}
	countDecimals(value) {
		if(Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	}
	formatNumericDisplayXScale(theValue) {
		var count = this.countDecimals(theValue);
		if(count > 0) {
			return theValue.toFixed(1);
		}
		return theValue;
	}
	registerMouseTrackingLabels(trueMouseX, trueMouseY, mouseX, mouseY) {
		this.trueMouseX = trueMouseX;
		this.trueMouseY = trueMouseY;
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
	determineMouseXPosition(trueMouseXPosition) {
		var a = (trueMouseXPosition - (this.originX)) / ((this.gridSpace) / this.scaleX);
		return a;
	}
	determineMouseYPosition(trueMouseYPosition) {
		if(trueMouseYPosition < this.canvasHeight / 2) {
			if(this.originY < trueMouseYPosition) {
				return -(Math.abs(trueMouseYPosition - (this.originY)) / (this.gridSpace / this.scaleY));
			} else {
				return(Math.abs(trueMouseYPosition - (this.originY)) / (this.gridSpace / this.scaleY));
			}
		} else {
			return -((trueMouseYPosition - (this.originY)) / (this.gridSpace / this.scaleY));
		}
	}
	formatNumericDisplayYScale(theValue) {
		var count = this.countDecimals(theValue);
		if(count > 0) {
			return theValue.toFixed(1);
		}
		return theValue;
	}
	calculateDomain() {
		let lower = (0 - (this.originX)) / ((this.gridSpace) / this.scaleX);
		let upper = (this.canvasWidth - (this.originX)) / ((this.gridSpace) / this.scaleX);
		return [lower, upper];
	}
	calculateRange() {
		let lower = (Math.abs(this.canvasHeight - (this.originY)) / (this.gridSpace / this.scaleY));
		let upper = -((0 - (this.originY)) / (this.gridSpace / this.scaleY));
		if(this.originY >= this.canvasHeight) {
			return [lower, upper];
		} else {
			return [-lower, upper];
		}
	}
	drawNumericLabelY(theNumber, pointX, pointY) {
		let count = this.countDecimals(theNumber);
		if(this.numericLabelingVisible == 1) {
			let x = this.originX + (pointX * (this.gridSpace / this.scaleX));
			let y = this.originY + -(pointY * (this.gridSpace / this.scaleY));
			if(pointX != 0) {
				x -= 5;
				y += 10;
			} else {
				x -= 5;
				y += 5;
			}
			this.ctx.fillStyle = '#555555';
			this.ctx.font = ' 12px arial';
			this.ctx.textAlign = "right";
			this.ctx.fillText(theNumber, x, y);
		}
	}
	drawNumericLabelX(theNumber, pointX, pointY) {
		let count = this.countDecimals(theNumber);
		if(this.numericLabelingVisible == 1) {
			let x = this.originX + (pointX * (this.gridSpace / this.scaleX));
			let y = this.originY + -(pointY * (this.gridSpace / this.scaleY));
			if(pointX != 0) {
				y += 15;
			} else {
				y += 5;
			}
			this.ctx.fillStyle = '#555555';
			this.ctx.font = ' 12px arial';
			this.ctx.textAlign = "center";
			this.ctx.fillText(theNumber, x, y);
		}
	}
	drawNumbers() {
		// Draw Horizontal numbers
		for(let a = this.scaleX; a < this.calculateDomain()[1] + this.scaleX; a += this.scaleX) {
			this.drawNumericLabelX(this.formatNumericDisplayXScale(a), this.formatNumericDisplayXScale(a), 0);
		}
		for(var a = -this.scaleX; a >= this.calculateDomain()[0] - this.scaleX; a -= this.scaleX) {
			this.drawNumericLabelX(this.formatNumericDisplayXScale(a), this.formatNumericDisplayXScale(a), 0);
		}
		// Draw vertical numbers
		for(var a = this.scaleY; a < this.calculateRange()[1] + this.scaleY; a += this.scaleY) {
			this.drawNumericLabelY(this.formatNumericDisplayYScale(a), 0, this.formatNumericDisplayYScale(a));
		}
		// Draw vertical numbers
		for(var a = -this.scaleY; a > this.calculateRange()[0] - this.scaleY; a -= this.scaleY) {
			this.drawNumericLabelY(this.formatNumericDisplayYScale(a), 0, this.formatNumericDisplayYScale(a));
		}
	}
	shiftGraphOnMouseDrag(cmd, resultX, resultY) {
		if(cmd == "right-upper") {
			if((this.maxMouseDragLimit[3]) != "N/A") {
				if(this.calculateDomain()[0] >= this.maxMouseDragLimit[3]) {
					this.h1 = this.gridSpace;
					this.h2 -= this.scaleX;
					this.originX += resultX;
					this.startYAxis_X = this.originX;
					this.startYAxis_Y = 0;
					this.endYAxis_X = this.originX;
					this.endYAxis_Y = this.canvasHeight;
					this.domain += this.scaleX;
				}
			} else {
				this.h1 = this.gridSpace;
				this.h2 -= this.scaleX;
				this.originX += resultX;
				this.startYAxis_X = this.originX;
				this.startYAxis_Y = 0;
				this.endYAxis_X = this.originX;
				this.endYAxis_Y = this.canvasHeight;
				this.domain += this.scaleX;
			}
			if((this.maxMouseDragLimit[2]) != "N/A") {
				if(this.calculateRange()[0] >= this.maxMouseDragLimit[2]) {
					this.v1 = this.gridSpace;
					this.v2 -= this.scaleY;
					this.originY -= resultY;
					this.startXAxis_X = 0;
					this.startXAxis_Y = this.originY;
					this.endXAxis_X = this.canvasWidth;
					this.endXAxis_Y = this.originY;
					this.range += this.scaleY;
				}
			} else {
				this.v1 = this.gridSpace;
				this.v2 -= this.scaleY;
				this.originY -= resultY;
				this.startXAxis_X = 0;
				this.startXAxis_Y = this.originY;
				this.endXAxis_X = this.canvasWidth;
				this.endXAxis_Y = this.originY;
				this.range += this.scaleY;
			}
		} else if(cmd == "right-lower") {
			if((this.maxMouseDragLimit[3]) != "N/A") {
				if(this.calculateDomain()[0] >= this.maxMouseDragLimit[3]) {
					this.h1 = this.gridSpace;
					this.h2 -= this.scaleX;
					this.originX += resultX;
					this.startYAxis_X = this.originX;
					this.startYAxis_Y = 0;
					this.endYAxis_X = this.originX;
					this.endYAxis_Y = this.canvasHeight;
					this.domain += this.scaleX;
				}
			} else {
				this.h1 = this.gridSpace;
				this.h2 -= this.scaleX;
				this.originX += resultX;
				this.startYAxis_X = this.originX;
				this.startYAxis_Y = 0;
				this.endYAxis_X = this.originX;
				this.endYAxis_Y = this.canvasHeight;
				this.domain += this.scaleX;
			}
			if((this.maxMouseDragLimit[0]) != "N/A") {
				if(this.calculateRange()[1] <= this.maxMouseDragLimit[0]) {
					this.v1 = this.gridSpace;
					this.v2 += this.scaleY;
					this.originY += resultY;
					this.startXAxis_X = 0;
					this.startXAxis_Y = this.originY;
					this.endXAxis_X = this.canvasWidth;
					this.endXAxis_Y = this.originY;
					this.range += this.scaleY;
				}
			} else {
				this.v1 = this.gridSpace;
				this.v2 += this.scaleY;
				this.originY += resultY;
				this.startXAxis_X = 0;
				this.startXAxis_Y = this.originY;
				this.endXAxis_X = this.canvasWidth;
				this.endXAxis_Y = this.originY;
				this.range += this.scaleY;
			}
		} else if(cmd == "left-upper") {
			if((this.maxMouseDragLimit[1]) != "N/A") {
				if(this.calculateDomain()[1] <= this.maxMouseDragLimit[1]) {
					this.h1 = -this.gridSpace;
					this.h2 += this.scaleX;
					this.originX += resultX;
					this.startYAxis_X = this.originX;
					this.startYAxis_Y = 0;
					this.endYAxis_X = this.originX;
					this.endYAxis_Y = this.canvasHeight;
					this.domain += this.scaleX;
				}
			} else {
				this.h1 = -this.gridSpace;
				this.h2 += this.scaleX;
				this.originX += resultX;
				this.startYAxis_X = this.originX;
				this.startYAxis_Y = 0;
				this.endYAxis_X = this.originX;
				this.endYAxis_Y = this.canvasHeight;
				this.domain += this.scaleX;
			}
			if((this.maxMouseDragLimit[2]) != "N/A") {
				if(this.calculateRange()[0] >= this.maxMouseDragLimit[2]) {
					this.v1 = this.gridSpace;
					this.v2 -= this.scaleY;
					this.originY -= resultY;
					this.startXAxis_X = 0;
					this.startXAxis_Y = this.originY;
					this.endXAxis_X = this.canvasWidth;
					this.endXAxis_Y = this.originY;
					this.range += this.scaleY;
				}
			} else {
				this.v1 = this.gridSpace;
				this.v2 -= this.scaleY;
				this.originY -= resultY;
				this.startXAxis_X = 0;
				this.startXAxis_Y = this.originY;
				this.endXAxis_X = this.canvasWidth;
				this.endXAxis_Y = this.originY;
				this.range += this.scaleY;
			}
		} else if(cmd == "left-lower") {
			if((this.maxMouseDragLimit[1]) != "N/A") {
				if(this.calculateDomain()[1] <= this.maxMouseDragLimit[1]) {
					this.h1 = -this.gridSpace;
					this.h2 += this.scaleX;
					this.originX += resultX;
					this.startYAxis_X = this.originX;
					this.startYAxis_Y = 0;
					this.endYAxis_X = this.originX;
					this.endYAxis_Y = this.canvasHeight;
					this.domain += this.scaleX;
				}
			} else {
				this.h1 = -this.gridSpace;
				this.h2 += this.scaleX;
				this.originX += resultX;
				this.startYAxis_X = this.originX;
				this.startYAxis_Y = 0;
				this.endYAxis_X = this.originX;
				this.endYAxis_Y = this.canvasHeight;
				this.domain += this.scaleX;
			}
			if((this.maxMouseDragLimit[0]) != "N/A") {
				if(this.calculateRange()[1] <= this.maxMouseDragLimit[0]) {
					this.v1 = this.gridSpace;
					this.v2 += this.scaleY;
					this.originY += resultY;
					this.startXAxis_X = 0;
					this.startXAxis_Y = this.originY;
					this.endXAxis_X = this.canvasWidth;
					this.endXAxis_Y = this.originY;
					this.range += this.scaleY;
				}
			} else {
				this.v1 = this.gridSpace;
				this.v2 += this.scaleY;
				this.originY += resultY;
				this.startXAxis_X = 0;
				this.startXAxis_Y = this.originY;
				this.endXAxis_X = this.canvasWidth;
				this.endXAxis_Y = this.originY;
				this.range += this.scaleY;
			}
		}
		this.updateSettings();
	}
	handleEvent(event) {
		switch(event.type) {
			case "mouseup":
				this.drag = false;
				break;
			case "mouseout":
				this.drag = false;
				if(document.getElementById('trueMouseX') != null && document.getElementById('trueMouseY') != null && document.getElementById('mouseX') != null && document.getElementById('mouseY') != null) {
					this.trueMouseX.innerHTML = "0";
					this.trueMouseY.innerHTML = "0";
					this.mouseX.innerHTML = "0";
					this.mouseY.innerHTML = "0";
				}
				break;
			case "mousedown":
				this.dragStart = {
					x: event.pageX - this.canvas.offsetLeft,
					y: event.pageY - this.canvas.offsetTop
				};
				this.drag = true;
				break;
			case "mousemove":
				let determineMouseX;
				let determineMouseY;
				if(this.canvasMouseMoveEventEnabled) {
					this.eventPageX = (event.pageX - this.canvas.offsetLeft);
					this.eventPageY = (event.pageY - this.canvas.offsetTop);
					if(this.eventPageX >= 0) {
						if(document.getElementById('trueMouseX') != null) {
							this.trueMouseX.innerHTML = this.eventPageX;
						}
					} else {
						if(document.getElementById('trueMouseX') != null) {
							this.trueMouseX.innerHTML = "0";
						}
					}
					if(this.eventPageY >= 0) {
						if(document.getElementById('trueMouseY') != null) {
							this.trueMouseY.innerHTML = this.eventPageY;
						}
					} else {
						if(document.getElementById('trueMouseY') != null) {
							this.trueMouseY.innerHTML = "0";
						}
					}
					determineMouseX = this.determineMouseXPosition(this.eventPageX).toFixed(2);
					determineMouseY = this.determineMouseYPosition(this.eventPageY).toFixed(2);
					if(document.getElementById('mouseX') != null && document.getElementById('mouseY') != null) {
						this.mouseX.innerHTML = determineMouseX;
						this.mouseY.innerHTML = determineMouseY;
					}
					let resultX;
					let resultY;
					if(this.drag) {
						this.dragEnd = {
							x: event.pageX - this.canvas.offsetLeft,
							y: event.pageY - this.canvas.offsetTop
						};
						let x1 = this.dragEnd.x - this.dragStart.x;
						let y1 = this.dragEnd.y - this.dragStart.y;
						let x2 = (event.pageX - this.canvas.offsetLeft);
						let y2 = (event.pageY - this.canvas.offsetTop);
						resultX = this.dragEnd.x - this.dragStart.x;
						resultY = this.dragEnd.y - this.dragStart.y;
						if(resultX >= 0 && resultY < 0) // right-upper
						{
							this.shiftGraphOnMouseDrag("right-upper", resultX, Math.abs(resultY))
						} else if(resultX >= 0 && resultY >= 0) //right-lower
						{
							this.shiftGraphOnMouseDrag("right-lower", resultX, resultY)
						} else if(resultX < 0 && resultY < 0) // left-upper
						{
							this.shiftGraphOnMouseDrag("left-upper", resultX, Math.abs(resultY))
						} else if(resultX < 0 && resultY >= 0) // left-lower
						{
							this.shiftGraphOnMouseDrag("left-lower", resultX, resultY)
						} else {}
						this.dragStart = this.dragEnd;
					}
					break;
				}
		}
	}
}

function deleteRow(buttonObject) {
	let buttons = document.getElementsByClassName("deleteLine1");
	let a = -1;
	for(let i = 0; i < buttons.length; i++) {
		if(buttonObject == buttons[i]) {
			a = i
		}
	}
	if(a != -1) {
		document.getElementById(dataTableID).deleteRow(a + 1);
	} else {}
	let tableLength = document.getElementById(dataTableID).rows.length;
	if(tableLength == 1) {
		let elem = document.getElementById(dataTableID);
		if(typeof elem != 'undefined') {
			elem.parentNode.removeChild(elem);
			barChartBuilder.buildNewTable();
		}
	}
}

function test1() {
	var canvas = document.getElementsByTagName('canvas')[0];
	canvas.width = 500;
	canvas.height = 250;
	c.canvasWidth = 500;
	c.canvasHeight = 250;
}

function shiftGraph3(theDirection) {
	if(theDirection == 1) {
		c.h1 = -c.gridSpace;
		c.h2 += c.scaleX;
		c.originX += 1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	} else if(theDirection == 3) {
		c.h1 = -c.gridSpace;
		c.h2 += c.scaleX;
		if(!chart.graphBuildMode) {
			c.originX -= 1;
		} else {
			c.originX -= c.gridSpace;
		}
		//c.originX -= 1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	} else if(theDirection == 2) {
		c.v1 = c.gridSpace;
		c.v2 += c.scaleY;
		if(!chart.graphBuildMode) {
			c.originY += 1;
		} else {
			c.originY += c.gridSpace;
		}
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	} else if(theDirection == 0) {
		c.v1 = c.gridSpace;
		c.v2 += c.scaleY;
		c.originY -= 1;
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	}
}

function clearScreen() {
	if(chart != undefined) {
		chart.placeHolder = [];
		updateSettings();
	}
}

function shiftGraph2(theDirection) {
	if(theDirection == 3) {
		c.h1 = -c.gridSpace;
		c.h2 += c.scaleX;
		c.originX += c.h1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	} else if(theDirection == 1) {
		c.h1 = c.gridSpace;
		c.h2 -= c.scaleX;
		c.originX += c.h1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	}
	// shift downwards
	else if(theDirection == 2) {
		c.v1 = c.gridSpace;
		c.v2 += c.scaleY;
		c.originY += c.v1;
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	} else if(theDirection == 0) {
		c.v1 = c.gridSpace;
		c.v2 -= c.scaleY;
		c.originY -= c.v1;
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	}
}

function shiftGraph(theDirection) {
	if(theDirection == 3) {
		c.h1 = -c.gridSpace;
		c.h2 += c.scaleX;
		c.originX += c.h1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	} else if(theDirection == 1) {
		c.h1 = c.gridSpace;
		c.h2 -= c.scaleX;
		c.originX += c.h1;
		c.startYAxis_X = c.originX;
		c.startYAxis_Y = 0;
		c.endYAxis_X = c.originX;
		c.endYAxis_Y = c.canvasHeight;
		c.domain += c.scaleX;
		updateSettings();
	}
	// shift downwards
	else if(theDirection == 2) {
		c.v1 = c.gridSpace;
		c.v2 += c.scaleY;
		c.originY += c.v1;
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	} else if(theDirection == 0) {
		c.v1 = c.gridSpace;
		c.v2 -= c.scaleY;
		c.originY -= c.v1;
		c.startXAxis_X = 0;
		c.startXAxis_Y = c.originY;
		c.endXAxis_X = c.canvasWidth;
		c.endXAxis_Y = c.originY;
		c.range += c.scaleY;
		updateSettings();
	}
}


function updateSettings() {
	switch(chartType) {
		case 'barchart':
		case 'linechart':
			if(chart != undefined) {
				chart.setMouseDragLimit();
			}
			if(document.getElementById('scaleX') == null && document.getElementById('scaleY') == null && document.getElementById('gridSpace') == null) {
				c.scaleX = parseFloat(autoScaleX);
				c.scaleY = parseFloat(autoScaleY);
				c.gridSpace = parseInt(autoGridSpace);
			} else {
				c.scaleX = parseFloat(document.getElementById('scaleX').value);
				c.scaleY = parseFloat(document.getElementById('scaleY').value);
				c.gridSpace = parseInt(document.getElementById('gridSpace').value);
			}
			if(c.scaleX <= 0) {
				c.scaleX = 0.1;
				document.getElementById('scaleX').value = "0.1";
			}
			if(c.scaleY <= 0) {
				c.scaleY = 0.1;
				document.getElementById('scaleY').value = "0.1";
			}
			if(c.gridSpace <= 0) {
				c.gridSpace = 5;
				document.getElementById('gridSpace').value = "5";
			}
			c1 = document.getElementById('myCanvas');
			context = c1.getContext('2d');
			//context.setTransform(1, 0, 0, 1, 0, 0);
			context.clearRect(0, 0, c.canvasWidth, c.canvasHeight);
			//context.translate(0.5, 0.5);
			determineDomainAndRange();
			if((c.calculateDomain()[1] > c.maxMouseDragLimit[1] + 1) && (c.calculateDomain()[0] < c.maxMouseDragLimit[3] - 1)) {
				c.gridSpace += 5;
				if(document.getElementById('gridSpace') != null) {
					document.getElementById('gridSpace').value = c.gridSpace;
				}
				shiftGraph2(1);
			} else if((c.calculateRange()[1] > c.maxMouseDragLimit[0] + 1) && (c.calculateRange()[0] < c.maxMouseDragLimit[2] - 1)) {
				c.gridSpace += 5;
				if(document.getElementById('gridSpace') != null) {
					document.getElementById('gridSpace').value = c.gridSpace;
				}
				shiftGraph2(0);
			} else {
				if((c.maxMouseDragLimit[0]) != "N/A") {
					if(c.calculateRange()[1] > c.maxMouseDragLimit[0]) {
						while(c.calculateRange()[1] > (c.maxMouseDragLimit[0])) {
							shiftGraph3(0);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[2]) != "N/A") {
					if(c.calculateRange()[0] < c.maxMouseDragLimit[2]) {
						while(c.calculateRange()[0] < (c.maxMouseDragLimit[2])) {
							//alert("marker 2");
							shiftGraph3(2);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[1]) != "N/A") {
					if(c.calculateDomain()[1] > c.maxMouseDragLimit[1]) {
						while(c.calculateDomain()[1] > (c.maxMouseDragLimit[1])) {
							shiftGraph3(1);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[3]) != "N/A") {
					if(c.calculateDomain()[0] < c.maxMouseDragLimit[3]) {
						while(c.calculateDomain()[0] < (c.maxMouseDragLimit[3])) {
							shiftGraph3(3);
							return;
						}
					}
				}
			}
			if(chart != undefined) {
				drawAllElements();
			}
			break;
		case 'candlestick_chart':
			if(document.getElementById('scaleX') == null && document.getElementById('scaleY') == null && document.getElementById('gridSpace') == null) {
				c.scaleX = parseFloat(autoScaleX);
				c.scaleY = parseFloat(autoScaleY);
				c.gridSpace = parseInt(autoGridSpace);
			} else {
				c.scaleX = parseFloat(document.getElementById('scaleX').value);
				c.scaleY = parseFloat(document.getElementById('scaleY').value);
				c.gridSpace = parseInt(document.getElementById('gridSpace').value);
			}
			if(c.scaleX <= 0) {
				c.scaleX = 0.1;
				document.getElementById('scaleX').value = "0.1";
			}
			if(c.scaleY <= 0) {
				c.scaleY = 0.1;
				document.getElementById('scaleY').value = "0.1";
			}
			if(c.gridSpace <= 0) {
				c.gridSpace = 5;
				document.getElementById('gridSpace').value = "5";
			}
			if(chart != undefined && chart.placeHolder.length > 0) {
				if((this.lastScaleY == -1 || this.lastGridSpace == -1) || (parseFloat(this.lastScaleY) != parseFloat(c.scaleY) || parseFloat(this.lastGridSpace) != parseFloat(c.gridSpace))) {
					let rangeLower = c.calculateRange()[0];
					let rangeUpper = c.calculateRange()[1];
					let domainLower = c.calculateDomain()[0];
					let domainUpper = c.calculateDomain()[1];
					let highVal = chart.getHighestCandleStickHighInRange();
					let compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high) + parseFloat(c.scaleY) < parseFloat(rangeLower);
					if(compare1) {
						while(compare1) {
							rangeLower = c.calculateRange()[0];
							compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high) + parseFloat(c.scaleY) < parseFloat(rangeLower);
							c.v1 = c.gridSpace;
							c.originY -= c.v1;
						}
					}
					let lowVal = chart.getLowestCandleStickLowInRange();
					let compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_low) > parseFloat(rangeUpper);
					if(compare2) {
						while(compare2) {
							rangeUpper = c.calculateRange()[1];
							//compare2 = parseFloat(chart.placeHolder[0].candlestick_low)> parseFloat(rangeUpper);
							compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_high) > parseFloat(rangeUpper);
							c.v1 = c.gridSpace;
							c.originY += c.v1;
						}
					}
					this.lastScaleY = c.scaleY;
					this.lastGridSpace = c.gridSpace;
				}
			}
			if(chart != undefined) {
				chart.setMouseDragLimit();
			}
			c1 = document.getElementById('myCanvas');
			context = c1.getContext('2d');
			context.clearRect(0, 0, c.canvasWidth, c.canvasHeight);
			determineDomainAndRange();
			if((c.calculateDomain()[1] > c.maxMouseDragLimit[1] + 1) && (c.calculateDomain()[0] < c.maxMouseDragLimit[3] - 1)) {
				c.gridSpace += 5;
				if(document.getElementById('gridSpace') != null) {
					document.getElementById('gridSpace').value = c.gridSpace;
				}
				shiftGraph2(1);
			} else if((c.calculateRange()[1] > c.maxMouseDragLimit[0] + 1) && (c.calculateRange()[0] < c.maxMouseDragLimit[2] - 1)) {
				c.gridSpace += 5;
				if(document.getElementById('gridSpace') != null) {
					document.getElementById('gridSpace').value = c.gridSpace;
				}
				shiftGraph2(0);
			} else {
				if((c.maxMouseDragLimit[0]) != "N/A") {
					if(c.calculateRange()[1] > c.maxMouseDragLimit[0]) {
						while(c.calculateRange()[1] > (c.maxMouseDragLimit[0])) {
							shiftGraph3(0);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[2]) != "N/A") {
					if(c.calculateRange()[0] < c.maxMouseDragLimit[2]) {
						while(c.calculateRange()[0] < (c.maxMouseDragLimit[2])) {
							//alert("marker 2");
							shiftGraph3(2);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[1]) != "N/A") {
					if(c.calculateDomain()[1] > c.maxMouseDragLimit[1]) {
						while(c.calculateDomain()[1] > (c.maxMouseDragLimit[1])) {
							shiftGraph3(1);
							return;
						}
					}
				}
				if((c.maxMouseDragLimit[3]) != "N/A") {
					if(c.calculateDomain()[0] < c.maxMouseDragLimit[3]) {
						while(c.calculateDomain()[0] < (c.maxMouseDragLimit[3])) {
							shiftGraph3(3);
							return;
						}
					}
				}
			}
			if(chart != undefined) {
				drawAllElements();
			}
			break;
	}
}

function modifyXAxisVisibility(cb) {
	if(cb.checked) {
		c.xAxisVisible = 1;
	} else {
		c.xAxisVisible = 0;
	}
	updateSettings();
}

function modifyYAxisVisibility(cb) {
	if(cb.checked) {
		c.yAxisVisible = 1;
	} else {
		c.yAxisVisible = 0;
	}
	updateSettings();
}

function labelEveryOtherNumber() {
	let getValue = document.getElementById('everyOtherNumber');
	c.everyOtherNumber = getValue.checked;
	updateSettings();
}

function modifyPlotMarkerVisibility(cb) {
	if(cb.checked) {
		c.xPlotMarkersVisible = 1;
		c.yPlotMarkersVisible = 1;
	} else {
		c.xPlotMarkersVisible = 0;
		c.yPlotMarkersVisible = 0;
	}
	updateSettings();
}

function modifyNumericLabelingVisibility(cb) {
	if(cb.checked) {
		c.numericLabelingVisible = 1;
	} else {
		c.numericLabelingVisible = 0;
	}
	updateSettings();
}

function centerOriginToScreen() {
	c.originX = c.canvasWidth / 2;
	c.originY = c.canvasHeight / 2;
	c.h1 = 0;
	c.v1 = 0;
	c.h2 = 0;
	c.v2 = 0;
	c.startXAxis_X = 0;
	c.startXAxis_Y = c.originY;
	c.endXAxis_X = c.canvasWidth;
	c.endXAxis_Y = c.originY;
	c.startYAxis_X = c.originX;
	c.startYAxis_Y = 0;
	c.endYAxis_X = c.originX;
	c.endYAxis_Y = c.canvasHeight;
	updateSettings();
}

function determineDomainAndRange() {
	if(document.getElementById('domainRangeLabel') != null) {
		let a = "";
		a += "Domain: {" + (c.calculateDomain()[0].toFixed(2)) + "," + (c.calculateDomain()[1].toFixed(2)) + "}&nbsp;";
		a += "Range: {" + (c.calculateRange()[0].toFixed(2)) + "," + (c.calculateRange()[1].toFixed(2)) + "}&nbsp;&nbsp;";
		document.getElementById('domainRangeLabel').innerHTML = a;
	}
}

function clearData() {
	document.getElementById('graphData').innerHTML = "";
	clearScreen();
	buildNewTable();
}

function buildFooterHTML() {
	let buildHTML;
	if(chartType != "candlestick_chart") {
		buildHTML = 'True Domain {0, ' + c.canvasWidth + '}&nbsp; \
					True Range {0, ' + c.canvasHeight + '}&nbsp;&nbsp; \
					<span>\
							True Mouse X: <span id="trueMouseX">0</span>\
							&nbsp; \
							True Mouse Y: <span id="trueMouseY">0</span>\
							&nbsp;&nbsp; \
					</span> \
					<span>\
							Mouse X: <span id="mouseX">0</span>\
							&nbsp; \
							Mouse Y: <span id="mouseY">0</span>\
					</span>\
					&nbsp;\
						<span  id="domainRangeLabel">\
						</span><br/>\
						<label for="scaleX" class="graphPropertyHeaders"><b>Scale X</b></label>&nbsp;\
							<input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleX"  class="txt1" required minlength="1"  max="1.5" step="0.1" min="1" style="width: 200px;">\
						&nbsp;&nbsp;\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Scale Y</b></label>&nbsp;\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleY"  class="txt1" required minlength="1"  step="0.1" min="0">\
						&nbsp;&nbsp;\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Gridline Spacing</b></label>&nbsp;\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="gridSpace"  class="txt1" required minlength="1"  size="5" step="5" min="5" >\
						<br/>\
						<input type="checkbox" checked onclick="modifyXAxisVisibility(this)" id="xAxisVisibility">X-Axis visible&nbsp;\
						<input type="checkbox" checked onclick="modifyYAxisVisibility(this)" id="yAxisVisibility">Y-Axis visible&nbsp;\
						<input type="checkbox" checked onclick="modifyPlotMarkerVisibility(this)" id="gridLinesVisible">Grid Lines visible &nbsp;\
						<input type="checkbox" unchecked onclick="modifyNumericLabelingVisibility(this)" id="numericLabelingVisible">Add Numeric labeling&nbsp;';
	} else {
		buildHTML = 'True Domain {0, ' + c.canvasWidth + '}&nbsp; \
					True Range {0, ' + c.canvasHeight + '}&nbsp;&nbsp; \
					<span>\
							True Mouse X: <span id="trueMouseX">0</span>\
							&nbsp; \
							True Mouse Y: <span id="trueMouseY">0</span>\
							&nbsp;&nbsp; \
					</span> \
					<span>\
							Mouse X: <span id="mouseX">0</span>\
							&nbsp; \
							Mouse Y: <span id="mouseY">0</span>\
					</span>\
					&nbsp;\
						<span  id="domainRangeLabel">\
						</span><br/>\
						<label for="scaleX" class="graphPropertyHeaders"><b>Scale X</b></label>&nbsp;\
							<input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleX"  class="txt1" required minlength="1"  max="1.5" step="0.1" min="1" style="width: 200px;">\
						&nbsp;&nbsp;\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Scale Y</b></label>&nbsp;\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleY"  class="txt1" required minlength="1"  step="0.1" min="0">\
						&nbsp;&nbsp;\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Gridline Spacing</b></label>&nbsp;\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="gridSpace"  class="txt1" required minlength="1"  size="5" step="5" min="5" >\
						<br/>\
						<input type="checkbox" checked onclick="modifyXAxisVisibility(this)" id="xAxisVisibility">X-Axis visible&nbsp;\
						<input type="checkbox" checked onclick="modifyYAxisVisibility(this)" id="yAxisVisibility">Y-Axis visible&nbsp;\
						<input type="checkbox" checked onclick="modifyPlotMarkerVisibility(this)" id="gridLinesVisible">Grid Lines visible &nbsp;\
						<input type="checkbox" unchecked onclick="modifyNumericLabelingVisibility(this)" id="numericLabelingVisible">Add Numeric labeling&nbsp;';
	}
	return buildHTML;
}

function buildData() {
	let parent = "#column1";
	let width = 775;
	let height = 450;
	let gridlineColor = "#ECECEC";
	let gridSpace = 40;
	let numericLabelingVisible = 0;
	let scaleX = 1.5;
	let scaleY = 1;
	let xPlotMarkersVisible = 1;
	let yPlotMarkersVisible = 1;
	let xAxisVisible = 1;
	let yAxisVisible = 1;
	c = new canvasClass(parent, width, height, gridlineColor, gridSpace, numericLabelingVisible, scaleX, scaleY, xPlotMarkersVisible, yPlotMarkersVisible, xAxisVisible, yAxisVisible, updateSettings);
	if(footerVisible) {
		document.getElementById('footer').innerHTML = buildFooterHTML();
	} else {
		document.getElementById('footer').innerHTML = "";
	}
	let br;
	br = document.createElement("br");
	document.querySelector('#column1').appendChild(br);
	let styleBtn = "margin-top: 10px;";
	let styleBtn2 = "margin-top: 10px; margin-left: 5px;";
	let btnMoveLeftText = document.createTextNode("Move Left");
	let btnMoveLeft = document.createElement("BUTTON");
	btnMoveLeft.className = "btn2";
	btnMoveLeft.setAttribute('style', styleBtn);
	btnMoveLeft.appendChild(btnMoveLeftText);
	btnMoveLeft.addEventListener("click", function() {
		shiftGraph(1);
	});
	document.querySelector('#column1').appendChild(btnMoveLeft);
	let btnMoveRightText = document.createTextNode("Move Right");
	let btnMoveRight = document.createElement("BUTTON");
	btnMoveRight.className = "btn2";
	btnMoveRight.setAttribute('style', styleBtn2);
	btnMoveRight.appendChild(btnMoveRightText);
	btnMoveRight.addEventListener("click", function() {
		shiftGraph(3);
	});
	document.querySelector('#column1').appendChild(btnMoveRight);
	let btnMoveUpText = document.createTextNode("Move Up");
	let btnMoveUp = document.createElement("BUTTON");
	btnMoveUp.className = "btn2";
	btnMoveUp.setAttribute('style', styleBtn2);
	btnMoveUp.appendChild(btnMoveUpText);
	btnMoveUp.addEventListener("click", function() {
		shiftGraph(2);
	});
	document.querySelector('#column1').appendChild(btnMoveUp);
	let btnMoveDownText = document.createTextNode("Move Down");
	let btnMoveDown = document.createElement("BUTTON");
	btnMoveDown.className = "btn2";
	btnMoveDown.setAttribute('style', styleBtn2);
	btnMoveDown.appendChild(btnMoveDownText);
	btnMoveDown.addEventListener("click", function() {
		shiftGraph(0);
	});
	document.querySelector('#column1').appendChild(btnMoveDown);
	let btnClearScreenText = document.createTextNode("Clear Screen");
	let btnClearScreen = document.createElement("BUTTON");
	btnClearScreen.className = "btn2";
	btnClearScreen.setAttribute('style', styleBtn2);
	btnClearScreen.appendChild(btnClearScreenText);
	btnClearScreen.addEventListener("click", function() {
		clearScreen();
	});
	document.querySelector('#column1').appendChild(btnClearScreen);
	let btnCenterOriginToScreenText = document.createTextNode("Center Origin to Screen");
	let btnCenterOriginToScreen = document.createElement("BUTTON");
	btnCenterOriginToScreen.className = "btn2";
	btnCenterOriginToScreen.id = "centerOriginToScreen";
	btnCenterOriginToScreen.setAttribute('style', styleBtn2);
	btnCenterOriginToScreen.appendChild(btnCenterOriginToScreenText);
	btnCenterOriginToScreen.addEventListener("click", function() {
		centerOriginToScreen();
	});
	document.querySelector('#column1').appendChild(btnCenterOriginToScreen);
	if(footer.innerHTML == "") {
		c.registerMouseTrackingLabels("0", "0", "0", "0");
	} else {
		document.getElementById('scaleX').value = c.scaleX;
		document.getElementById('scaleY').value = c.scaleY;
		document.getElementById('gridSpace').value = c.gridSpace;
		determineDomainAndRange();
		c.registerMouseTrackingLabels(document.getElementById('trueMouseX'), document.getElementById('trueMouseY'), document.getElementById('mouseX'), document.getElementById('mouseY'));
	}
	document.getElementById('column3').innerHTML = buildColumn3Data();
	buildNewTable();
	drawAllElements();
	updateSettings();
}

function buildNewTable() {
	switch(chartType) {
		case 'barchart':
			return barChartBuilder.buildNewTable();
			break;
		case 'linechart':
			return lineChartBuilder.buildNewTable();
			break;
		case "candlestick_chart":
			return candlestickChartBuilder.buildNewTable();
			break;
	}
}

function buildColumn3Data() {
	switch(chartType) {
		case 'barchart':
			return barChartBuilder.buildChartMenu();
			break;
		case 'linechart':
			return lineChartBuilder.buildChartMenu();
			break;
		case "candlestick_chart":
			return candlestickChartBuilder.buildChartMenu();
			break;
	}
}

function buildSampleChart() {
	switch(chartType) {
		case 'barchart':
			barChartBuilder.buildSampleChart();
			break;
		case 'linechart':
			lineChartBuilder.buildSampleChart();
			break;
		case "candlestick_chart":
			return candlestickChartBuilder.buildSampleChart();
			break;
	}
}

function addNewLine() {
	switch(chartType) {
		case 'barchart':
			barChartBuilder.addNewLine();
			break;
		case 'linechart':
			lineChartBuilder.addNewLine();
			break;
	}
}


function buildGraph() {
	switch(chartType) {
		case 'barchart':
			chart = new barChartBuilder(c, c.canvas);
			chart.graphBuildMode = true;
			centerOriginToScreen();
			break;
		case 'linechart':
			chart = new lineChartBuilder(c, c.canvas);
			chart.graphBuildMode = true;
			//centerOriginToScreen();
			break;
		case "candlestick_chart":
			chart = new candlestickChartBuilder(c, c.canvas);
			chart.graphBuildMode = true;
			centerOriginToScreen();
			break;
	}

	if(chartType == 'barchart' || chartType == 'linechart') {
		let xValues = document.querySelectorAll('.txtX');
		let yValues = document.querySelectorAll('.txtY');
		let hexColors = document.querySelectorAll('.txtColor');
		chart.buildData(xValues, yValues, hexColors);
		chart.autoAdjustGraph(yValues);
	} else if(chartType == 'candlestick_chart') {
		let candlestick_date = document.querySelectorAll('.candlestick_date');
		let candlestick_open = document.querySelectorAll('.candlestick_open');
		let candlestick_high = document.querySelectorAll('.candlestick_high');
		let candlestick_low = document.querySelectorAll('.candlestick_low');
		let candlestick_close = document.querySelectorAll('.candlestick_close');
		chart.buildData(candlestick_date, candlestick_open, candlestick_high, candlestick_low, candlestick_close);
		chart.autoAdjustGraph2(candlestick_high);
	}
	drawAllElements();
	let graphName = document.getElementById('txtTitle').value;
	document.getElementById('title1').innerHTML = "<b>" + graphName + "</b>";
	chart.graphBuildMode = false;
	centerOriginToScreen();
	if(chartType == 'candlestick_chart') {
		if(chart.placeHolder.length > 0) {
			let rangeLower = c.calculateRange()[0];
			let rangeUpper = c.calculateRange()[1];
			let domainLower = c.calculateDomain()[0];
			let domainUpper = c.calculateDomain()[1];
			let highVal = chart.getHighestCandleStickHighInRange();
			let compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high) + parseFloat(c.scaleY) < parseFloat(rangeLower);
			if(compare1) {
				while(compare1) {
					rangeLower = c.calculateRange()[0];
					compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high) + parseFloat(c.scaleY) < parseFloat(rangeLower);
					c.v1 = c.gridSpace;
					c.originY -= c.v1;
				}
			}
			let lowVal = chart.getLowestCandleStickLowInRange();
			let compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_low) > parseFloat(rangeUpper);
			if(compare2) {
				while(compare2) {
					rangeUpper = c.calculateRange()[1];
					//compare2 = parseFloat(chart.placeHolder[0].candlestick_low)> parseFloat(rangeUpper);
					compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_high) > parseFloat(rangeUpper);
					c.v1 = c.gridSpace;
					c.originY += c.v1;
				}
			}
			if(document.getElementById('scaleX') == null && document.getElementById('scaleY') == null && document.getElementById('gridSpace') == null) {
				c.scaleX = parseFloat(autoScaleX);
				c.scaleY = parseFloat(autoScaleY);
				c.gridSpace = parseInt(autoGridSpace);
			} else {
				c.scaleX = parseFloat(document.getElementById('scaleX').value);
				c.scaleY = parseFloat(document.getElementById('scaleY').value);
				c.gridSpace = parseInt(document.getElementById('gridSpace').value);
			}
			if(c.scaleX <= 0) {
				c.scaleX = 0.1;
				document.getElementById('scaleX').value = "0.1";
			}
			if(c.scaleY <= 0) {
				c.scaleY = 0.1;
				document.getElementById('scaleY').value = "0.1";
			}
			if(c.gridSpace <= 0) {
				c.gridSpace = 5;
				document.getElementById('gridSpace').value = "5";
			}
			chart.autoAdjustGraph2(chart.placeHolder[lowVal].candlestick_low);
		}
		updateSettings();
	}
}

function getValue() {}

function drawPlaceHolderElements() {
	let counter = 0;
	for(x in chart.placeHolder) {
		switch(chart.placeHolder[x].command) {
			case "drawBar":
				chart.drawBarData(counter);
				break;
			case "drawPlot":
				chart.drawPlotData(counter);
				break;
			case "drawHoverWindow":
				chart.drawHoverWindow(counter);
				break;
				//	case "drawCandleStickWicks":
				//chart.drawCandleStickWicks(counter);
				//		break;		
			case "drawCandleStick":
				chart.drawCandlestick(counter);
				break;
		}
		counter += 1;
	}
}

function drawAllElements() {
	c.drawDisplayElements();
	if(c.numericLabelingVisible == 1) {
		c.drawNumbers();
	}
	if(chart != undefined) {
		if(chart.placeHolder.length > 0) {
			drawPlaceHolderElements();
			if(c.originX > 0) {
				chart.drawVerticalNumbering();
			} else {
				chart.drawVerticalNumbering2();
				c.ctx.beginPath();
				c.ctx.lineWidth = 2;
				c.ctx.strokeStyle = "gray";
				c.ctx.moveTo(c.canvasWidth - (c.gridSpace + 10), 0);
				c.ctx.lineTo(c.canvasWidth - (c.gridSpace + 10), c.canvasHeight);
				c.ctx.stroke();
			}
		}
	}
}
if(typeof beginInit == 'undefined') {
	let beginInit;
	beginInit = setTimeout(buildData, 1);
}