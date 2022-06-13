try {
	var c;
	var functions;
	//let barchart;
	let chart;
	//let chartType;
//	let chartType = "barchart";
//	let chartType = "linechart";
		chartType = "barchart";
//	let chartType = "candlestick_chart";
	
	var appFileName = "app6.html";	
 
 
	
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
				//let b1 = document.querySelectorAll('.fileLoadtable2 tr td')[a*colLength].innerHTML;
				//alert(a*colLength);
				//alert( document.querySelectorAll('.fileLoadtable2 tr td')[a*colLength].innerHTML);
				let b1 = document.querySelectorAll('.fileLoadtable2 tr td')[a*colLength].innerHTML;
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
				let b1 = document.querySelectorAll('.fileLoadtable tr td')[a*colLength].innerHTML;
				openFile(b1);
				closePopup();
				
			} else {}

	}


	 function newFile(fileType) 
	 
	 {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
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
		//	buildHTML += `<tr><td>${element[0]}</td><td>${element[1]}</td><td>${element[2]}</td><td><button class="btn4" onClick='determineFileListIndex(this)'>Open</button></tr>`
			buildHTML += `<tr><td>${element}</td><td><button class="btn4" style='margin-left: 25px; width: 130px;' onClick='determineFileListIndex2(this)'>Open</button></tr>`
		});	
		
		
		buildHTML += `
			</tbody>
		</table>	
		`;
		
		
		document.getElementById('div1').innerHTML = buildHTML;



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		
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
		
		
		

		//
	//	document.getElementById('column3').innerHTML = buildColumn3Data();
		//
				
		
		return;
		
	
		
	}
	
	function closePopup() {
	document.getElementById("popup_container").style.display = "none";
}


 

	function openFile(fileName)
	
	{
					
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
			
			
			if(chartType == 'barchart' || chartType == 'linechart')
			{
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
						
						
							//alert(xValues);
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
							numericLabelingVisibility= document.getElementById('numericLabelingVisible').checked;
			 
							documentData = {
								command: 'saveGraphFile',
								appHTML: appFileName,
								graphTitle: getTitle,
								parameters: [chartType, buildXAxisData, buildYAxisData, buildHexColors],
								settings: {'scaleX' : scaleX, 'scaleY': scaleY, 'gridSpace': gridSpace},
								settings2: {'xAxisVisible': xAxisVisibility, 'yAxisVisible': yAxisVisibility,
								'gridLinesVisible':gridLinesVisibility,'numericLabelingVisibility':numericLabelingVisibility},
								date_last_modified: formatJSONDate(new Date()), 'fileName': getTitle
							};

							socket.emit('client_msg', documentData);
						}			

							
 

			}
			
			
			else if(chartType == 'candlestick_chart')
			{
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
							numericLabelingVisibility= document.getElementById('numericLabelingVisible').checked;
							
							
							documentData = {
								command: 'saveGraphFile2',
								appHTML: appFileName,
								graphTitle: getTitle,
								parameters: [chartType, candlestick_dates_array, candlestick_opens_array,candlestick_highs_array,candlestick_lows_array,candlestick_closes_array],
								settings: {'scaleX' : scaleX, 'scaleY': scaleY, 'gridSpace': gridSpace},
								settings2: {'xAxisVisible': xAxisVisibility, 'yAxisVisible': yAxisVisibility,
								'gridLinesVisible':gridLinesVisibility,'numericLabelingVisibility':numericLabelingVisibility},
								date_last_modified: formatJSONDate(new Date()), 'fileName': getTitle
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
			//this.maxMouseDragLimit = ["N/A", "N/A", -this.scaleY, -1]; // top, right, down, left
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
	
	
		class barChartBuilder {
			constructor(c, canvasObject) {
				this.placeHolder = [];
				this.canvas = canvasObject;
				this.ctx = canvasObject.getContext('2d');
				this.control = c;
				this.canvas.addEventListener("mousemove", this);
				this.largestYValue = "N/A";
				
			  this.graphBuildMode = false;
			}
			createHoverColor(hexColor) {
				let percentage = 60;
				hexColor = hexColor.replace(/^\s*#|\s*$/g, '');
				if(hexColor.length == 3) {
					hexColor = hexColor.replace(/(.)/g, '$1$1');
				}
				var r = parseInt(hexColor.substr(0, 2), 16),
					g = parseInt(hexColor.substr(2, 2), 16),
					b = parseInt(hexColor.substr(4, 2), 16);
				return '#' + ((0 | (1 << 8) + r + (256 - r) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + g + (256 - g) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + b + (256 - b) * percentage / 100).toString(16)).substr(1);
			}
			handleEvent(event) {
				switch(event.type) {
					case "mousemove":
						let determineMouseX;
						let determineMouseY;
						let outsideHoverRange = 0.01;
						let barWidthSpan = (chart.control.scaleX) * 2;
						for(x in this.placeHolder) {
							if(this.placeHolder[x].command == "drawBar") {
								this.placeHolder[x].hoverColor = "";
							} else if(this.placeHolder[x].command == "drawHoverWindow") {
								this.placeHolder.splice(x, 1);
							}
						}
						if(this.placeHolder.length > 0) {
							determineMouseX = Number(this.control.determineMouseXPosition(this.control.eventPageX).toFixed(2));
							determineMouseY = Number(this.control.determineMouseYPosition(this.control.eventPageY).toFixed(2));
							for(x in this.placeHolder) {
								if((determineMouseX <= this.placeHolder[x].x) && (determineMouseX >= this.placeHolder[x].x - outsideHoverRange) || (determineMouseX >= this.placeHolder[x].x) && (determineMouseX <= this.placeHolder[x].x + barWidthSpan + outsideHoverRange)) {
									if((determineMouseY >= -outsideHoverRange) && (determineMouseY <= (this.placeHolder[x].y))) {
										this.placeHolder[x].hoverColor = this.createHoverColor(this.placeHolder[x].color);
										let placeHolderElement;
										placeHolderElement = {
											command: 'drawHoverWindow',
											x: this.placeHolder[x].x,
											y: this.placeHolder[x].y,
											hLabel: this.placeHolder[x].hLabel
										};
										this.placeHolder.push(placeHolderElement);
										updateSettings();
										return;
									}
								}
							}
							updateSettings();
						}
						break;
				}
			}
			drawNumericLabelY(theNumber, pointX, pointY) {
				let count = this.control.countDecimals(theNumber);
				let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
				let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
			drawNumericLabelY2(theNumber, pointX, pointY) {
				let count = this.control.countDecimals(theNumber);
				//let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
				let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
				this.ctx.fillText(theNumber, c.canvasWidth - (c.gridSpace + 15), y);
			}
			buildData(xValues, yValues, hexColors) {
				
				 
 
				
				let placeHolderElement;
				let starterX = 1;
				for(let i = 0; i < xValues.length; i++) {
					placeHolderElement = {
						command: 'drawBar',
						x: starterX,
						y: yValues[i].value,
						color: hexColors[i].value,
						hoverColor: "",
						hLabel: xValues[i].value
					};
					this.placeHolder.push(placeHolderElement);
					starterX += 3;
				}
			}
			drawVerticalNumbering() {
				for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
					this.drawNumericLabelY(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
				}
			}
			drawVerticalNumbering2() {
				for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
					this.drawNumericLabelY2(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
				}
			}
			formatFont1() {
				switch(this.control.scaleX) {
					case 1:
						return 1.5;
						break;
					case 1.1:
						return 1.4;
						break;
					case 1.2:
						return 1.3;
						break;
					case 1.3:
						return 1.2;
						break;
					case 1.4:
						return 1.1;
						break;
					case 1.5:
						return 1;
						break;
					case 1.6:
						return 0.9;
						break;
					case 1.7:
						return 0.8;
						break;
					case 1.8:
						return 0.7;
						break;
					case 1.9:
						return 0.7;
						break;
					case 2:
						return 0.7;
						break;
					default:
						return 1.5;
				}
			}
			drawHoverWindow(counter) {
				let hoverWindowBackground = "#000080";
				let x1, y1;
				x1 = this.placeHolder[counter].x + (this.control.scaleX * 1.75);
				y1 = this.placeHolder[counter].y;
				y1 = parseFloat(y1);
				y1 = y1 + (this.control.scaleY / 2) + this.control.scaleY;
				let width = this.control.gridSpace * 4;
				let height = -(this.control.scaleY) * 2;
				let totalWidthSpan = x1 + ((this.control.scaleX * 4));
				if(totalWidthSpan >= c.calculateDomain()[1]) {
					
					
					x1 = this.placeHolder[counter].x - (this.control.scaleX * 3.75);
					
					 if(y1 + height <= 0)
					 {
						 
						 
							while(y1 + height <= 0)
							{
									y1 += 0.5;
							}
							
							y1+= 0.1;
					 }
					
					
					
					this.fillRectangle(x1, y1, width, height, "#FFFFFF");
					this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				} else {
					
					
					 //alert(y1+height);
					 
					 if(y1 + height <= 0)
					 {
							while(y1 + height <= 0)
							{
								y1 += 0.5;
							}
							
							y1+= 0.1;
					 }
					 
					this.fillRectangle(x1, y1, width, height, "#FFFFFF");
					this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				}
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointX1 += this.control.gridSpace * 0.25;
				pointY1 += this.control.gridSpace / 2;
				this.ctx.fillStyle = "#000000";
				let xValueOutput = `x: ${this.placeHolder[counter].hLabel} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				//this.ctx.font = ((this.control.gridSpace / 2)) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(xValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;
				let yValueOutput = `y: ${this.placeHolder[counter].y} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				//this.ctx.font = ((this.control.gridSpace / 2)) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(yValueOutput, pointX1, pointY1);
			}
			drawBarData(counter) {
 
				
				if(this.placeHolder[counter].hoverColor == "") {
					this.fillRectangle(this.placeHolder[counter].x, 0, this.control.gridSpace * 2, this.placeHolder[counter].y, this.placeHolder[counter].color);
				} else {
					this.fillRectangle(this.placeHolder[counter].x, 0, this.control.gridSpace * 2, this.placeHolder[counter].y, this.placeHolder[counter].hoverColor);
				}
				this.drawHlabel(this.placeHolder[counter].x + 1, 0, this.placeHolder[counter].hLabel);
				
 
			}
			setMouseDragLimit() {
				let downMax = (this.control.scaleY);
				downMax = -downMax;
				try {
					if(this.largestYValue != "N/A") {
						let upMax = this.largestYValue + (this.control.gridSpace * (this.control.scaleY / 2));
						this.control.maxMouseDragLimit = [upMax, "N/A", downMax, -2.5]; // top, right, down, left
					}
				} catch {
					this.control.maxMouseDragLimit = ["N/A", "N/A", downMax, -1]; // top, right, down, left
				}
			}
			roundUp(scaleY) {
				let value1 = 0;
				if(scaleY > 10 && scaleY <= 100) {
					value1 = 10;
				} else if(scaleY >= 100 && scaleY < 1000) {
					value1 = 100;
				} else if(scaleY >= 1000 && scaleY < 10000) {
					value1 = 1000;
				} else if(scaleY >= 10000 && scaleY < 100000) {
					value1 = 10000;
				} else if(scaleY >= 100000 && scaleY < 1000000) {
					value1 = 100000;
				} else if(scaleY >= 1000000 && scaleY < 10000000) {
					value1 = 1000000;
				}
				else if(scaleY >= 10000000 && scaleY < 100000000) {
					value1 = 10000000;
				}			
				else if(scaleY >= 100000000 && scaleY < 1000000000) {
					value1 = 100000000;
				}						
				if(scaleY >= 1) {
					if(value1 == 10) {
						if(document.getElementById('scaleY') != null) {
							document.getElementById('scaleY').value = value1;
							document.getElementById("scaleY").step = value1;
						} else {
							autoScaleY = value1;
							updateSettings();
						}
					} else {
						let roundTo = Math.ceil(value1 / 100) * 100;
						if(roundTo == 0) {
							roundTo = 1;
						}
						if(document.getElementById('scaleY') != null) {
							document.getElementById('scaleY').value = roundTo;
							document.getElementById("scaleY").step = roundTo;
						} else {
							autoScaleY = roundTo;
							updateSettings();
						}
					}
				} else {
					let lessThanOne = 0.1;
					if(document.getElementById('scaleY') != null) {
						document.getElementById('scaleY').value = lessThanOne;
						document.getElementById("scaleY").step = lessThanOne;
					} else {
						autoScaleY = roundTo;
						updateSettings();
					}
				}
			}
			
			determineYScaleIncrementSize(largestValue)	
			{
				return largestValue / 5;		
			}		
		
			autoAdjustGraph(yValues) {
				 
				
				let largestValue = -1;
				let buildArray = [];
				let b1 ;
				for(let i = 0; i < yValues.length; i++) {
					if(parseFloat(yValues[i].value) > largestValue) {
						largestValue = parseFloat(yValues[i].value);
						b1 = this.determineYScaleIncrementSize(largestValue);
					}
				}
				if(largestValue > this.control.calculateRange()[1].toFixed(2)) {
					this.control.scaleY = b1;
					while(largestValue > this.control.calculateRange()[1].toFixed(2)) {
						this.control.scaleY += b1;
						if(document.getElementById('scaleY') != null) {
							document.getElementById('scaleY').value = this.control.scaleY;
						}
					}
				}
				this.largestYValue = largestValue;
				this.roundUp(this.largestYValue);
				this.control.updateSettings();
			}
			alignHLabel(pointX1) {
				let a;
				switch(this.control.scaleX) {
					case 1:
						a = 0;
						break;
					case 1.1:
						a = 1;
						break;
					case 1.2:
						a = 2;
						break;
					case 1.3:
						a = 4;
						break;
					case 1.4:
						a = 10;
						break;
					case 1.5:
						a = 10;
						break;
					case 1.6:
						a = 10;
						break;
					case 1.7:
						a = 15;
						break;
					case 1.8:
						a = 15;
						break;
					case 1.9:
						a = 15;
						break;
					case 2:
						a = 15;
						break;
				}
				return pointX1 + a;
			}
			hLabelDetermineFontSize() {
				switch(this.control.scaleX) {
					case 1:
						return((this.control.gridSpace / 2) / this.control.scaleX);
						break;
					case 1.1:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 1;
						break;
					case 1.2:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 2;
						break;
					case 1.3:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 2;
						break;
					case 1.4:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.5:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.6:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.7:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.8:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.9:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 2:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					default:
						return 1.5;
				}
				return((this.control.gridSpace / 2) / this.control.scaleX);
			}
			drawHlabel(x1, y1, text) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointY1 += this.control.gridSpace / 1.5;
				pointX1 = this.alignHLabel(pointX1);
				this.ctx.fillStyle = "#000000";
				//this.ctx.font = ((this.control.gridSpace / 2)/this.control.scaleX) + "px Arial";
				this.ctx.font = this.hLabelDetermineFontSize() + "px Arial";
				this.ctx.textAlign = "center";
				this.ctx.fillText(text, pointX1, pointY1);
			}
			strokeRectangle(x1, y1, width, height, color) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				this.ctx.strokeStyle = color;
				//let finalHeight = -25;
				//let finalHeight = -this.control.gridSpace*this.control.scaleX;
				//let finalHeight = (height*(this.control.gridSpace / this.control.scaleY));
				let finalHeight;
				finalHeight = height * (this.control.gridSpace / this.control.scaleY);
				finalHeight = -finalHeight;
				this.ctx.strokeRect(pointX1, pointY1, width, finalHeight);
			}
			fillRectangle(x1, y1, width, height, color) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				this.ctx.fillStyle = color;
				//let finalHeight = -25;
				//let finalHeight = -this.control.gridSpace*this.control.scaleX;
				//let finalHeight = (height*(this.control.gridSpace / this.control.scaleY));
				let finalHeight;
				finalHeight = height * (this.control.gridSpace / this.control.scaleY);
				finalHeight = -finalHeight;
				
			//	alert(pointY1);
			//	 pointY1 = this.control.startXAxis_Y;
				
 
				this.ctx.fillRect(pointX1, pointY1, width, finalHeight);
			}
			fillRectangle2(x1, y1, width, height, color, stepX, stepY) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointX1 -= stepX;
				pointY1 -= stepY;
				this.ctx.fillStyle = color;
				this.ctx.fillRect(pointX1, pointY1, width, height);
			}
			drawLine(x1, y1, x2, y2) {
				this.ctx.lineWidth = 3;
				this.ctx.strokeStyle = "red";
				this.ctx.beginPath();
				var pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				var pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				var pointX2 = this.control.originX + (x2 * ((this.control.gridSpace / this.control.scaleX)));
				var pointY2 = this.control.originY + -(y2 * (this.control.gridSpace / this.control.scaleY));
				pointX1 = parseInt(pointX1);
				pointY1 = parseInt(pointY1);
				pointX2 = parseInt(pointX2);
				pointY2 = parseInt(pointY2);
				this.ctx.moveTo(pointX1, pointY1);
				this.ctx.lineTo(pointX2, pointY2);
				this.ctx.save(); //save context without transformation
				this.ctx.stroke();
				this.ctx.lineWidth = 1;
			}
			static createRandomHexColor() {
				return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
			}
			static addNewLine() {
				let table = document.getElementById(dataTableID);
				let tableLength = document.getElementById(dataTableID).rows.length;
				let row = table.insertRow(tableLength);
				let c1 = row.insertCell(0);
				let c2 = row.insertCell(1);
				let c3 = row.insertCell(2);
				let c4 = row.insertCell(3);
				// Add some text to the new cells:
				c1.innerHTML = '<input type="text" class="txtX" value="value1">';
				c2.innerHTML = '<input type="text" class="txtY" value="1"></td>';
				c3.innerHTML = '<input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '">';
				c4.innerHTML = '<button class="deleteLine1"  onClick="deleteRow(this)">X</button>';
			}
			static buildNewTable() {
				let buildHTML = '<b><h2 >Bar Chart Builder</h2></b>\
			<br><br><b>Title</b><br/><b><input type="text" value="new title" id="txtTitle"></b><br/><br/>\
			<div id="contain1">\
			<table id="dataTable1">\
				<thead>\
						<tr>\
							<th>X</th>\
							<th>Y</th>\
						<th>Color</th>\
					 </tr>\
				</thead>\
				<tbody>\
						<tr>\
							<td><input type="text" class="txtX" value="value1"></td>\
							<td><input type="text" class="txtY" value="1"></td>\
							<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
				</tbody>\
			</table>\
			</div>';
				document.getElementById('graphData').innerHTML = buildHTML;
			}
			static buildChartMenu() {
				let buildHTML;
				buildHTML = '<span id="graphData"></span><br/>\
				<button class="btn2" id="" style="width: 200px; height: 30px" onClick="addNewLine()" >Add New Line</button>&nbsp;<button class="btn2 id="" style="width: 200px; height: 30px" onClick="clearData()" 					>Clear Data</button>\
				<br/><br/><button class="btn2 id="" style="width: 200px; height: 30px" onClick="buildSampleChart()" >Build Sample Data</button>\
				<button class="btn2 id="btnBuildGraph" style="width: 200px; height: 30px" onClick="buildGraph()">Build Graph</button>\
				<br/><br/>';
				return buildHTML;
			}
			static buildSampleChart() {
				let buildHTML = '<b><h2 >Bar Chart Builder</h2></b>\
			<br><br><b>Title</b><br/><b><input type="text" value="Sample Chart" id="txtTitle"></b><br/><br/>\
			<div id="contain1">\
			<table id="dataTable1">\
				<thead>\
						<tr>\
							<th>X</th>\
							<th>Y</th>\
						<th>Color</th>\
					 </tr>\
				</thead>\
				<tbody>\
						<tr>\
							<td><input type="text" class="txtX" value="January"></td>\
							<td><input type="text" class="txtY" value="1"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
					 </tr>\
						 <tr>\
							<td><input type="text" class="txtX" value="February"></td>\
							<td><input type="text" class="txtY" value="2.3"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="March"></td>\
							<td><input type="text" class="txtY" value="4"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="April"></td>\
							<td><input type="text" class="txtY" value="6"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="May"></td>\
							<td><input type="text" class="txtY" value="9.9"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="June"></td>\
							<td><input type="text" class="txtY" value="2"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="July"></td>\
							<td><input type="text" class="txtY" value="0.5"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="August"></td>\
							<td><input type="text" class="txtY" value="3"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="September"></td>\
							<td><input type="text" class="txtY" value="4.5"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="October"></td>\
							<td><input type="text" class="txtY" value="7"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="November"></td>\
							<td><input type="text" class="txtY" value="7"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
						<tr>\
							<td><input type="text" class="txtX" value="December"></td>\
							<td><input type="text" class="txtY" value="9"></td>\
						<td><input type="text" class="txtColor" value="' + barChartBuilder.createRandomHexColor() + '"></td>\
						<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
						</tr>\
				</tbody>\
			</table>\
			</div>';
				document.getElementById('graphData').innerHTML = buildHTML;

			//	buildGraph();
			
		}
		
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
				class lineChartBuilder {
			
				static randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
 
				
				constructor(c, canvasObject) {
					this.placeHolder = [];
					this.canvas = canvasObject;
					this.ctx = canvasObject.getContext('2d');
					this.control = c;
					this.canvas.addEventListener("mousemove", this);
					this.largestYValue = "N/A";
					
					this.smallestValue = "N/A";
					
					this.plotRadius = 6;
					
					this.graphBuildMode = false;
					

				}

				createHoverColor(hexColor) {
					let percentage = 60;
					hexColor = hexColor.replace(/^\s*#|\s*$/g, '');
					if(hexColor.length == 3) {
						hexColor = hexColor.replace(/(.)/g, '$1$1');
					}
					var r = parseInt(hexColor.substr(0, 2), 16),
						g = parseInt(hexColor.substr(2, 2), 16),
						b = parseInt(hexColor.substr(4, 2), 16);
					return '#' + ((0 | (1 << 8) + r + (256 - r) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + g + (256 - g) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + b + (256 - b) * percentage / 100).toString(16)).substr(1);
				}

				handleEvent(event) {
					switch(event.type) {
							case "mousemove":
							
								let determineMouseX;
								let determineMouseY;
								let outsideHoverRange = 0.01;
								
								for(x in this.placeHolder) {
									if(this.placeHolder[x].command == "drawPlot") {
										this.placeHolder[x].hoverColor = "";
									} else if(this.placeHolder[x].command == "drawHoverWindow") {
										this.placeHolder.splice(x, 1);
									}
								}

								if(this.placeHolder.length > 0) 
								{
									determineMouseX = parseFloat(this.control.determineMouseXPosition(this.control.eventPageX).toFixed(2));
									determineMouseY = parseFloat(this.control.determineMouseYPosition(this.control.eventPageY).toFixed(2));
									let b1;
									let c1;
												
										for(x in this.placeHolder) {
											
												   b1 = parseFloat(this.placeHolder[x].y)-((this.control.scaleY) / this.plotRadius)  ;
													c1 = parseFloat(this.placeHolder[x].y)+( this.control.scaleY / this.plotRadius) ;
										
													if((determineMouseX <= this.placeHolder[x].x) && (determineMouseX >= this.placeHolder[x].x -(this.plotRadius/this.control.gridSpace))
													|| (determineMouseX >= this.placeHolder[x].x) && (determineMouseX <= this.placeHolder[x].x+(this.plotRadius/this.control.gridSpace)))
													{
														
													 
												
														if((determineMouseY >= this.placeHolder[x].y) && (determineMouseY <=  c1)||
														((determineMouseY <= this.placeHolder[x].y) && (determineMouseY >=b1))) 
														{
															
																//alert(determineMouseY);
																//alert(b1);
														 
 
																		this.placeHolder[x].hoverColor = this.createHoverColor(this.placeHolder[x].color);
																	
																		let placeHolderElement;
																		placeHolderElement = {
																			command: 'drawHoverWindow',
																			x: this.placeHolder[x].x,
																			y: this.placeHolder[x].y,
																			hLabel: this.placeHolder[x].hLabel
																		};
																		this.placeHolder.push(placeHolderElement);
																		updateSettings();
																		return;
																
														}
														
						 
													}

									
										}
										
										updateSettings();
								
								}
								
								break;
								
						
					}
					
					
				}
				
				
				
		formatFont1() {
			switch(this.control.scaleX) {
				case 1:
					return 1.5;
					break;
				case 1.1:
					return 1.4;
					break;
				case 1.2:
					return 1.3;
					break;
				case 1.3:
					return 1.2;
					break;
				case 1.4:
					return 1.1;
					break;
				case 1.5:
					return 1;
					break;
				case 1.6:
					return 0.9;
					break;
				case 1.7:
					return 0.8;
					break;
				case 1.8:
					return 0.7;
					break;
				case 1.9:
					return 0.7;
					break;
				case 2:
					return 0.7;
					break;
				default:
					return 1.5;
			}
		}
		
		drawHoverWindow(counter) {
			let hoverWindowBackground = "#000080";
			let x1, y1;
			x1 = this.placeHolder[counter].x + (this.control.scaleX );
			y1 = this.placeHolder[counter].y;
			y1 = parseFloat(y1);
			y1 = y1 + (this.control.scaleY / 2) + this.control.scaleY;
			let width = this.control.gridSpace * 4;
			let height = -(this.control.scaleY) * 2;
			let totalWidthSpan = x1 + ((this.control.scaleX * 4));
//			if(totalWidthSpan >= c.calculateDomain()[1]) {
				
				
//				x1 = this.placeHolder[counter].x - (this.control.scaleX * 3.75);
				
//				 if(y1 + height <= 0)
//				 {
					 
					 
//						while(y1 + height <= 0)
//						{
//								y1 += 0.5;
//						}
						
//						y1+= 0.1;
//				 }
				
				
				
//				this.fillRectangle(x1, y1, width, height, "#FFFFFF");
//				this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
//			} else {
				
				
//
				 
//				 if(y1 + height <= 0)
//				 {
//						while(y1 + height <= 0)
//						{
//							y1 += 0.5;
//						}
//						
//						y1+= 0.1;
//				 }
				 
//				this.fillRectangle(x1, y1, width, height, "#FFFFFF");
//				this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
//			}

				if(totalWidthSpan >= c.calculateDomain()[1]) {
				x1 = this.placeHolder[counter].x - (this.control.scaleX * 3.75 );
				
				 if(y1 + height <= 0)
				 {
					 
					 
						while(y1 + height <= 0)
						{
								y1 += 0.5;
						}
						
						y1+= 0.1;
				 }
				
				
				
				this.fillRectangle(x1, y1, width, height, "#FFFFFF");
				this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				}
				else
				{
						this.fillRectangle(x1, y1, width, height, "#FFFFFF");
						this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				}
				
				
			let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
			let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
			pointX1 += this.control.gridSpace * 0.25;
			pointY1 += this.control.gridSpace / 2;
			this.ctx.fillStyle = "#000000";
			let xValueOutput = `x: ${this.placeHolder[counter].hLabel} `;
			this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
			//this.ctx.font = ((this.control.gridSpace / 2)) + "px Arial";
			this.ctx.textAlign = "left";
			this.ctx.fillText(xValueOutput, pointX1, pointY1);
			pointY1 += this.control.gridSpace / 2;
			let yValueOutput = `y: ${this.placeHolder[counter].y} `;
			this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
			//this.ctx.font = ((this.control.gridSpace / 2)) + "px Arial";
			this.ctx.textAlign = "left";
			this.ctx.fillText(yValueOutput, pointX1, pointY1);
		}		
				
				static addNewLine() {
					
					let createRandomColor = lineChartBuilder.randomColor;
					
					let table = document.getElementById(dataTableID);
					let tableLength = document.getElementById(dataTableID).rows.length;
					let row = table.insertRow(tableLength);
					let c1 = row.insertCell(0);
					let c2 = row.insertCell(1);
					let c3 = row.insertCell(2);
					let c4 = row.insertCell(3);
					// Add some text to the new cells:
					c1.innerHTML = '<input type="text" class="txtX" value="value1">';
					c2.innerHTML = '<input type="text" class="txtY" value="1"></td>';
					c3.innerHTML = '<input type="text" class="txtColor" value="' + createRandomColor + '">';
					c4.innerHTML = '<button class="deleteLine1"  onClick="deleteRow(this)">X</button>';
				}			
					
				static buildChartMenu() {
						let buildHTML;
						buildHTML = '<span id="graphData"></span><br/>\
						<button class="btn2" id="" style="width: 200px; height: 30px" onClick="addNewLine()" >Add New Line</button>&nbsp;<button class="btn2 id="" style="width: 200px; height: 30px" onClick="clearData()" 					>Clear Data</button>\
						<br/><br/><button class="btn2 id="" style="width: 200px; height: 30px" onClick="buildSampleChart()" >Build Sample Data</button>\
						<button class="btn2 id="btnBuildGraph" style="width: 200px; height: 30px" onClick="buildGraph()">Build Graph</button>\
						<br/><br/>';
						return buildHTML;
				}
				
				
				static buildSampleChart() {
					
					let createRandomColor = lineChartBuilder.randomColor;
					
					let buildHTML = '<b><h2 >Line Chart Builder</h2></b>\
				<br><br><b>Title</b><br/><b><input type="text" value="Sample Chart" id="txtTitle"></b><br/><br/>\
				<div id="contain1">\
				<table id="dataTable1">\
					<thead>\
							<tr>\
								<th>X</th>\
								<th>Y</th>\
							<th>Color</th>\
						 </tr>\
					</thead>\
					<tbody>\
							<tr>\
								<td><input type="text" class="txtX" value="January"></td>\
								<td><input type="text" class="txtY" value="19.9"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor+ '"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
							 <tr>\
								<td><input type="text" class="txtX" value="February"></td>\
								<td><input type="text" class="txtY" value="2.3"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor+ '"></td>\
							<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
							</tr>\
							<tr>\
								<td><input type="text" class="txtX" value="March"></td>\
								<td><input type="text" class="txtY" value="4"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
							<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
							</tr>\
							<tr>\
								<td><input type="text" class="txtX" value="April"></td>\
								<td><input type="text" class="txtY" value="6"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
							<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
							</tr>\
							<tr>\
								<td><input type="text" class="txtX" value="May"></td>\
								<td><input type="text" class="txtY" value="199.9"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
							<td><button class="deleteLine1" onClick="deleteRow(this)">X</button></td>\
							</tr>\
					</tbody>\
				</table>\
				</div>';
					document.getElementById('graphData').innerHTML = buildHTML;
				
			}
				
 
						
				 
				
				static buildNewTable() {
					
					let createRandomColor = lineChartBuilder.randomColor;
					
					let buildHTML = '<b><h2 >Line Chart Builder</h2></b>\
				<br><br><b>Title</b><br/><b><input type="text" value="new title" id="txtTitle"></b><br/><br/>\
				<div id="contain1">\
				<table id="dataTable1">\
					<thead>\
							<tr>\
								<th>X</th>\
								<th>Y</th>\
							<th>Color</th>\
						 </tr>\
					</thead>\
					<tbody>\
							<tr>\
								<td><input type="text" class="txtX" value="value1"></td>\
								<td><input type="text" class="txtY" value="1"></td>\
								<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
								<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
							 </tr>\
					</tbody>\
				</table>\
				</div>';
					document.getElementById('graphData').innerHTML = buildHTML;
				}
				
				drawNumericLabelY(theNumber, pointX, pointY) {
					let count = this.control.countDecimals(theNumber);
					let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
					let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
				drawNumericLabelY2(theNumber, pointX, pointY) {
					let count = this.control.countDecimals(theNumber);
					//let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
					let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
					this.ctx.fillText(theNumber, c.canvasWidth - (c.gridSpace + 15), y);
				}				
				

				strokeRectangle(x1, y1, width, height, color) {
					let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
					let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
					this.ctx.strokeStyle = color;
					let finalHeight;
					finalHeight = height * (this.control.gridSpace / this.control.scaleY);
					finalHeight = -finalHeight;
					this.ctx.strokeRect(pointX1, pointY1, width, finalHeight);
				}
				fillRectangle(x1, y1, width, height, color) {
					let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
					let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
					this.ctx.fillStyle = color;
					let finalHeight;
					finalHeight = height * (this.control.gridSpace / this.control.scaleY);
					finalHeight = -finalHeight;
					this.ctx.fillRect(pointX1, pointY1, width, finalHeight);
				}
				fillRectangle2(x1, y1, width, height, color, stepX, stepY) {
					let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
					let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
					pointX1 -= stepX;
					pointY1 -= stepY;
					this.ctx.fillStyle = color;
					this.ctx.fillRect(pointX1, pointY1, width, height);
				}
				

				 drawCircle(x1, y1, radius, color, borderWidth, borderColor )
				{

					let pointX1 = (this.control.originX+(x1*( (this.control.gridSpace/this.control.scaleX)    )));
					let pointY1 = this.control.originY+-(y1* (this.control.gridSpace/this.control.scaleY)     );
					
					this.ctx.beginPath();
					this.ctx.fillStyle = color;
					//this.ctx.strokeStyle = color ;
					this.ctx.arc(pointX1, pointY1, radius, 0, 2*Math.PI, false);
					this.ctx.fill();
					
					if(borderWidth > 0)
					{
					  this.ctx.lineWidth = borderWidth;
					  this.ctx.strokeStyle = color ;
					  this.ctx.stroke();
					 }
					
					this.ctx.closePath();
					
					
				}				
				drawLine(x1, y1, x2, y2, color) {
					this.ctx.lineWidth = 2;
					this.ctx.strokeStyle = color;
					this.ctx.beginPath();
 
		
					
					var pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
					var pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
					var pointX2 = this.control.originX + (x2 * ((this.control.gridSpace / this.control.scaleX)));
					var pointY2 = this.control.originY + -(y2 * (this.control.gridSpace / this.control.scaleY));
					pointX1 = parseInt(pointX1);
					pointY1 = parseInt(pointY1);
					pointX2 = parseInt(pointX2);
					pointY2 = parseInt(pointY2);
					this.ctx.moveTo(pointX1, pointY1);
					this.ctx.lineTo(pointX2, pointY2);
					//this.ctx.save(); //save context without transformation
					this.ctx.stroke();
					//this.ctx.lineWidth = 1;
					
 
				}				
				
				formatXAlign(x)
				{
					
					let newX = x;
					
					switch(this.control.scaleX)
					{
						case 1.1:
							return newX += 0;
							break;
						case 1.2:
							return newX += 6;
							break;
						case 1.3:
							return newX += 8;
							break;	
						case 1.4:
							return newX += 12;
							break;
						case 1.5:
							return newX += 15;
							break;						
											
					}
					
					
					return newX;
					
				}
				drawHlabel(x1, y1, text) {
					let pointX1 =  (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
					pointX1 -= this.control.gridSpace;
					
					let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
					pointY1 += this.control.gridSpace / 1.5;
					
					this.ctx.fillStyle = "#000000";
					this.ctx.font = "bold 14px Arial";
					this.ctx.textAlign = "center";
					 
					//this.ctx.fillText(text, this.formatXAlign(pointX1), pointY);
					
				//	alert(pointY1);
					
					if(this.control.calculateRange()[1] < -1) {
						
						this.ctx.fillText(text, this.formatXAlign(pointX1), this.control.gridSpace / 2);
					}
					
					else
					{
						this.ctx.fillText(text, this.formatXAlign(pointX1), pointY1);
					}
				}		
				
 
				
				
				drawPlotData(counter) {
					
						let x1 = this.placeHolder[counter].x;
						let y1 = this.placeHolder[counter].y;
						
						const radius = this.plotRadius;
						let circleColor;
						let borderWidth = 0;
						let borderColor = "#000000";
						let lineColor;
						 
						
 						if(this.placeHolder[counter].hoverColor == "") {
							 circleColor = this.placeHolder[counter].color;
						}
						else
						{
							circleColor = this.placeHolder[counter].hoverColor;
						}
						
					 
					 
						
 						 if(counter > 0)
						 {	
					 
								 lineColor = this.placeHolder[counter].color;
								 let x2 = this.placeHolder[counter-1].x;
								 let y2 =  this.placeHolder[counter-1].y; 
								 this.drawLine(x1, y1, x2, y2, lineColor);
								 	 
						 }
						 
						  this.drawCircle(x1,y1, radius, circleColor, borderWidth, borderColor);


 
						 
						 
						 this.drawHlabel(this.placeHolder[counter].x + 1, 0, this.placeHolder[counter].hLabel);
						 
						 
						
				}
				
				
				determineSmallestValue()
				{
					
						let a = "N/A";
						
						
						for(const x in chart.placeHolder) {
							
						 
							
							if(a == "N/A")
							{
								a = chart.placeHolder[x].y;
							}
							
							else
							{
								if(Number(chart.placeHolder[x].y) < Number(a)) {
									a = chart.placeHolder[x].y;
								}

							}
						}
						
						
						
						 
						
						return  a;
					
 
						 
				}
				
				setMouseDragLimit() {
					
 
					
					if(this.smallestValue == "N/A"){
						 
						this.smallestValue = this.determineSmallestValue();
					}
					
 
					
					let downMax;
					
					
					if(this.smallestValue < 0) {
						downMax = this.smallestValue;
						downMax -= (this.control.scaleY);
						
						//alert(downMax);
						
					}
					else {
						downMax = (this.control.scaleY);
						downMax = -downMax;
					}
					
									 
					

					
					try {
						if(this.largestYValue != "N/A") {
							let upMax = this.largestYValue + (this.control.gridSpace * (this.control.scaleY / 2));
							this.control.maxMouseDragLimit = [upMax, "N/A", downMax, -2.5]; // top, right, down, left
						}
					} catch {
					 
						this.control.maxMouseDragLimit = ["N/A", "N/A", downMax, -1]; // top, right, down, left
					}
				}
				
				
				roundUp(scaleY) {
					let value1 = 0;
					if(scaleY > 10 && scaleY <= 100) {
						value1 = 10;
					} else if(scaleY >= 100 && scaleY < 1000) {
						value1 = 100;
					} else if(scaleY >= 1000 && scaleY < 10000) {
						value1 = 1000;
					} else if(scaleY >= 10000 && scaleY < 100000) {
						value1 = 10000;
					} else if(scaleY >= 100000 && scaleY < 1000000) {
						value1 = 100000;
					} else if(scaleY >= 1000000 && scaleY < 10000000) {
						value1 = 1000000;
					}
					if(scaleY >= 1) {
						if(value1 == 10) {
							if(document.getElementById('scaleY') != null) {
								document.getElementById('scaleY').value = value1;
								document.getElementById("scaleY").step = value1;
							} else {
								autoScaleY = value1;
								updateSettings();
							}
						} else {
							let roundTo = Math.ceil(value1 / 100) * 100;
							if(roundTo == 0) {
								roundTo = 1;
							}
							if(document.getElementById('scaleY') != null) {
								document.getElementById('scaleY').value = roundTo;
								document.getElementById("scaleY").step = roundTo;
							} else {
								autoScaleY = roundTo;
								updateSettings();
							}
						}
					} else {
						let lessThanOne = 0.1;
						if(document.getElementById('scaleY') != null) {
							document.getElementById('scaleY').value = lessThanOne;
							document.getElementById("scaleY").step = lessThanOne;
						} else {
							autoScaleY = roundTo;
							updateSettings();
						}
					}
				}


				drawVerticalNumbering() {
					for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
						this.drawNumericLabelY(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
					}
					for(var a = -this.control.scaleY; a > this.control.calculateRange()[0] - this.control.scaleY; a -= this.control.scaleY) {
						this.drawNumericLabelY(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
					} 	
					
				}
				drawVerticalNumbering2() {
					for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
						this.drawNumericLabelY2(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
					}
 					for(var a = -this.control.scaleY; a > this.control.calculateRange()[0] - this.control.scaleY; a -= this.control.scaleY) {
						this.drawNumericLabelY2(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
					}
				}		
				
				buildData(xValues, yValues, hexColors) {
					let placeHolderElement;
					let starterX = 2;
					for(let i = 0; i < xValues.length; i++) {
						placeHolderElement = {
							command: 'drawPlot',
							x: starterX,
							y: yValues[i].value,
							color: hexColors[i].value,
							hoverColor: "",
							hLabel: xValues[i].value
						};
						this.placeHolder.push(placeHolderElement);
						starterX += 3;
					}
				}
				
				determineYScaleIncrementSize(largestValue)
				
				{
					

					return largestValue / 5;
					
				}

				autoAdjustGraph(yValues) {
 					let largestValue = -1;
					let buildArray = [];
					let b1 ;
					
					for(let i = 0; i < yValues.length; i++) {
						if(Math.abs(parseFloat(yValues[i].value)) > largestValue) {
							largestValue = Math.abs(parseFloat(yValues[i].value));
							b1 = this.determineYScaleIncrementSize(largestValue);
						}
					}
					if(largestValue > this.control.calculateRange()[1].toFixed(2)) {
						this.control.scaleY = b1;
						while(largestValue > this.control.calculateRange()[1].toFixed(2)) {
							this.control.scaleY += b1;
							if(document.getElementById('scaleY') != null) {
								document.getElementById('scaleY').value = this.control.scaleY;
							}
						}
					}
					this.largestYValue = largestValue;
					this.roundUp(this.largestYValue);
					this.control.updateSettings();
				}				
				
	
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
			class candlestickChartBuilder {
			constructor(c, canvasObject) {
 
				this.placeHolder = [];
				this.canvas = canvasObject;
				this.ctx = canvasObject.getContext('2d');
				this.control = c;
				this.canvas.addEventListener("mousemove", this);
				this.largestYValue = "N/A";
				
			  this.graphBuildMode = false;
			  
			  this.lastScaleY = -1;
			  this.lastGridSpace = -1;
			  
 
			  
			}
			createHoverColor(hexColor) {
				let percentage = 70;
				hexColor = hexColor.replace(/^\s*#|\s*$/g, '');
				if(hexColor.length == 3) {
					hexColor = hexColor.replace(/(.)/g, '$1$1');
				}
				var r = parseInt(hexColor.substr(0, 2), 16),
					g = parseInt(hexColor.substr(2, 2), 16),
					b = parseInt(hexColor.substr(4, 2), 16);
				return '#' + ((0 | (1 << 8) + r + (256 - r) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + g + (256 - g) * percentage / 100).toString(16)).substr(1) + ((0 | (1 << 8) + b + (256 - b) * percentage / 100).toString(16)).substr(1);
			}
			handleEvent(event) {
				switch(event.type) {
					 
					
					case "mousemove":
 
				 
						
						let determineMouseX;
						let determineMouseY;
						let outsideHoverRange = 0.01;
						let barWidthSpan = (chart.control.scaleX) * 2;
						for(x in this.placeHolder) {
							if(this.placeHolder[x].command == "drawCandleStick") {	
								this.placeHolder[x].hoverColor = "";
							} else if(this.placeHolder[x].command == "drawHoverWindow") {
								this.placeHolder.splice(x, 1);
							}
						}
						if(this.placeHolder.length > 0) {
							
											 
											
							determineMouseX = Number(this.control.determineMouseXPosition(this.control.eventPageX).toFixed(2));
							determineMouseY = Number(this.control.determineMouseYPosition(this.control.eventPageY).toFixed(2));
							for(x in this.placeHolder) {
								
							 
								
								if((determineMouseX <= this.placeHolder[x].x) && (determineMouseX >= this.placeHolder[x].x - outsideHoverRange) || (determineMouseX >= this.placeHolder[x].x) && (determineMouseX <= this.placeHolder[x].x + barWidthSpan + outsideHoverRange)) {
									//if((determineMouseY >= -outsideHoverRange) && (determineMouseY <= (this.placeHolder[x].y))) {
						 
										this.placeHolder[x].hoverColor = this.createHoverColor(this.placeHolder[x].color);
										let placeHolderElement;
										placeHolderElement = {
											command: 'drawHoverWindow',
											x: this.placeHolder[x].x,
											y: this.placeHolder[x].candlestick_open,
											high: this.placeHolder[x].candlestick_high,
											low: this.placeHolder[x].candlestick_low,					
											close: this.placeHolder[x].candlestick_close,			
											hLabel: this.placeHolder[x].hLabel,
											index: x
										};
										
 
 
										
										this.placeHolder.push(placeHolderElement);
										updateSettings();
										return;
									//}
								}
							}
							updateSettings();
						}
						break;
				}
			}
			drawNumericLabelY(theNumber, pointX, pointY) {
				let count = this.control.countDecimals(theNumber);
				let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
				let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
			drawNumericLabelY2(theNumber, pointX, pointY) {
				let count = this.control.countDecimals(theNumber);
				//let x = this.control.originX + (pointX * (this.control.gridSpace / this.control.scaleX));
				let y = this.control.originY + -(pointY * (this.control.gridSpace / this.control.scaleY));
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
				this.ctx.fillText(theNumber, c.canvasWidth - (c.gridSpace + 15), y);
			}
			buildData(candlestick_date, candlestick_open, candlestick_high,
			candlestick_low, candlestick_close) {
 
				
				let placeHolderElement;
				let starterX = 1;
				
				let allSameValuesForTradingDay ;
				
				let i;

				starterX = 1;

				for(i = 0; i < candlestick_date.length; i++) {
					
					
					
					allSameValuesForTradingDay = this.allValuesTheSameForTradingDay(candlestick_open[i].value,candlestick_high[i].value,
					candlestick_low[i].value, candlestick_close[i].value);
							
					
					 
					
					if(!allSameValuesForTradingDay) {	
					
							placeHolderElement = {
								command: 'drawCandleStick',
								x: starterX,
								candlestick_open: candlestick_open[i].value,
								candlestick_high: candlestick_high[i].value,
								candlestick_low: candlestick_low[i].value,
								candlestick_close: candlestick_close[i].value,
								color: "#228B22",
								hoverColor: "",
								hLabel: candlestick_date[i].value
							};
							this.placeHolder.push(placeHolderElement);

							starterX += 5;
					
					}
					
					
					
				}
				
 
				
 
				
			}
			drawVerticalNumbering() {
				for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
					this.drawNumericLabelY(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
				}
			}
			drawVerticalNumbering2() {
				for(var a = this.control.scaleY; a < this.control.calculateRange()[1] + this.control.scaleY; a += this.control.scaleY) {
					this.drawNumericLabelY2(this.control.formatNumericDisplayYScale(a), 0, this.control.formatNumericDisplayYScale(a));
				}
			}
			formatFont1() {
				switch(this.control.scaleX) {
					case 1:
						return 1.5;
						break;
					case 1.1:
						return 1.4;
						break;
					case 1.2:
						return 1.3;
						break;
					case 1.3:
						return 1.2;
						break;
					case 1.4:
						return 1.1;
						break;
					case 1.5:
						return 1;
						break;
					case 1.6:
						return 0.9;
						break;
					case 1.7:
						return 0.8;
						break;
					case 1.8:
						return 0.7;
						break;
					case 1.9:
						return 0.7;
						break;
					case 2:
						return 0.7;
						break;
					default:
						return 1.5;
				}
			}
			drawHoverWindow(counter) {
			
 
				let hoverWindowBackground = "#000080";
				let x1, y1;
				x1 = this.placeHolder[counter].x + (this.control.scaleX * 1.75);
				y1 =  this.placeHolder[counter].y;

				
	 
					
				y1 = parseFloat(y1);
				y1 = y1 + (this.control.scaleY / 2) + this.control.scaleY;
				let width = this.control.gridSpace * 4;
				let height = -(this.control.scaleY) * 2;
				height += height;
				
				let totalWidthSpan = x1 + ((this.control.scaleX * 4));
				
				if(totalWidthSpan >= c.calculateDomain()[1]) {
				
					
					x1 = this.placeHolder[counter].x - (this.control.scaleX * 3.75);
					
					 if(y1 + height <= 0)
					 {
						 
						 
							while(y1 + height <= 0)
							{
									y1 += 0.5;
							}
							
							y1+= 0.1;
					 }
					
					
					
					this.fillRectangle(x1, y1, width, height, "#FFFFFF");
					
					this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				} else {
					
					 
					 
					 if(y1 + height <= 0)
					 {
							while(y1 + height <= 0)
							{
								y1 += 0.5;
							}
							
							y1+= 0.1;
					 }
					 
					this.fillRectangle(x1, y1, width, height, "#FFFFFF");
					this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
				}
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointX1 += this.control.gridSpace * 0.25;
				pointY1 += this.control.gridSpace / 2;
				this.ctx.fillStyle = "#000000";
					
				let dateValueOutput = `Date: ${this.placeHolder[counter].hLabel} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(dateValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;
				
				let openValueOutput = `Open: ${this.placeHolder[counter].y} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(openValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;
				
				let highValueOutput = `High: ${this.placeHolder[counter].high} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(highValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;
								
				
				let lowValueOutput = `Low: ${this.placeHolder[counter].low} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(lowValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;				
				
				
				
				let closeValueOutput = `Close: ${this.placeHolder[counter].close} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(closeValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;				
				
				
				
				
				let dollarChangeValueOutput = `$ Change: ${this.calculateDollarChangeValueOutput(this.placeHolder[counter].index, this.ctx)} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(dollarChangeValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;	

				
				let percentChangeValueOutput = `% Change: ${this.calculatePercentChangeValueOutput(this.placeHolder[counter].index, this.ctx)} `;
				this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
				//this.ctx.font = ((this.control.gridSpace / 2)) + "px Arial";
				this.ctx.textAlign = "left";
				this.ctx.fillText(percentChangeValueOutput, pointX1, pointY1);
				pointY1 += this.control.gridSpace / 2;					
				
 

				
			}
			
			
			calculatePercentChangeValueOutput(index, ctx)
			{
					if(index == 0) {
						return "N/A"
					}
					else {
						
						let currentClose = this.placeHolder[index].candlestick_close;
						let previousClose =  this.placeHolder[index-1].candlestick_close;
						
						let percentChange =  ((currentClose- previousClose) / previousClose) * 100;
						percentChange = percentChange.toFixed(2);
						
						
						if(percentChange >= 0) {
							ctx.fillStyle = "green";
						}
						
						else if(percentChange < 0)
						{
							ctx.fillStyle = "red";
						}
			
						return percentChange + '%';
					}
					
					return 0;			
			}
			
			calculateDollarChangeValueOutput(index, ctx)
			{

					if(index == 0) {
						return "N/A"
					}
					else {
						
						let calculate1 = (this.placeHolder[index].candlestick_close - this.placeHolder[index-1].candlestick_close).toFixed(2);
						
						if(calculate1 >= 0) {
							ctx.fillStyle = "green";
						}
						
						else if(calculate1 < 0)
						{
							ctx.fillStyle = "red";
						}
						
						return '$'+calculate1;

						
					}
					
					return 0;
				
			}
			
			
			determineCandleStickColor(counter) {
					
				if(counter == 0) {
					let currentDayOpen = parseFloat(this.placeHolder[counter].candlestick_open);
					let currentDayClose = parseFloat(this.placeHolder[counter].candlestick_close);
					
					if(currentDayClose < currentDayOpen) {
						return "#FF4500	";
					}
					else {
						return "#65b253";
					}
 
				}
				
				else
				{
					
					let previousDay = parseFloat(this.placeHolder[counter-1].candlestick_close);
					let currentDay = parseFloat(this.placeHolder[counter].candlestick_close);
					
					if(previousDay < currentDay) {
						return "#65b253";
					}
					else if(previousDay > currentDay) {
						return "#FF4500	";
					}
					else if(previousDay == currentDay) {
							return "#65b253";
					}
				
				}
	 
			}
		

			
			allValuesTheSameForTradingDay(candlestick_open,candlestick_high,candlestick_low,candlestick_close) {
			
 
					
					if(     (candlestick_open) == (candlestick_close) && (candlestick_open) == (candlestick_high) &&
							(candlestick_open) == candlestick_low)
							{	
								 
								return true; 
							}
							
							 
							
							return false; 
			}
			
			
			
 
			
			
			drawCandlestick(counter) {
				
					let candlestickHigh = parseFloat(this.placeHolder[counter].candlestick_high);
					let candlestickLow = parseFloat(this.placeHolder[counter].candlestick_low);	
					
					let candlestickWidth = parseFloat((this.control.gridSpace * 2) / 2) ;
					
					let x = this.placeHolder[counter].x  ;
					let xPos = x+this.control.scaleX;
					
					let candlestickColor = this.determineCandleStickColor(counter);
					let candlestickXPos = this.placeHolder[counter].x;
					
					let candlestickOpen;
					let candlestickPreviousClose;	
					
					let a;
					
						if(this.placeHolder[counter].hoverColor == "") {
							
							
 
							
							if(counter > 0 )
							{
								candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
								candlestickPreviousClose = parseFloat(this.placeHolder[counter-1].candlestick_close);
							}
							
							else
							{
								candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
								candlestickPreviousClose = parseFloat(this.placeHolder[counter].candlestick_close);
							}

							 
								this.drawLine2(xPos, candlestickHigh, xPos, candlestickLow, "#000");						
								candlestickWidth = (this.control.gridSpace * 2) ;
							//	let calc1 = candlestickOpen-(candlestickPreviousClose);
								
							   a = candlestickOpen-(this.placeHolder[counter].candlestick_close);
			
							
								if(candlestickOpen > candlestickPreviousClose) {

										this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth,  a, candlestickColor);
								}
								else if(candlestickPreviousClose > candlestickOpen) {
										this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickColor);

								}
								
								
								else if(candlestickPreviousClose == candlestickOpen) { 
									
									this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickColor);
								}
								
		 
								
						} else {
							
									if(counter > 0 )
									{
										candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
										candlestickPreviousClose = parseFloat(this.placeHolder[counter-1].candlestick_close);
									}
									
									else
									{
										candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
										candlestickPreviousClose = parseFloat(this.placeHolder[counter].candlestick_close);
									} 
									
									
									this.drawLine2(xPos, candlestickHigh, xPos, candlestickLow, "#000");			

									let candlestickHoverColor;							
									candlestickWidth = (this.control.gridSpace * 2) ;						

									candlestickColor = this.determineCandleStickColor(counter);
									candlestickHoverColor = this.createHoverColor(this.determineCandleStickColor(counter));
								 
									a = candlestickOpen-(this.placeHolder[counter].candlestick_close);						
								 
									this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickHoverColor);
							
						}

						this.positionHLabel(counter);

			}
			
			positionHLabel(counter) {
				 
				 let range =this.control.calculateRange()[0] ;
				 let scaleY = this.control.scaleY;
		 
				 
				 if(range < 0)
				 {
					this.drawHlabel(this.placeHolder[counter].x + 1, 0, this.placeHolder[counter].hLabel);
				 }
				 
				 else
				 {
					this.drawHlabel(this.placeHolder[counter].x + 1, range+scaleY, this.placeHolder[counter].hLabel);				 
				 }
			}
			
 
			getHighestCandleStickHighInRange() {
				
					Array.prototype.max = function() {
					  return Math.max.apply(null, this);
					};
 
				
					let domainLower = c.calculateDomain()[0];
					let domainUpper = c.calculateDomain()[1];		
					
					let collectDatesWithinRange = [];
								
					chart.placeHolder.forEach((element, index) =>  {
						
					let domainLower = c.calculateDomain()[0];
					let domainUpper = c.calculateDomain()[1];		
		
								if(element.x >= domainLower && element.x <= domainUpper) {
										if(element.command  == 'drawCandleStick') {
										
												collectDatesWithinRange.push(element);
										}
								}
					
				});

				let collectHighs = [];
				
 				collectDatesWithinRange.forEach((element, index) =>
				
				{
					collectHighs.push(parseFloat(element.candlestick_high));

				}
				);
				
				
				
				//let maxValue = collectLows.reduce((a, b) => Math.min(a, b));
				
				let maxValue = Math.max.apply(null, collectHighs);
				
		 
				
				let index1;
				
 				collectDatesWithinRange.forEach((element, index) =>
				
				{
					
				if(parseFloat(element.candlestick_high) ==maxValue) {
					

					
					index1 = index;
						
				}});
				
				
		 
				
				return index1;				
				
			}
			
			
			getLowestCandleStickLowInRange() {
				
 
					
					let domainLower = c.calculateDomain()[0];
					let domainUpper = c.calculateDomain()[1];		
					
					let collectDatesWithinRange = [];
								
					chart.placeHolder.forEach((element, index) =>  {
						
					let domainLower = c.calculateDomain()[0];
					let domainUpper = c.calculateDomain()[1];		
		
								if(element.x >= domainLower && element.x <= domainUpper) {
										if(element.command  == 'drawCandleStick') {
										
												collectDatesWithinRange.push(element);
										}
								}
					
				});

				let collectLows = [];
				
 				collectDatesWithinRange.forEach((element, index) =>
				
				{
					collectLows.push(parseFloat(element.candlestick_low));

				}
				);
				

				let minValue = collectLows.reduce((a, b) => Math.min(a, b));
				
				let index1;
				
 				collectDatesWithinRange.forEach((element, index) =>
				
				{
					
				if(parseFloat(element.candlestick_low) ==minValue) {
					
 
 
					
					index1 = index;
						
				}});
				return index1;
			}					
			
			
			
			
			setMouseDragLimit() {
				
 
				
				let downMax = (this.control.scaleY);
				downMax = -downMax;
				
 
				try {
					if(this.largestYValue != "N/A") {
						let upMax = this.largestYValue + (this.control.gridSpace * (this.control.scaleY / 2));
						this.control.maxMouseDragLimit = ["N/A", "N/A", downMax, -2.5]; // top, right, down, left
					}
				} catch {
					this.control.maxMouseDragLimit = ["N/A", "N/A", downMax, -1]; // top, right, down, left
				}
			}
			roundUp(scaleY) {
				
 
				
				let value1 = 0;
				if(scaleY > 1 && scaleY <= 10) {
					value1 = 5;
				} 
				else if(scaleY >= 10 && scaleY < 20) {
					value1 = 10;
				}					
				else if(scaleY >= 20 && scaleY < 50) {
					value1 = 20;
				}
				else if(scaleY >= 50 && scaleY < 100) {
					value1 = 50;
				}
				else if(scaleY >= 100 && scaleY < 1000) {
					value1 = 50 ;
				} else if(scaleY >= 1000 && scaleY < 10000) {
					value1 = 1000;
				} else if(scaleY >= 10000 && scaleY < 100000) {
					value1 = 10000;
				} else if(scaleY >= 100000 && scaleY < 1000000) {
					value1 = 100000;
				} else if(scaleY >= 1000000 && scaleY < 10000000) {
					value1 = 1000000;
				}
				else if(scaleY >= 10000000 && scaleY < 100000000) {
					value1 = 10000000;
				}			
				else if(scaleY >= 100000000 && scaleY < 1000000000) {
					value1 = 100000000;
				}						

			}
			
			determineYScaleIncrementSize(largestValue)	
			{
				return largestValue / 5;		
			}		
		
			autoAdjustGraph2(yValues) {
				
		 


										
				let largestValue = -1;
				let buildArray = [];
				let b1 ;
				for(let i = 0; i < yValues.length; i++) {
					if(parseFloat(yValues[i].value) > largestValue) {
						largestValue = parseFloat(yValues[i].value);
						b1 = this.determineYScaleIncrementSize(largestValue);
					}
				}
				
				if(largestValue > this.control.calculateRange()[1].toFixed(2)) {
					this.control.scaleY = b1;
					while(largestValue > this.control.calculateRange()[1].toFixed(2)) {
						this.control.scaleY += b1;
						if(document.getElementById('scaleY') != null) {
							document.getElementById('scaleY').value = this.control.scaleY;
						}
					}
				}
				this.largestYValue = largestValue;
				this.roundUp(this.largestYValue);
				this.control.updateSettings();
			}
 
			
			alignHLabel(pointX1) {
				let a;
				switch(this.control.scaleX) {
					case 1:
						a = 0;
						break;
					case 1.1:
						a = 1;
						break;
					case 1.2:
						a = 2;
						break;
					case 1.3:
						a = 4;
						break;
					case 1.4:
						a = 10;
						break;
					case 1.5:
						a = 10;
						break;
					case 1.6:
						a = 10;
						break;
					case 1.7:
						a = 15;
						break;
					case 1.8:
						a = 15;
						break;
					case 1.9:
						a = 15;
						break;
					case 2:
						a = 15;
						break;
				}
				return pointX1 + a;
			}
			hLabelDetermineFontSize() {
				switch(this.control.scaleX) {
					case 1:
						return((this.control.gridSpace / 2) / this.control.scaleX);
						break;
					case 1.1:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 1;
						break;
					case 1.2:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 2;
						break;
					case 1.3:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 2;
						break;
					case 1.4:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.5:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.6:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.7:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.8:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 1.9:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					case 2:
						return((this.control.gridSpace / 2) / this.control.scaleX) + 3;
						break;
					default:
						return 1.5;
				}
				return((this.control.gridSpace / 2) / this.control.scaleX);
			}
			drawHlabel(x1, y1, text) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointY1 += this.control.gridSpace / 1.5;
				pointX1 = this.alignHLabel(pointX1);
				this.ctx.fillStyle = "#000000";
				//this.ctx.font = ((this.control.gridSpace / 2)/this.control.scaleX) + "px Arial";
				this.ctx.font = this.hLabelDetermineFontSize() + "px Arial";
				this.ctx.textAlign = "center";
				this.ctx.fillText(text, pointX1, pointY1);
			}
			strokeRectangle(x1, y1, width, height, color) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				this.ctx.strokeStyle = color;

				let finalHeight;
				finalHeight = height * (this.control.gridSpace / this.control.scaleY);
				finalHeight = -finalHeight;
				this.ctx.strokeRect(pointX1, pointY1, width, finalHeight);
			}
			fillRectangle(x1, y1, width, height, color) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				this.ctx.fillStyle = color;

				let finalHeight;
				finalHeight = height * (this.control.gridSpace / this.control.scaleY);
				finalHeight = -finalHeight;

				this.ctx.fillRect(pointX1, pointY1, width, finalHeight);
			}
			fillRectangle2(x1, y1, width, height, color, stepX, stepY) {
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				pointX1 -= stepX;
				pointY1 -= stepY;
				this.ctx.fillStyle = color;
				this.ctx.fillRect(pointX1, pointY1, width, height);
			}
			
 
			
			fillRectangle3(x1, y1, width, height, color) {
				
				this.ctx.beginPath();
				
				let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				
				this.ctx.fillStyle = color;
				//this.ctx.strokeStyle = '#000000';

				let finalHeight;
				finalHeight = height * (this.control.gridSpace / this.control.scaleY);
				finalHeight = -finalHeight;

				this.ctx.fillRect(pointX1, pointY1, width, finalHeight);
				
				this.ctx.closePath();
				
				
				this.ctx.beginPath();
				this.ctx.strokeStyle = "#000";
				this.ctx.strokeRect(pointX1, pointY1, width, finalHeight);				
 
				
				this.ctx.closePath();
				
			}		
			
			
			drawLine(x1, y1, x2, y2) {
				this.ctx.lineWidth = 3;
				this.ctx.strokeStyle = "red";
				this.ctx.beginPath();
				var pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				var pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				var pointX2 = this.control.originX + (x2 * ((this.control.gridSpace / this.control.scaleX)));
				var pointY2 = this.control.originY + -(y2 * (this.control.gridSpace / this.control.scaleY));
				pointX1 = parseInt(pointX1);
				pointY1 = parseInt(pointY1);
				pointX2 = parseInt(pointX2);
				pointY2 = parseInt(pointY2);
				this.ctx.moveTo(pointX1, pointY1);
				this.ctx.lineTo(pointX2, pointY2);
				this.ctx.save(); //save context without transformation
				this.ctx.stroke();
				this.ctx.lineWidth = 1;
			}
			
			drawLine2(x1, y1, x2, y2, color) {
				
				this.ctx.beginPath();
				
				this.ctx.lineWidth = 3;
				this.ctx.strokeStyle = color;
				 
				var pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
				var pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
				var pointX2 = this.control.originX + (x2 * ((this.control.gridSpace / this.control.scaleX)));
				var pointY2 = this.control.originY + -(y2 * (this.control.gridSpace / this.control.scaleY));
				pointX1 = parseInt(pointX1);
				pointY1 = parseInt(pointY1);
				pointX2 = parseInt(pointX2);
				pointY2 = parseInt(pointY2);
				this.ctx.moveTo(pointX1, pointY1);
				this.ctx.lineTo(pointX2, pointY2);
				//this.ctx.save(); //save context without transformation
				this.ctx.stroke();
				this.ctx.lineWidth = 1;
			}		
			
			static buildSampleChart() {

				buildNewTable();


			}
			
			static buildNewTable() {
				
 
				 
				
				let buildHTML = '<b><h2 >Candlestick Chart Builder</h2></b>\
			<br><br><b>Title</b><br/><b><input type="text" value="AAPL" id="txtTitle"></b><br/><br/>\
			<div id="contain1">\
			<table id="dataTable1">\
				<thead>\
						<tr>\
							<th>Date</th>\
							<th>Open</th>\
							<th>High</th>\
							<th>Low</th>\
							<th>Close</th>\
					 </tr>\
				</thead>\
				<tbody>\
						<tr>\
							<td><input type="text" class="candlestick_date" value="5/17/2017"></td>\
							<td><input type="text" class="candlestick_open" value="4.40"></td>\
							<td><input type="text" class="candlestick_high" value="4.64"></td>\
							<td><input type="text" class="candlestick_low" value="3.42"></td>\
							<td><input type="text" class="candlestick_close" value="2.56"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
						<tr>\
							<td><input type="text" class="candlestick_date" value="5/18/2017"></td>\
							<td><input type="text" class="candlestick_open" value="3.81"></td>\
							<td><input type="text" class="candlestick_high" value="4.33"></td>\
							<td><input type="text" class="candlestick_low" value="3.78"></td>\
							<td><input type="text" class="candlestick_close" value="4.13"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
						<tr>\
							<td><input type="text" class="candlestick_date" value="5/19/2017"></td>\
							<td><input type="text" class="candlestick_open" value="4.34"></td>\
							<td><input type="text" class="candlestick_high" value="4.49"></td>\
							<td><input type="text" class="candlestick_low" value="4.15"></td>\
							<td><input type="text" class="candlestick_close" value="4.26"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
						<tr>\
							<td><input type="text" class="candlestick_date" value="5/22/2017"></td>\
							<td><input type="text" class="candlestick_open" value="4.5"></td>\
							<td><input type="text" class="candlestick_high" value="4.64"></td>\
							<td><input type="text" class="candlestick_low" value="4.22"></td>\
							<td><input type="text" class="candlestick_close" value="7.79"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\	
				</tbody>\
			</table>\
			</div>';
				document.getElementById('graphData').innerHTML = buildHTML;
			}
			static buildChartMenu() {
				let buildHTML;
				buildHTML = '<span id="graphData"></span><br/>\
				<button class="btn2 id="btnBuildGraph" style="width: 200px; height: 30px" onClick="buildGraph()">Build Graph</button>\&nbsp;\
				<button class="btn2 id="btnBuildGraph" style="width: 200px; height: 30px" onClick="getCandlestickCSVFileList()">Import CSV File</button>\
				<br/><br/>';
				return buildHTML;
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
		//document.getElementById("dataTable1").deleteRow(rowNumber); 
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
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 3) {
 
			 
			c.h1 = -c.gridSpace;
			c.h2 += c.scaleX;
			
			if(!chart.graphBuildMode)
			{
					c.originX -= 1;
			}
			else
			{
					c.originX -= c.gridSpace;
			}			
			//c.originX -= 1;
			c.startYAxis_X = c.originX;
			c.startYAxis_Y = 0;
			c.endYAxis_X = c.originX;
			c.endYAxis_Y = c.canvasHeight;
			c.domain += c.scaleX;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 2) {
			//alert("direction 2");
			c.v1 = c.gridSpace;
			c.v2 += c.scaleY;
			
			if(!chart.graphBuildMode)
			{
				c.originY += 1;
			}
			else
			{
					c.originY += c.gridSpace;
			}
			
//			c.originY += 1;
	
			c.startXAxis_X = 0;
			c.startXAxis_Y = c.originY;
			c.endXAxis_X = c.canvasWidth;
			c.endXAxis_Y = c.originY;
			c.range += c.scaleY;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 0) {
			 
			c.v1 = c.gridSpace;
			c.v2 += c.scaleY;
			c.originY -= 1;
			c.startXAxis_X = 0;
			c.startXAxis_Y = c.originY;
			c.endXAxis_X = c.canvasWidth;
			c.endXAxis_Y = c.originY;
			c.range += c.scaleY;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
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
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 1) {
			c.h1 = c.gridSpace;
			c.h2 -= c.scaleX;
			c.originX += c.h1;
			c.startYAxis_X = c.originX;
			c.startYAxis_Y = 0;
			c.endYAxis_X = c.originX;
			c.endYAxis_Y = c.canvasHeight;
			c.domain += c.scaleX;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
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
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 0) {
			c.v1 = c.gridSpace;
			c.v2 -= c.scaleY;
			c.originY -= c.v1;
			c.startXAxis_X = 0;
			c.startXAxis_Y = c.originY;
			c.endXAxis_X = c.canvasWidth;
			c.endXAxis_Y = c.originY;
			c.range += c.scaleY;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
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
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 1) {
			c.h1 = c.gridSpace;
			c.h2 -= c.scaleX;
			c.originX += c.h1;
			c.startYAxis_X = c.originX;
			c.startYAxis_Y = 0;
			c.endYAxis_X = c.originX;
			c.endYAxis_Y = c.canvasHeight;
			c.domain += c.scaleX;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
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
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		} else if(theDirection == 0) {
			c.v1 = c.gridSpace;
			c.v2 -= c.scaleY;
			c.originY -= c.v1;
			c.startXAxis_X = 0;
			c.startXAxis_Y = c.originY;
			c.endXAxis_X = c.canvasWidth;
			c.endXAxis_Y = c.originY;
			c.range += c.scaleY;
			if(chartType == "candlestick_chart") {
				updateSettings();
			}

			else
			{
				updateSettings();
			}
		}
	}


	function updateSettings3() {


 
		
		
		
//const mouseoverEvent = new Event('mouseover');

//canvas.dispatchEvent(mouseoverEvent);	
		
		
	}
	
	function updateSettings2() {
 
	}
	

	function updateSettings() {
		
		
		switch(chartType) 
		{
			
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


						if(chart != undefined && chart.placeHolder.length > 0 ) {
							
							
							
							 
							
			
								if((this.lastScaleY == -1 || this.lastGridSpace == -1) || (parseFloat(this.lastScaleY) != parseFloat(c.scaleY) || parseFloat(this.lastGridSpace) != parseFloat(c.gridSpace)) ) 
								{
									
									
												 
												
										let rangeLower = c.calculateRange()[0];
										let rangeUpper = c.calculateRange()[1];		
									
											
										let domainLower = c.calculateDomain()[0];
										let domainUpper = c.calculateDomain()[1];
										
		 
										let highVal = chart.getHighestCandleStickHighInRange();
										let compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high)+parseFloat(c.scaleY) < parseFloat(rangeLower);
										
										
										
										
 
										
										
										if(compare1) {
											
											while(compare1) {
												
												rangeLower = c.calculateRange()[0];
												compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high)+parseFloat(c.scaleY) < parseFloat(rangeLower);
												c.v1 = c.gridSpace;
												c.originY -= c.v1;
											}	
								
											 
										}		
									 

										let lowVal = chart.getLowestCandleStickLowInRange();
										let compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_low)> parseFloat(rangeUpper);
										
										

										if(compare2) {
											
								 
											
											while(compare2) {

												   
													rangeUpper= c.calculateRange()[1];
													//compare2 = parseFloat(chart.placeHolder[0].candlestick_low)> parseFloat(rangeUpper);
													compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_high)> parseFloat(rangeUpper);
													
													c.v1 = c.gridSpace;
													c.originY += c.v1;

											}				
									 
											
												  //return;
												
										}
										
								
								
										this.lastScaleY = c.scaleY;
										this.lastGridSpace = c.gridSpace;
										
										 
										
								}
								

						}
 


/////////////////////////////////
						if(chart != undefined) {
							chart.setMouseDragLimit();
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
						
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
/////////////////////////////////////////		
		
		
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
						
		}
		
		else
		{
			
	 
			
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
		//document.getElementById('footer').innerHTML =  buildFooterHTML();
		//document.getElementById('footer').innerHTML =  "";
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
			//let xyCheckStatus = document.getElementById('xy_tracking');
			//functions = new drawFunctionClass(c, c.canvas, xyCheckStatus.checked);
		}
		document.getElementById('column3').innerHTML = buildColumn3Data();
		// barChartBuilder.buildNewTable();
		buildNewTable();
		drawAllElements();
		updateSettings();
	}

	function buildNewTable() {	
 
 		switch(chartType)
		{
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

 		switch(chartType)
		{
				case 'barchart':
				//	alert("barchart menu data build");
					return barChartBuilder.buildChartMenu();
					break;
				case 'linechart':
					return lineChartBuilder.buildChartMenu();
					break;
				case "candlestick_chart":
			//		alert("cand menu data build");
					return candlestickChartBuilder.buildChartMenu();
					break;
		}
		
		

	}

	function buildSampleChart() {
 		switch(chartType)
		{
			
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
		
 		switch(chartType)
		{
			
				case 'barchart':
					barChartBuilder.addNewLine();
					break;
				case 'linechart':
					lineChartBuilder.addNewLine();
					break;
 
					
		}
	}
	
	
	function FireEvent( ElementId, EventName )
{
    if( document.getElementById(ElementId) != null )    
    {   
        if( document.getElementById( ElementId ).fireEvent ) 
        {
            document.getElementById( ElementId ).fireEvent( 'on' + EventName );     
        }
        else 
        {   
            var evObj = document.createEvent( 'Events' );
            evObj.initEvent( EventName, true, false );
            document.getElementById( ElementId ).dispatchEvent( evObj );
        }
    }
}

	function buildGraph() {
		
		
 
	 
 
				   
 		switch(chartType)
		{
			
			
 
			
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
		
		
 
 
		//let candlestick_date = document.querySelectorAll('.candlestick_date');
		//let candlestick_open = document.querySelectorAll('.candlestick_open');
		//let candlestick_high = document.querySelectorAll('.candlestick_high');
		//let candlestick_low = document.querySelectorAll('.candlestick_low');
		//let candlestick_close = document.querySelectorAll('.candlestick_close');
		//chart.buildData(candlestick_date, candlestick_open, candlestick_high,
		//	candlestick_low, candlestick_close);
		
		if(chartType == 'barchart' || chartType == 'linechart') {
		let xValues = document.querySelectorAll('.txtX');
		let yValues = document.querySelectorAll('.txtY');
		let hexColors = document.querySelectorAll('.txtColor');
		chart.buildData(xValues, yValues, hexColors);
		
		chart.autoAdjustGraph(yValues);
		
		}
		else if(chartType == 'candlestick_chart') {
			
 
			
			let candlestick_date = document.querySelectorAll('.candlestick_date');
			let candlestick_open = document.querySelectorAll('.candlestick_open');
			let candlestick_high = document.querySelectorAll('.candlestick_high');
			let candlestick_low = document.querySelectorAll('.candlestick_low');
			let candlestick_close = document.querySelectorAll('.candlestick_close');
			chart.buildData(candlestick_date, candlestick_open, candlestick_high,
				candlestick_low, candlestick_close);	
				
  			 
			//chart.autoAdjustGraph(candlestick_high);
 			//document.getElementById('MyCanvas').dispatchEvent(new MouseEvent("mousemove", {  document.getElementById('scaleX').value = '1.5';}));
			
			
			
			
 
			
			
			
			
			
			
			
			
			
			
			chart.autoAdjustGraph2(candlestick_high);
			
			
			
			

			
 
			
										
 
			

 
			
			
			
			
			
			
			

 
		}
		
 	 
		
		drawAllElements();
		
		//if(chartType !== "candlestick_chart") {
		  //}
		
		//c.maxMouseDragLimit = ["N/A", "N/A", "N/A","N/A"];
		let graphName = document.getElementById('txtTitle').value;
		document.getElementById('title1').innerHTML = "<b>" + graphName + "</b>";
		
		chart.graphBuildMode = false;
		
		
		
		
		
		
		////////
		centerOriginToScreen();
		////////
		
		
		
		
		
		
		
	  if(chartType == 'candlestick_chart') {
		  
		 
 
 
				
				if( chart.placeHolder.length > 0 ) {
					
 
						
											 
							let rangeLower = c.calculateRange()[0];
							let rangeUpper = c.calculateRange()[1];		
						
								
							let domainLower = c.calculateDomain()[0];
							let domainUpper = c.calculateDomain()[1];
							
							 
					 
							let highVal = chart.getHighestCandleStickHighInRange();
							let compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high)+parseFloat(c.scaleY) < parseFloat(rangeLower);
							
		 
				
							if(compare1) {
								
												 
													 
								while(compare1) {
									 
									
									rangeLower = c.calculateRange()[0];
									compare1 = parseFloat(chart.placeHolder[highVal].candlestick_high)+parseFloat(c.scaleY) < parseFloat(rangeLower);
									c.v1 = c.gridSpace;
									c.originY -= c.v1;
								}	
					
								 
							}		
						 

							let lowVal = chart.getLowestCandleStickLowInRange();
							let compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_low)> parseFloat(rangeUpper);
							
							

							if(compare2) {
	 
 
								
								while(compare2) {

									   
										rangeUpper= c.calculateRange()[1];
										//compare2 = parseFloat(chart.placeHolder[0].candlestick_low)> parseFloat(rangeUpper);
										compare2 = parseFloat(chart.placeHolder[lowVal].candlestick_high)> parseFloat(rangeUpper);
										
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

	function getValue() {

	}

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
		//try {
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
						c.ctx.moveTo(c.canvasWidth -  (c.gridSpace+10), 0);
						c.ctx.lineTo(c.canvasWidth - (c.gridSpace+10), c.canvasHeight);
						c.ctx.stroke();
 

 
 
 
				}
			}
			//}
		}
		//catch(e) {}
		
 
		
	}
	if(typeof beginInit == 'undefined') {
		let beginInit;
		beginInit = setTimeout(buildData, 1);
		
 
	}
} catch {}