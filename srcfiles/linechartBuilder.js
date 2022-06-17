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
				if(this.placeHolder.length > 0) {
					determineMouseX = parseFloat(this.control.determineMouseXPosition(this.control.eventPageX).toFixed(2));
					determineMouseY = parseFloat(this.control.determineMouseYPosition(this.control.eventPageY).toFixed(2));
					let b1;
					let c1;
					for(x in this.placeHolder) {
						b1 = parseFloat(this.placeHolder[x].y) - ((this.control.scaleY) / this.plotRadius);
						c1 = parseFloat(this.placeHolder[x].y) + (this.control.scaleY / this.plotRadius);
						if((determineMouseX <= this.placeHolder[x].x) && (determineMouseX >= this.placeHolder[x].x - (this.plotRadius / this.control.gridSpace)) || (determineMouseX >= this.placeHolder[x].x) && (determineMouseX <= this.placeHolder[x].x + (this.plotRadius / this.control.gridSpace))) {
							if((determineMouseY >= this.placeHolder[x].y) && (determineMouseY <= c1) || ((determineMouseY <= this.placeHolder[x].y) && (determineMouseY >= b1))) {
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
		x1 = this.placeHolder[counter].x + (this.control.scaleX);
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
	static addNewLine() {
		let createRandomColor = lineChartBuilder.randomColor;
		let table = document.getElementById(dataTableID);
		let tableLength = document.getElementById(dataTableID).rows.length;
		let row = table.insertRow(tableLength);
		let c1 = row.insertCell(0);
		let c2 = row.insertCell(1);
		let c3 = row.insertCell(2);
		let c4 = row.insertCell(3);
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
							<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
							<td><button class="deleteLine1"  onClick="deleteRow(this)">X</button></td>\
						 </tr>\
							 <tr>\
								<td><input type="text" class="txtX" value="February"></td>\
								<td><input type="text" class="txtY" value="2.3"></td>\
							<td><input type="text" class="txtColor" value="' + createRandomColor + '"></td>\
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
	drawCircle(x1, y1, radius, color, borderWidth, borderColor) {
		let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
		let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.arc(pointX1, pointY1, radius, 0, 2 * Math.PI, false);
		this.ctx.fill();
		if(borderWidth > 0) {
			this.ctx.lineWidth = borderWidth;
			this.ctx.strokeStyle = color;
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
		this.ctx.stroke();
	}
	formatXAlign(x) {
		let newX = x;
		switch(this.control.scaleX) {
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
		let pointX1 = (this.control.originX + (x1 * ((this.control.gridSpace / this.control.scaleX))));
		pointX1 -= this.control.gridSpace;
		let pointY1 = this.control.originY + -(y1 * (this.control.gridSpace / this.control.scaleY));
		pointY1 += this.control.gridSpace / 1.5;
		this.ctx.fillStyle = "#000000";
		this.ctx.font = "bold 14px Arial";
		this.ctx.textAlign = "center";
		if(this.control.calculateRange()[1] < -1) {
			this.ctx.fillText(text, this.formatXAlign(pointX1), this.control.gridSpace / 2);
		} else {
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
		} else {
			circleColor = this.placeHolder[counter].hoverColor;
		}
		if(counter > 0) {
			lineColor = this.placeHolder[counter].color;
			let x2 = this.placeHolder[counter - 1].x;
			let y2 = this.placeHolder[counter - 1].y;
			this.drawLine(x1, y1, x2, y2, lineColor);
		}
		this.drawCircle(x1, y1, radius, circleColor, borderWidth, borderColor);
		this.drawHlabel(this.placeHolder[counter].x + 1, 0, this.placeHolder[counter].hLabel);
	}
	determineSmallestValue() {
		let a = "N/A";
		for(const x in this.control.placeHolder) {
			if(a == "N/A") {
				a = this.control.placeHolder[x].y;
			} else {
				if(Number(this.control.placeHolder[x].y) < Number(a)) {
					a = this.control.placeHolder[x].y;
				}
			}
		}
		return a;
	}
	setMouseDragLimit() {
		if(this.smallestValue == "N/A") {
			this.smallestValue = this.determineSmallestValue();
		}
		let downMax;
		if(this.smallestValue < 0) {
			downMax = this.smallestValue;
			downMax -= (this.control.scaleY);
		} else {
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
	determineYScaleIncrementSize(largestValue) {
		return largestValue / 5;
	}
	autoAdjustGraph(yValues) {
		let largestValue = -1;
		let buildArray = [];
		let b1;
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
 
 
 

 