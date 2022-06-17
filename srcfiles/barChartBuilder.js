class barChartBuilder {
	constructor(c, canvasObject, chart) {
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
				let barWidthSpan = (this.control.scaleX) * 2;
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
			if(y1 + height <= 0) {
				while(y1 + height <= 0) {
					y1 += 0.5;
				}
				y1 += 0.1;
			}
			this.fillRectangle(x1, y1, width, height, "#FFFFFF");
			this.strokeRectangle(x1, y1, width, height, hoverWindowBackground);
		} else {
			if(y1 + height <= 0) {
				while(y1 + height <= 0) {
					y1 += 0.5;
				}
				y1 += 0.1;
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
		this.ctx.textAlign = "left";
		this.ctx.fillText(xValueOutput, pointX1, pointY1);
		pointY1 += this.control.gridSpace / 2;
		let yValueOutput = `y: ${this.placeHolder[counter].y} `;
		this.ctx.font = "bold " + ((this.control.gridSpace / 2) / (this.control.scaleX * this.formatFont1())) + "px Arial";
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
		} else if(scaleY >= 10000000 && scaleY < 100000000) {
			value1 = 10000000;
		} else if(scaleY >= 100000000 && scaleY < 1000000000) {
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
	determineYScaleIncrementSize(largestValue) {
		return largestValue / 5;
	}
	autoAdjustGraph(yValues) {
		let largestValue = -1;
		let buildArray = [];
		let b1;
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
	}
}