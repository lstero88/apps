let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let fs = require('fs');
let backend = require("./backend");


const csv = require('csv-parser');
const async = require('async');
const csvsync = require('csvsync');
	
	let reconnectInterval = 10 * 1000 * 60;
	
	
	
////////////////////////////////////////////////



   async function sendEmail1(firstName, lastName, emailAddress, message) {
		
				var sender = nodemailer.createTransport(smtpTransport({
					service: 'gmail',
					host: 'smtp.gmail.com',
					auth: {	
						user: 'lstero1988@gmail.com',
						pass: 'hl51749l3t51'
					}
				}));
				
				
				var sendInformation = {

					from: 'lstero1988@gmail.com',
					to: 'sterosky@gmail.com',
					subject: 'Incoming contact message from ' + firstName + ' ' + lastName,
					text: 'First name: ' + firstName + '\nLast name: ' + lastName + '\nEmail Address: ' + emailAddress + '\nMessage: ' + message
				};
				
				
			sender.sendMail(sendInformation, function(error, info){
			  if (error) {
				console.log(error);
			  } else {
				console.log('Email sent: ' + info.response);
			  }
			});	
			
			
			
		return new Promise(
			function (resolve, reject) {
 
				resolve('Your message has been sent!');
	 
			});				
	   
   }
	
	
	async function loadCSVFile  (csvFilePath) {
		
		
		let list = [];
		let line;

	 
		const csv=require('csvtojson')
		 
		csv({
		noheader:true,
		output: "csv"
		})
		.fromFile(csvFilePath)
		.then((line)=>{
		list.push(line);
		 
		})
		
		
		return new Promise(function(res, rej) {
			res(list);
		  })

	 
	}
	
	let srcFolderName, srcFolderID;
	let txtFileFolderName, txtFilesFolderID;
	let csvFileFolderName, csvFilesFolderID;
	 
	 
	 
	let appFiles = { 

	 
		'app1.html': 'app1.js',
		'app2.html': 'app2.js',
		'app3.html': 'app3.js',
		'app4.html': 'app4.js',
		'app5.html': 'app5.js',
		'app6.html': 'app6.js'

		
	}


	let folders = {
		'srcfiles': '1__Tsbwv5KgVt6Ax_Kc5VsRsXq7b_Jmun',
		'txtfiles': '1aBOYl4whyoyINeoEq9GoazubTRsTXWcP',
		'csvfiles': '138IvW05lR0v3xLo6exGQkgX4OFhP4RgX',
	 
	}


	let appName = {
		
		'app1': 'Text Reader',
		'app2': 'CSV Reader',
		'app3': 'Text Reader and Writer',
		'app4': 'CSV Reader and Writer',
		'app5': 'SimpleGraph',
		'app6': 'Chart Builder'
	 
	}


	 function initializeFolders() {
		
			for ([index, [key, value]] of Object.entries(Object.entries(folders))) {
				
				console.log(`${index}: ${key}: ${value}`);
				
				if(index == 0) {
					
					srcFolderName = key;
					srcFolderID = value;
				}
				
				else if(index == 1) {
					txtFileFolderName = key;
					txtFilesFolderID = value;	
					
				}
				
				
				else if(index == 2) {
					csvFileFolderName = key;
					csvFilesFolderID = value;	
					
				}
				
			}
			
	 
	}	 

	initializeFolders();
	let DriveApp = new backend.registerBackend(srcFolderName, srcFolderID, txtFileFolderName, 
		txtFilesFolderID, csvFileFolderName, csvFilesFolderID);


	function formatFileExtension(fullFileName)

	{

	  var splitFileName = fullFileName.split('.');
	  var lastElement = splitFileName.length-1;

	  return splitFileName[lastElement];

	}

	function listCSVFilesInFolder() {
		
		 let folder = DriveApp.getFolderById(csvFilesFolderID);  	
		 
	 

		 let list = [];
		 list.push(['Name','Size', 'File Type', 'Date Modified']);	 
		 
		 var files = DriveApp.getFiles(folder); 
		 var row = [];

		 
		 for(let k = 0; k < files.length; k++)
		 {
			let row = [];
			
			let fileName = files[k][0];
			let fileSize = files[k][1];
			let fileExtension = formatFileExtension(files[k][2]);
			let d = files[k][3];
			

			var formatDate = d;
			formatDate = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + 
				((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();

				row.push(fileName,fileSize, fileExtension, formatDate)
				list.push(row); 
		 

		}
				
		return list;

		 
	 }

	 function listTextFilesInFolder() {
		  
		  
		 let folder = DriveApp.getFolderById(txtFilesFolderID);  
		 
		 let list = [];
		 list.push(['Name','Size', 'File Type', 'Formate Date']);	 
		 
		 var files = DriveApp.getFiles(folder); 
		 
		 for(let k = 0; k < files.length; k++)
		 {
			let row = [];
			
			let fileName = files[k][0];
			let fileSize = files[k][1];
			let fileExtension = formatFileExtension(files[k][2]);
			let d = files[k][3];
			

			var formatDate = d;
			formatDate = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + 
				((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();

				row.push(fileName, fileSize, fileExtension, formatDate)
				list.push(row); 
		
		}	 
			 
			 return list;
		 
	 }
	 
	 
	 
	 function deleteTextFile(fileName) {
		 
		let folder = DriveApp.getFolderById(txtFilesFolderID); 
		 
		const path = folder + '/' + fileName;

		fs.unlink(path, (err) => {
		  if (err) {
			console.error(err)
			return 0;
		  }})
		 
		 
		 return 1;
	 
	 }	
		

	 function loadTextFile(theTextFile) {
		 
		 let folder = DriveApp.getFolderById(txtFilesFolderID);  
		 
		 var files = DriveApp.getFilesByName(folder, theTextFile); 
		 
		 
		 if(files.length > 0) {
			 
			let buildTextString = "";
			
			for(var i = 0; i < files.length; i++) {
					 
				buildTextString += files[i] ;
			}
			
			return buildTextString;
		 }
		 
		 return "No data for selected text file.";

	 }
	 
	 
	 
	 function saveTextFile(fileName, fileData)
	 {
			
			let folder = DriveApp.getFolderById(txtFilesFolderID);  
			let filePath = folder+'/'+fileName;
		 
			fs.writeFileSync(filePath, fileData);
			
			return 1;
		 
	 }
	  
	 
		
		
	function removeComments(string){
		return string.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,'').trim();
	}	
	  
	function saveCSVFile(fileName, fileData) {
		
		let folder = DriveApp.getFolderById(csvFilesFolderID);

		let buildCSVArray = [];
		
		for(let i = 0; i < fileData.length; i++) {
			
			buildCSVArray.push(fileData[i]);
			fs.writeFileSync(folder+'/'+fileName, csvsync.stringify(buildCSVArray));
		}
		
		
		return 1;
	 

	}

	function saveCSVFile2(fileName, fileData) {
		
		let folder = DriveApp.getFolderById(csvFilesFolderID);

		let buildCSVArray = [];

		for(let i = 0; i < fileData.length; i++) {
			
			buildCSVArray.push(fileData[i]);
			fs.writeFileSync(folder+'/'+fileName, csvsync.stringify(buildCSVArray));
		}
		
		
		return 1;
	 

	}




	 function deleteCSVFile(fileName) {
		 
		let folder = DriveApp.getFolderById(csvFilesFolderID); 
		 
		const path = folder + '/' + fileName;

		fs.unlink(path, (err) => {
		  if (err) {
			console.error(err)
			return 0;
		  }

	 
			})
		 
		 
		 return 1;
	 
	 }



	function calculateTimeInterval1(fileSize) {

		let mbps = 5;
		let result = (fileSize/mbps) * 1000;

		if(result < 1000) {
				result = 1000;
		}
		
		return result;
		
	}


	function loadFile(filePath) {
			 
			 let array1 = [];
				
			 require('fs').readFileSync(filePath, 'utf-8').split(/\r?\n/).forEach(function(line){
			 
			  array1.push(line);
			})
				
	 

			return array1;	
	}

///////////////////////////////////////////////	
  

// npm install --save express socket.io

app.get('/', function(req, res) {
	 res.sendFile('index.html', { root: '.' });
});


io.on('connection', function(socket){
   console.log('New connection.');
   
   	socket.emit('connection_accept', '');
   


   socket.on('client_msg', function(message) {
	  
 
				console.log(message);
				
				let htmlPage;
				let jsData;
				let htmlData;
				
				let parseJSON  = message;
				
				
					htmlPage = parseJSON.appHTML

					if(parseJSON.command == 'loadApp') {
								
								for(app in appFiles) {
					
									if(app == htmlPage) {
										htmlData = loadFile(app);
										jsData = loadFile(srcFolderName+'/'+appFiles[app]);
										
	 
										break;
									}
								}			
												
								 
		 
							let buildJS = "";
							let buildHTML = "";
							
							for(var i = 0; i < jsData.length; i++) {
									 
								buildJS += removeComments(jsData[i]) ;
							}
											
							for(var i = 0; i < htmlData.length; i++) { 
								buildHTML += removeComments(htmlData[i]);
							}
			
											
							documentData = {
								returnType: 'loadedAppData',
								javascript: buildJS,
								html: buildHTML
								
							}

							socket.emit('server_msg', JSON.stringify(documentData));
						
						
						}
						
						
					else if(parseJSON.command == 'listTextFilesInFolder'){
						
						documentData = {
							returnType: 'textFilesRetrieved',
							fileList: listTextFilesInFolder(),
							htmlPage: htmlPage
							
						}	

						socket.emit('server_msg', JSON.stringify(documentData));

					}					
							
					
					
					else if(parseJSON.command == 'listTextFilesInFolder2') {
						documentData = {
							returnType: 'textFilesRetrieved2',
							fileList: listTextFilesInFolder(),
							htmlPage: htmlPage
							
							
							
						}	
						
						socket.emit('server_msg', JSON.stringify(documentData));
	
					}		



					else if(parseJSON.command == 'loadTextFile') {
						
						documentData = {
						
							returnType: 'textFileDataRetrieved',
							fileContents: loadTextFile(parseJSON.parameters),
							htmlPage: htmlPage
						
						}
 
 
						socket.emit('server_msg', JSON.stringify(documentData));
						
					}	
					
					
					else if(parseJSON.command == 'loadTextFile2') {
				
						documentData = {
							returnType: 'textFileDataRetrieved2',
							fileContents: loadTextFile(parseJSON.parameters),
							htmlPage: htmlPage
						
						}
 
						 
						socket.emit('server_msg', JSON.stringify(documentData));
					}


					else if(parseJSON.command == 'saveTextFile')
						
					{
						
						let fileName = parseJSON.parameters[0];
						let txtData =  parseJSON.parameters[1];
						
		 
						
						if(saveTextFile(fileName, txtData) == 1) {
							
								documentData = {
									returnType: 'textFileDataSaved',
									fileName: parseJSON.parameters[0],
									htmlPage: htmlPage
									
								
								}
						}
						
					
						socket.emit('server_msg', JSON.stringify(documentData));		
							
					}					
						
					else if(parseJSON.command == 'deleteTextFile') {
					
							let fileName = parseJSON.parameters;
						
							if(deleteTextFile(fileName) == 1)	
							{
								documentData = {
									returnType: 'deleteTextFileSuccess',
									fileName: parseJSON.parameters,
									htmlPage: htmlPage
								
								}
								socket.emit('server_msg', JSON.stringify(documentData));					
									
							}
					}	

					else if(parseJSON.command == 'listCSVFilesInFolder') {
						
						
						documentData = {
						
							returnType: 'csvFilesRetrieved',
							fileList: listCSVFilesInFolder(),
							htmlPage: htmlPage
						
						
						}
						
					 
						socket.emit('server_msg', JSON.stringify(documentData));	
								
					}	

					

//					else if(parseJSON.command == 'deleteTextFile') {
						
						
//							let fileName = parseJSON.parameters;
						
//							if(deleteTextFile(fileName) == 1)	
//							{
								
								
//								documentData = {
//									returnType: 'deleteTextFileSuccess',
//									fileName: parseJSON.parameters,
//									htmlPage: htmlPage
								
//								}


//								socket.emit('server_msg', JSON.stringify(documentData));			;					
									
//							}

//					}
					
					else if(parseJSON.command == 'createEmptyTextFile')	
					{
						
						let fileName = parseJSON.parameters;
										
										
						
						if(saveTextFile(fileName, '') == 1) {
							
								documentData = {
									returnType: 'newTextFileCreated',
									fileName: parseJSON.parameters,
									htmlPage: htmlPage
									
								
								}
						}
						
						
							socket.emit('server_msg', JSON.stringify(documentData));	
	
					}				
					
										
					else if(parseJSON.command == 'loadCSVFile') {	
							
							let filePath = csvFileFolderName+'/'+parseJSON.parameters;
							let fileSize = DriveApp.getFileSizeInMB(filePath);
							
							loadCSVFile(filePath)
							  .then(function(csvData) {
								return new Promise(function() {
								   setTimeout(function() {
								  
									 
									// console.log(csvData[0][2]);
									
									let header = [];
									let lines = [];

									
									documentData = {
									
										returnType: 'csvFileRetrieved',
										fileContents: csvData[0],
										fileName: filePath.split('/')[1],
										htmlPage: htmlPage
									
									}

 
									socket.emit('server_msg', JSON.stringify(documentData));								 

									 
									}, calculateTimeInterval1(fileSize))
								})
								
							  })

					}
					
					else if(parseJSON.command == "saveCSVFile")
						
					{

						let fileName = parseJSON.parameters[0];
						let fileData = parseJSON.parameters[1];
						
			 
						if(saveCSVFile(fileName, fileData) == 1) {
							
							documentData = {
							
								returnType: 'csvFileSaved',
								fileName: parseJSON.parameters[0],
								htmlPage: htmlPage
							
							}
						}
						
						 
						socket.emit('server_msg', JSON.stringify(documentData));	

					}
					else if(parseJSON.command == "saveCSVFile2")
						
					{

						let fileName = parseJSON.parameters[0];
						let fileData = parseJSON.parameters[1];
						
			 
						if(saveCSVFile2(fileName, fileData) == 1) {
							
							documentData = {
							
								returnType: 'csvFileCreated2',
								fileName: parseJSON.parameters[0],
								htmlPage: htmlPage
						
							}
						}
						 
						socket.emit('server_msg', JSON.stringify(documentData));	

					}				
					
					
					else if(parseJSON.command == "deleteCSVFile")
					{
						
						let fileName = parseJSON.parameters;

						
						if(deleteCSVFile(fileName) == 1)	
						{
								
							documentData = {
								returnType: 'deleteCSVFileSuccess',
								fileName: parseJSON.parameters,
								htmlPage: htmlPage
							
							}
								
							socket.emit('server_msg', JSON.stringify(documentData));	
						}	
						
						
					}					
					
	 
			 
//	console.log('CLIENT MSG -> ' + JSON.stringify(data));	
		
		
 
	
 

	} );








   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });

 
   
});


portNumber = process.env.PORT || 8080;

http.listen(portNumber, function(){
   console.log('listening on port 8080');
});