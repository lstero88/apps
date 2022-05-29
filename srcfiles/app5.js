try {
	var c;
	var functions;
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
			canvas.style.border = "solid 1px #000000";
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
			this.numericLabelingVisible = 1;
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
						this.v1 = gridSpace;
						this.v2 -= scaleY;
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
					this.trueMouseX.innerHTML = "0";
					this.trueMouseY.innerHTML = "0";
					this.mouseX.innerHTML = "0";
					this.mouseY.innerHTML = "0";
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
							this.trueMouseX.innerHTML = this.eventPageX;
						} else {
							this.trueMouseX.innerHTML = "0";
						}
						if(this.eventPageY >= 0) {
							this.trueMouseY.innerHTML = this.eventPageY;
						} else {
							this.trueMouseY.innerHTML = "0";
						}
						determineMouseX = this.determineMouseXPosition(this.eventPageX).toFixed(2);
						determineMouseY = this.determineMouseYPosition(this.eventPageY).toFixed(2);
						this.mouseX.innerHTML = determineMouseX;
						this.mouseY.innerHTML = determineMouseY;
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
	class drawFunctionClass {
		constructor(c, canvasObject, xy_tracking) {
			this.placeHolder = [];
			this.canvas = canvasObject;
			this.ctx = canvasObject.getContext('2d');
			this.controller = c;
			this.canvas.addEventListener("mousemove", this);
			this.xy_tracking = xy_tracking;
		}
		drawCircle3() {
			const canvas = document.getElementById('myCanvas');
			const context = canvas.getContext('2d');
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const radius = 70;
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			context.fillStyle = 'green';
			context.fill();
			context.lineWidth = 5;
			context.strokeStyle = '#003300';
			context.stroke();
		}
		drawCircle(x1, y1, radius, color, borderWidth, borderColor) {
			let pointX1 = (this.controller.originX + (x1 * ((this.controller.gridSpace / this.controller.scaleX))));
			let pointY1 = this.controller.originY + -(y1 * (this.controller.gridSpace / this.controller.scaleY));
			let radiusFormat = (radius * this.controller.gridSpace);
			//let radiusFormat = radius;
			this.ctx.beginPath();
			this.ctx.fillStyle = color;
			this.ctx.arc(pointX1, pointY1, radiusFormat, 0, 2 * Math.PI, false);
			this.ctx.fill();
			if(borderWidth > 0) {
				this.ctx.lineWidth = borderWidth;
				this.ctx.strokeStyle = borderColor;
				this.ctx.stroke();
			}
			this.ctx.closePath();
		}
		fillRectangle2(x1, y1, width, height, color, stepX, stepY) {
			let pointX1 = (this.controller.originX + (x1 * ((this.controller.gridSpace / this.controller.scaleX))));
			let pointY1 = this.controller.originY + -(y1 * (this.controller.gridSpace / this.controller.scaleY));
			pointX1 -= stepX;
			pointY1 -= stepY;
			this.ctx.fillStyle = color;
			this.ctx.fillRect(pointX1, pointY1, width, height);
		}
		fillRectangle3(x1, y1, width, height, color, stepX, stepY) {
			let pointX1 = (this.controller.originX + (x1 * ((this.controller.gridSpace / this.controller.scaleX))));
			let pointY1 = this.controller.originY + -(y1 * (this.controller.gridSpace / this.controller.scaleY));
			pointX1 -= stepX;
			pointY1 -= stepY;
			this.ctx.fillStyle = color;
			this.ctx.fillRect(pointX1, pointY1, width, height);
		}
		drawSquareFunction() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			this.ctx.strokeStyle = "#000000";
			for(var i = domainStart; i <= domainEnd; i += 0.01) {
				this.fillRectangle2(i, Math.pow(i, 2), 4, 6, this.ctx.strokeStyle, 3, 3);
			}
		}
		drawSquareRootFunction() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			this.ctx.strokeStyle = "#000000";
			for(var i = domainStart; i <= domainEnd; i += 0.01) {
				this.fillRectangle2(i, Math.sqrt(i), 4, 6, this.ctx.strokeStyle, 2, 3);
			}
		}
		drawCubicFunction() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			this.ctx.strokeStyle = "#000000";
			for(var i = domainStart; i <= domainEnd; i += 0.01) {
				this.fillRectangle2(i, Math.pow(i, 3), 4, 6, this.ctx.strokeStyle, 2, 3);
			}
		}
		drawReciprocalFunction2() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			this.ctx.strokeStyle = "#000000";
			for(var i = domainStart; i <= domainEnd; i += 0.005) {
				this.fillRectangle2(i, 1 / i, 4, 1, this.ctx.strokeStyle, 0, 0);
				this.fillRectangle2(i, 1 / i, 4, 5, this.ctx.strokeStyle, 0, 0);
				if(i > 0 && i < 0.5) {
					this.fillRectangle2(i, 1 / i, 5, 8, this.ctx.strokeStyle, 0, 0);
				}
			}
		}
		drawLine(x1, y1, x2, y2) {
			this.ctx.lineWidth = 3;
			this.ctx.strokeStyle = "#000000";
			this.ctx.beginPath();
			var pointX1 = (this.controller.originX + (x1 * ((this.controller.gridSpace / this.controller.scaleX))));
			var pointY1 = this.controller.originY + -(y1 * (this.controller.gridSpace / this.controller.scaleY));
			var pointX2 = this.controller.originX + (x2 * ((this.controller.gridSpace / this.controller.scaleX)));
			var pointY2 = this.controller.originY + -(y2 * (this.controller.gridSpace / this.controller.scaleY));
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
		isNull(x, y) {
			if(x != null && y != null) {
				return false;
			} else {
				return true;
			}
		}
		drawReciprocalFunction() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			let lastPoint;
			lastPoint = [null, null];
			for(var i = domainStart; i <= domainEnd; i += 0.01) {
				if(!this.isNull(lastPoint[0], lastPoint[1])) {
					if(lastPoint[0] < 0 && i > 0) {
						lastPoint = [null, null];
					} else {
						this.drawLine(lastPoint[0], lastPoint[1], i, (1 / i));
					}
				}
				lastPoint = [i, (1 / i)];
			}
		}
		drawAbsoluteValueFunction() {
			let domainStart = this.controller.calculateDomain()[0];
			let domainEnd = this.controller.calculateDomain()[1];
			this.ctx.strokeStyle = "#000000";
			for(var i = domainStart; i <= domainEnd; i += 0.01) {
				this.fillRectangle3(i, Math.abs(i), 6, 2, this.ctx.strokeStyle, 3, 0);
			}
		}
		drawXYTrackingText(x1, y1, theText, textColor, stepX, stepY) {
			let pointX1 = this.controller.originX + (x1 * ((this.controller.gridSpace / this.controller.scaleX)));
			let pointY1 = this.controller.originY + -(y1 * (this.controller.gridSpace / this.controller.scaleY));
			pointX1 += stepX;
			pointY1 += stepY;
			this.ctx.fillStyle = textColor;
			this.ctx.font = "20px Arial";
			this.ctx.fillText(theText, pointX1, pointY1);
		}
		handleEvent(event) {
			switch(event.type) {
				case "mousemove":
					let determineMouseX;
					let determineMouseY;
					if(this.xy_tracking) {
						if(this.placeHolder.length > 0) {
							determineMouseX = this.controller.determineMouseXPosition(this.controller.eventPageX).toFixed(2);
							determineMouseY = this.controller.determineMouseYPosition(this.controller.eventPageY).toFixed(2);
							updateSettings();
							let yResult;
							for(let a = 0; a < this.placeHolder.length; a++) {
								for(x in this.placeHolder) {
									switch(this.placeHolder[x].command) {
										case "drawFunction":
											switch(functions.placeHolder[x].functionType) {
												case "square":
													yResult = Math.pow(determineMouseX, 2);
													this.drawCircle(determineMouseX, yResult, 0.2, "red", 1, "#111");
													this.drawXYTrackingText(determineMouseX, yResult, "X = " + determineMouseX, "red", this.controller.gridSpace * 2.5, 10);
													this.drawXYTrackingText(determineMouseX, yResult, "Y = " + yResult.toFixed(3), "red", this.controller.gridSpace * 2.8, 30);
													break;
												case "abs":
													yResult = Math.abs(determineMouseX, 2);
													this.drawCircle(determineMouseX, yResult, 0.2, "red", 1, "#111");
													this.drawXYTrackingText(determineMouseX, yResult, "X = " + determineMouseX, "red", this.controller.gridSpace * 2.5, 10);
													this.drawXYTrackingText(determineMouseX, yResult, "Y = " + yResult.toFixed(3), "red", this.controller.gridSpace * 2.8, 30);
													break;
												case "sqrt":
													yResult = Math.sqrt(determineMouseX);
													this.drawCircle(determineMouseX, yResult, 0.2, "red", 1, "#111");
													this.drawXYTrackingText(determineMouseX, yResult, "X = " + determineMouseX, "red", this.controller.gridSpace * 2.5, 30);
													this.drawXYTrackingText(determineMouseX, yResult, "Y = " + yResult.toFixed(2), "red", this.controller.gridSpace * 2.5, 50);
													break;
												case "reciprocal":
													yResult = 1 / determineMouseX;
													if(yResult != 0) {
														this.drawCircle(determineMouseX, yResult, 0.2, "red", 1, "#111");
														this.drawXYTrackingText(determineMouseX, yResult, "X = " + determineMouseX, "red", this.controller.gridSpace * 2.5, 10);
														this.drawXYTrackingText(determineMouseX, yResult, "Y = " + yResult.toFixed(3), "red", this.controller.gridSpace * 2.5, 30);
														break;
													}
													break;
												case "cubic":
													yResult = Math.pow(determineMouseX, 3);
													this.drawCircle(determineMouseX, yResult, 0.2, "red", 1, "#111");
													this.drawXYTrackingText(determineMouseX, yResult, "X = " + determineMouseX, "red", this.controller.gridSpace * 2.5, 10);
													this.drawXYTrackingText(determineMouseX, yResult, "Y = " + yResult.toFixed(3), "red", this.controller.gridSpace * 2.5, 30);
													break;
											}
											break;
									}
								}
							}
						}
					}
					break;
			}
		}
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
			c.originX -= 1;
			c.startYAxis_X = c.originX;
			c.startYAxis_Y = 0;
			c.endYAxis_X = c.originX;
			c.endYAxis_Y = c.canvasHeight;
			c.domain += c.scaleX;
			updateSettings();
		} else if(theDirection == 2) {
			c.v1 = c.gridSpace;
			c.v2 += c.scaleY;
			c.originY += 1;
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
		functions.placeHolder = [];
		updateSettings();
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
		c.scaleX = parseFloat(document.getElementById('scaleX').value);
		c.scaleY = parseFloat(document.getElementById('scaleY').value);
		c.gridSpace = parseInt(document.getElementById('gridSpace').value);
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
		let c1 = document.getElementById('myCanvas');
		let context = c1.getContext('2d');
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, c.canvasWidth, c.canvasHeight);
		context.translate(0.5, 0.5);
		determineDomainAndRange();
		if((c.calculateDomain()[1] > c.maxMouseDragLimit[1] + 1) && (c.calculateDomain()[0] < c.maxMouseDragLimit[3] - 1)) {
			c.gridSpace += 5;
			document.getElementById('gridSpace').value = c.gridSpace;
			shiftGraph2(1);
		} else if((c.calculateRange()[1] > c.maxMouseDragLimit[0] + 1) && (c.calculateRange()[0] < c.maxMouseDragLimit[2] - 1)) {
			c.gridSpace += 5;
			document.getElementById('gridSpace').value = c.gridSpace;
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
		drawAllElements();
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
		let a = "";
		a += "Domain: {" + (c.calculateDomain()[0].toFixed(2)) + "," + (c.calculateDomain()[1].toFixed(2)) + "}<br/>";
		a += "Range: {" + (c.calculateRange()[0].toFixed(2)) + "," + (c.calculateRange()[1].toFixed(2)) + "}<br/><br/>";
		document.getElementById('domainRangeLabel').innerHTML = a;
	}

	function addFunction() {
		let theValue = document.getElementById('combo2').value;
		let placeHolderElement;
		switch(theValue) {
			case "squareFunction":
				placeHolderElement = {
					command: 'drawFunction',
					functionType: 'square'
				};
				functions.placeHolder.push(placeHolderElement);
				break;
			case "absoluteValueFunction":
				placeHolderElement = {
					command: 'drawFunction',
					functionType: 'abs'
				};
				functions.placeHolder.push(placeHolderElement);
				break;
			case "squareRootFunction":
				placeHolderElement = {
					command: 'drawFunction',
					functionType: 'sqrt'
				};
				functions.placeHolder.push(placeHolderElement);
				break;
			case "reciprocalFunction":
				placeHolderElement = {
					command: 'drawFunction',
					functionType: 'reciprocal'
				};
				functions.placeHolder.push(placeHolderElement);
				break;
			case "cubicFunction":
				placeHolderElement = {
					command: 'drawFunction',
					functionType: 'cubic'
				};
				functions.placeHolder.push(placeHolderElement);
				break;
		}
		drawAllElements();
	}

	function buildData() {
		let parent = "#column1";
		let width = 1125;
		let height = 700;
		let gridlineColor = "#ECECEC";
		let gridSpace = 40;
		let numericLabelingVisible = 1;
		let scaleX = 1;
		let scaleY = 1;
		let xPlotMarkersVisible = 1;
		let yPlotMarkersVisible = 1;
		let xAxisVisible = 1;
		let yAxisVisible = 1;
		c = new canvasClass(parent, width, height, gridlineColor, gridSpace, numericLabelingVisible, scaleX, scaleY, xPlotMarkersVisible, yPlotMarkersVisible, xAxisVisible, yAxisVisible, updateSettings);
		document.getElementById('column2').innerHTML = '<h2>Display Tracker</h2> \
					True Domain {0, ' + c.canvasWidth + '}<br/> \
					True Range {0, ' + c.canvasHeight + '}<br/><br/> \
					<div>\
							True Mouse X: <span id="trueMouseX">0</span>\
							<br/> \
							True Mouse Y: <span id="trueMouseY">0</span>\
							<br/><br/> \
					</div> \
					<div>\
							Mouse X: <span id="mouseX">0</span>\
							<br/> \
							Mouse Y: <span id="mouseY">0</span>\
					</div>\
					<br/>\
						<div  id="domainRangeLabel">\
						</div>\
					<h2>Graph Properties</h2>\
						<label for="scaleX" class="graphPropertyHeaders"><b>Scale X</b></label><br/>\
							<input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleX"  class="txt1" required minlength="1"  step="0.1" min="0">\
						<br/><br/>\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Scale Y</b></label><br/>\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="scaleY"  class="txt1" required minlength="1"  step="0.1" min="0">\
						<br/><br/>\
						<label for="scaleY"  class="graphPropertyHeaders"><b>Gridline Spacing</b></label><br/>\
						 <input type="number" onkeyup="updateSettings()" onchange="updateSettings()" id="gridSpace"  class="txt1" required minlength="1"  size="5" step="5" min="5" >\
						<br/><br/>\
						<input type="checkbox" checked onclick="modifyXAxisVisibility(this)">X-Axis visible<br/>\
						<input type="checkbox" checked onclick="modifyYAxisVisibility(this)">Y-Axis visible<br/>\
						<input type="checkbox" checked onclick="modifyPlotMarkerVisibility(this)">Grid Lines visible <br/>\
						<input type="checkbox" checked onclick="modifyNumericLabelingVisibility(this)">Add Numeric labeling<br/>';
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
			shiftGraph(1)
		});
		document.querySelector('#column1').appendChild(btnMoveLeft);
		let btnMoveRightText = document.createTextNode("Move Right");
		let btnMoveRight = document.createElement("BUTTON");
		btnMoveRight.className = "btn2";
		btnMoveRight.setAttribute('style', styleBtn2);
		btnMoveRight.appendChild(btnMoveRightText);
		btnMoveRight.addEventListener("click", function() {
			shiftGraph(3)
		});
		document.querySelector('#column1').appendChild(btnMoveRight);
		let btnMoveUpText = document.createTextNode("Move Up");
		let btnMoveUp = document.createElement("BUTTON");
		btnMoveUp.className = "btn2";
		btnMoveUp.setAttribute('style', styleBtn2);
		btnMoveUp.appendChild(btnMoveUpText);
		btnMoveUp.addEventListener("click", function() {
			shiftGraph(2)
		});
		document.querySelector('#column1').appendChild(btnMoveUp);
		let btnMoveDownText = document.createTextNode("Move Down");
		let btnMoveDown = document.createElement("BUTTON");
		btnMoveDown.className = "btn2";
		btnMoveDown.setAttribute('style', styleBtn2);
		btnMoveDown.appendChild(btnMoveDownText);
		btnMoveDown.addEventListener("click", function() {
			shiftGraph(0)
		});
		document.querySelector('#column1').appendChild(btnMoveDown);
		let btnClearScreenText = document.createTextNode("Clear Screen");
		let btnClearScreen = document.createElement("BUTTON");
		btnClearScreen.className = "btn2";
		btnClearScreen.setAttribute('style', styleBtn2);
		btnClearScreen.appendChild(btnClearScreenText);
		btnClearScreen.addEventListener("click", function() {
			clearScreen()
		});
		document.querySelector('#column1').appendChild(btnClearScreen);
		let btnCenterOriginToScreenText = document.createTextNode("Center Origin to Screen");
		let btnCenterOriginToScreen = document.createElement("BUTTON");
		btnCenterOriginToScreen.className = "btn2";
		btnCenterOriginToScreen.id = "centerOriginToScreen";
		btnCenterOriginToScreen.setAttribute('style', styleBtn2);
		btnCenterOriginToScreen.appendChild(btnCenterOriginToScreenText);
		btnCenterOriginToScreen.addEventListener("click", function() {
			centerOriginToScreen()
		});
		document.querySelector('#column1').appendChild(btnCenterOriginToScreen);
		document.getElementById('scaleX').value = c.scaleX;
		document.getElementById('scaleY').value = c.scaleY;
		document.getElementById('gridSpace').value = c.gridSpace;
		determineDomainAndRange();
		c.registerMouseTrackingLabels(document.getElementById('trueMouseX'), document.getElementById('trueMouseY'), document.getElementById('mouseX'), document.getElementById('mouseY'));
		let xyCheckStatus = document.getElementById('xy_tracking');
		functions = new drawFunctionClass(c, c.canvas, xyCheckStatus.checked);
		drawAllElements();
	}

	function changeXYTrackingSettings() {
		if(document.getElementById('xy_tracking').checked) {
			functions.xy_tracking = true;
			updateSettings();
		} else {
			functions.xy_tracking = false;
			updateSettings();
		}
	}

	function drawPlaceHolderElements() {
		for(x in functions.placeHolder) {
			switch(functions.placeHolder[x].command) {
				case "drawFunction":
					switch(functions.placeHolder[x].functionType) {
						case "square":
							functions.drawSquareFunction();
							break;
						case "abs":
							functions.drawAbsoluteValueFunction();
							break;
						case "sqrt":
							functions.drawSquareRootFunction();
							break;
						case "reciprocal":
							functions.drawReciprocalFunction2();
							break;
						case "cubic":
							functions.drawCubicFunction();
							break;
					}
					break;
			}
		}
	}

	function drawAllElements() {
		c.drawDisplayElements();
		if(c.numericLabelingVisible == 1) {
			c.drawNumbers();
		}
		if(functions.placeHolder.length > 0) {
			drawPlaceHolderElements();
		}
	}
	if(typeof beginInit == 'undefined') {
		let beginInit;
		beginInit = setTimeout(buildData, 1);
	}
} catch {}