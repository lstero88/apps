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
	buildData(candlestick_date, candlestick_open, candlestick_high, candlestick_low, candlestick_close) {
		let placeHolderElement;
		let starterX = 1;
		let allSameValuesForTradingDay;
		let i;
		starterX = 1;
		for(i = 0; i < candlestick_date.length; i++) {
			allSameValuesForTradingDay = this.allValuesTheSameForTradingDay(candlestick_open[i].value, candlestick_high[i].value, candlestick_low[i].value, candlestick_close[i].value);
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
		y1 = this.placeHolder[counter].y;
		y1 = parseFloat(y1);
		y1 = y1 + (this.control.scaleY / 2) + this.control.scaleY;
		let width = this.control.gridSpace * 4;
		let height = -(this.control.scaleY) * 2;
		height += height;
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
	calculatePercentChangeValueOutput(index, ctx) {
		if(index == 0) {
			return "N/A"
		} else {
			let currentClose = this.placeHolder[index].candlestick_close;
			let previousClose = this.placeHolder[index - 1].candlestick_close;
			let percentChange = ((currentClose - previousClose) / previousClose) * 100;
			percentChange = percentChange.toFixed(2);
			if(percentChange >= 0) {
				ctx.fillStyle = "green";
			} else if(percentChange < 0) {
				ctx.fillStyle = "red";
			}
			return percentChange + '%';
		}
		return 0;
	}
	calculateDollarChangeValueOutput(index, ctx) {
		if(index == 0) {
			return "N/A"
		} else {
			let calculate1 = (this.placeHolder[index].candlestick_close - this.placeHolder[index - 1].candlestick_close).toFixed(2);
			if(calculate1 >= 0) {
				ctx.fillStyle = "green";
			} else if(calculate1 < 0) {
				ctx.fillStyle = "red";
			}
			return '$' + calculate1;
		}
		return 0;
	}
	determineCandleStickColor(counter) {
		if(counter == 0) {
			let currentDayOpen = parseFloat(this.placeHolder[counter].candlestick_open);
			let currentDayClose = parseFloat(this.placeHolder[counter].candlestick_close);
			if(currentDayClose < currentDayOpen) {
				return "#FF4500	";
			} else {
				return "#65b253";
			}
		} else {
			let previousDay = parseFloat(this.placeHolder[counter - 1].candlestick_close);
			let currentDay = parseFloat(this.placeHolder[counter].candlestick_close);
			if(previousDay < currentDay) {
				return "#65b253";
			} else if(previousDay > currentDay) {
				return "#FF4500	";
			} else if(previousDay == currentDay) {
				return "#65b253";
			}
		}
	}
	allValuesTheSameForTradingDay(candlestick_open, candlestick_high, candlestick_low, candlestick_close) {
		if((candlestick_open) == (candlestick_close) && (candlestick_open) == (candlestick_high) && (candlestick_open) == candlestick_low) {
			return true;
		}
		return false;
	}
	drawCandlestick(counter) {
		let candlestickHigh = parseFloat(this.placeHolder[counter].candlestick_high);
		let candlestickLow = parseFloat(this.placeHolder[counter].candlestick_low);
		let candlestickWidth = parseFloat((this.control.gridSpace * 2) / 2);
		let x = this.placeHolder[counter].x;
		let xPos = x + this.control.scaleX;
		let candlestickColor = this.determineCandleStickColor(counter);
		let candlestickXPos = this.placeHolder[counter].x;
		let candlestickOpen;
		let candlestickPreviousClose;
		let a;
		if(this.placeHolder[counter].hoverColor == "") {
			if(counter > 0) {
				candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
				candlestickPreviousClose = parseFloat(this.placeHolder[counter - 1].candlestick_close);
			} else {
				candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
				candlestickPreviousClose = parseFloat(this.placeHolder[counter].candlestick_close);
			}
			this.drawLine2(xPos, candlestickHigh, xPos, candlestickLow, "#000");
			candlestickWidth = (this.control.gridSpace * 2);
			//	let calc1 = candlestickOpen-(candlestickPreviousClose);
			a = candlestickOpen - (this.placeHolder[counter].candlestick_close);
			if(candlestickOpen > candlestickPreviousClose) {
				this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickColor);
			} else if(candlestickPreviousClose > candlestickOpen) {
				this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickColor);
			} else if(candlestickPreviousClose == candlestickOpen) {
				this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickColor);
			}
		} else {
			if(counter > 0) {
				candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
				candlestickPreviousClose = parseFloat(this.placeHolder[counter - 1].candlestick_close);
			} else {
				candlestickOpen = parseFloat(this.placeHolder[counter].candlestick_open);
				candlestickPreviousClose = parseFloat(this.placeHolder[counter].candlestick_close);
			}
			this.drawLine2(xPos, candlestickHigh, xPos, candlestickLow, "#000");
			let candlestickHoverColor;
			candlestickWidth = (this.control.gridSpace * 2);
			candlestickColor = this.determineCandleStickColor(counter);
			candlestickHoverColor = this.createHoverColor(this.determineCandleStickColor(counter));
			a = candlestickOpen - (this.placeHolder[counter].candlestick_close);
			this.fillRectangle3(candlestickXPos, parseFloat(this.placeHolder[counter].candlestick_close), candlestickWidth, a, candlestickHoverColor);
		}
		this.positionHLabel(counter);
	}
	positionHLabel(counter) {
		let range = this.control.calculateRange()[0];
		let scaleY = this.control.scaleY;
		if(range < 0) {
			this.drawHlabel(this.placeHolder[counter].x + 1, 0, this.placeHolder[counter].hLabel);
		} else {
			this.drawHlabel(this.placeHolder[counter].x + 1, range + scaleY, this.placeHolder[counter].hLabel);
		}
	}
	getHighestCandleStickHighInRange() {
		Array.prototype.max = function() {
			return Math.max.apply(null, this);
		};
		let domainLower = c.calculateDomain()[0];
		let domainUpper = c.calculateDomain()[1];
		let collectDatesWithinRange = [];
		chart.placeHolder.forEach((element, index) => {
			let domainLower = c.calculateDomain()[0];
			let domainUpper = c.calculateDomain()[1];
			if(element.x >= domainLower && element.x <= domainUpper) {
				if(element.command == 'drawCandleStick') {
					collectDatesWithinRange.push(element);
				}
			}
		});
		let collectHighs = [];
		collectDatesWithinRange.forEach((element, index) => {
			collectHighs.push(parseFloat(element.candlestick_high));
		});
		//let maxValue = collectLows.reduce((a, b) => Math.min(a, b));
		let maxValue = Math.max.apply(null, collectHighs);
		let index1;
		collectDatesWithinRange.forEach((element, index) => {
			if(parseFloat(element.candlestick_high) == maxValue) {
				index1 = index;
			}
		});
		return index1;
	}
	getLowestCandleStickLowInRange() {
		let domainLower = c.calculateDomain()[0];
		let domainUpper = c.calculateDomain()[1];
		let collectDatesWithinRange = [];
		chart.placeHolder.forEach((element, index) => {
			let domainLower = c.calculateDomain()[0];
			let domainUpper = c.calculateDomain()[1];
			if(element.x >= domainLower && element.x <= domainUpper) {
				if(element.command == 'drawCandleStick') {
					collectDatesWithinRange.push(element);
				}
			}
		});
		let collectLows = [];
		collectDatesWithinRange.forEach((element, index) => {
			collectLows.push(parseFloat(element.candlestick_low));
		});
		let minValue = collectLows.reduce((a, b) => Math.min(a, b));
		let index1;
		collectDatesWithinRange.forEach((element, index) => {
			if(parseFloat(element.candlestick_low) == minValue) {
				index1 = index;
			}
		});
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
		} else if(scaleY >= 10 && scaleY < 20) {
			value1 = 10;
		} else if(scaleY >= 20 && scaleY < 50) {
			value1 = 20;
		} else if(scaleY >= 50 && scaleY < 100) {
			value1 = 50;
		} else if(scaleY >= 100 && scaleY < 1000) {
			value1 = 50;
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
	}
	determineYScaleIncrementSize(largestValue) {
		return largestValue / 5;
	}
	autoAdjustGraph2(yValues) {
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
		this.ctx.save(); 
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
		this.ctx.stroke();
		this.ctx.lineWidth = 1;
	}
	static buildSampleChart() {
		buildNewTable();
	}
	static buildNewTable() {
		let buildHTML = '<b><h2 >Candlestick Chart Builder</h2></b>\<br><br><b>Title</b><br/><b>\
				<input type="text" value="AAPL" id="txtTitle"></b><br/><br/>\
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