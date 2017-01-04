/**
 * @file Mobile Browser Console
 * @author Tim S. Long
 * @copyright 2017 Tim S. Long
 * @license MIT License
 * @version 1.0
 */
;var MobileBrowserConsole = (function(){
	var bindElementEvent;
	
	if(window.attachEvent) {
		bindElementEvent = function(elm, evt, callback, bool) {
			elm.attachEvent.call(elm, evt, callback);
		};
	} else {
		bindElementEvent = function(elm, evt, callback, bool) {
			elm.addEventListener.call(elm, evt, callback, bool);
		};
	}
	
	if(typeof window.console === "undefined") {
		window.console = {
			log: function(msg){},
			error: function(msg){},
			table: function(tbl){},
			clear: function(){},
			dir: function(obj){},
			warn: function(msg){}
		};
	}

	// Polyfill for String.prototype.trim
	// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
	if(!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}

	// Polyfill for String.prototype.startsWith
	// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position) {
			position = position || 0;
			return this.substr(position, searchString.length) === searchString;
	  };
	}
	
	function setStyle(elm, cssObj) {
		for(var pro in cssObj) {
			elm.style[pro] = cssObj[pro];
		}
	}

	var lineCounter = 1,
		consoleLines = [],
		consoleEntry = null,
		consoleLog = null,
		consoleDiv = null,
		spaceBufferDiv = null,
		backtrackCount = 0,
		oldLog = console.log,
		oldErr = console.error,
		oldTab = console.table,
		oldClear = console.clear,
		oldDir = console.dir,
		oldWarn = console.warn,
		oldProto = console.__proto__;

	/**
	 * @description Build new DOM elements and define new methods.
	 */
	function createConsole() {
		consoleDiv = document.createElement("DIV");
		spaceBufferDiv = document.createElement("DIV");
		consoleDiv.id = "consoleDiv";
		spaceBufferDiv.id = "spaceBuffer";
		spaceBufferDiv.style.height = "0";
		consoleLog = document.createElement("DIV");
		consoleLog.id = "consoleLog";
		consoleLog.style.height = "0";
		consoleEntry = document.createElement("INPUT");
		consoleEntry.setAttribute("type", "text");
		consoleEntry.id = "consoleEntry";
		consoleDiv.appendChild(consoleLog);
		consoleDiv.appendChild(consoleEntry);
		document.body.appendChild(spaceBufferDiv);
		document.body.appendChild(consoleDiv);
		consoleLog.innerHTML = "<span class='consoleGray'>&rsaquo;</span> <span class='consoleGray'>Enter JavaScript console commands in the bottom box below.</span>";

		bindElementEvent(consoleEntry, "keyup", enterLog, false); // Add a key event to poll for the "Enter" key as the user types.
		bindElementEvent(consoleEntry, "focus", function(e) { consoleLog.style.height = "118px"; spaceBufferDiv.style.height = "118px"; }, false); // Open up the log when user taps on the entry line.

		if('ontouchstart' in window || navigator.msMaxTouchPoints) {
			bindElementEvent(document.body, "touchstart", shrinkConsole, false);
			bindElementEvent(consoleLog, "touchstart", copyOldEntry, false);
		} else { // Browsers with touch support often interpret a "touch" as a "click". We want to avoid doubling up on events.
			bindElementEvent(document.body, "click", shrinkConsole, false);
			bindElementEvent(consoleLog, "click", copyOldEntry, false);
		}

		// Redefined standard console operations to add new "print to screen" functionality but maintain the original functionality for desktop
		console.log = function(msg) {
			if(arguments.length > 1) { // Allow multiple arguments, console.log("a", "b", "c");
				for(var i = 0; i < arguments.length; i++) {
					console.log.call(this, arguments);
				}
				
				return;
			}
			
			oldLog.call(window.console, msg);
			consoleLines.push(msg);
			lineCounter += 2;
			consoleLog.innerHTML += "<br/><span class='consoleGray'>&rsaquo;</span> " + msg;
		};

		console.error = function(msg) {
			oldErr.call(window.console, msg);
			consoleLines.push(msg);
			lineCounter++;
		};

		console.dir = function(obj) {
			oldDir.call(window.console, obj);

			var ul = "<ul><br/><span class='consoleGray'>&rsaquo;</span> " + obj + "";
			
			for(var x in obj) {
				ul += "<li>" + x + ": " + obj[x] + "</li>";
			}
			
			ul += "</ul>";
			
			consoleLines.push(ul);
			lineCounter++;
			consoleLog.innerHTML += ul;
		};

		console.table = function(arr) {
			oldTab.call(window.console, arr);

			var tbl = "<table class='consoleTable'>";
			for(var i = -1, numRows = arr.length; i < numRows; i++) {
				var row = "<tr>";

				if(i === -1) {
					row += "<th>(index)</th>";
						
					for(var j = 0, numCols = arr[0].length; j < numCols; j++) {
						row += "<th>" + j + "</th>";
					}
				} else {
					row += "<th>" + i + "</th>";
					
					for(var j = 0, numCols = arr[0].length; j < numCols; j++) {
						row += "<td>" + arr[i][j] + "</td>";
					}					
				}

				row += "</tr>";
				tbl += row;
			}

			tbl += "</table>";
			consoleLog.innerHTML += "<br/><span class='consoleGray'>&rsaquo;</span> <br/>" + tbl;
			
			console.log(arr);
		};

		console.warn = function(msg){
			oldWarn.call(window.console, msg);
			consoleLines.push(msg);
			lineCounter++;
			consoleLog.innerHTML += "<br/><span class='consoleGray'>&rsaquo;</span><span class='consoleWarn'>" + msg + "</span>";
		};

		console.clear = function(){
			oldClear.call(window.console);
			consoleLog.innerHTML = "";
			consoleEntry.value = "";
		};

		window.clear = window.clear || console.clear;
		window.log = window.log || console.log;

		var sheet;
		if(document.styleSheets.length === 0) {
			sheet = document.createElement("STYLE");
			document.body.appendChild(sheet);
		} else {
			sheet = document.styleSheets[0];
		}
		
		sheet.insertRule("#spaceBuffer {width: 100%;}", 0);
		sheet.insertRule("#consoleDiv {width: 100%; z-index: 100; position: fixed ; left: 0px; bottom: 0;}", 1);
		sheet.insertRule("#consoleLog {height: 100px; width: 100%; text-align: left; overflow-y: scroll; word-wrap: wrap; color: black; background-color: rgba(208, 208, 208, 0.95); border-top: 2px solid gray; font: 13px Arial; padding-left: 3px;}", 2);
		sheet.insertRule("#consoleLog .consoleError {color: red;}", 3);
		sheet.insertRule("#consoleLog .consoleResponse {color: gray;}", 4);
		sheet.insertRule("#consoleEntry {border: 1px solid #58ACF8; border-width: 1px 0; background-color: rgb(192, 192, 192); background-color: rgba(192, 192, 192, 0.95); color: black; height: 15px; width: 100%; font: 13px Arial; padding-left: 3px;}", 5);
		sheet.insertRule("#consoleLog {transition: height .5s;}", 6);
		sheet.insertRule("#consoleLog .consoleGray {color: gray;}", 7);
		sheet.insertRule("#consoleLog table.consoleTable {border-collapse: collapse; width: 100%;}", 8);
		sheet.insertRule("#consoleLog th {border: 1px solid #444; padding: 2px 3px; color: black; font-weight: normal;}", 9);
		sheet.insertRule("#consoleLog td {border: 1px solid #444; padding: 2px 3px; color: #0000e3;}", 10);
		sheet.insertRule("#consoleLog .consoleWarn {color: #FFCC66;}", 11);
		sheet.insertRule("#consoleLog ul {list-style-type: none;}", 12);
	} // End createConsole()

	/**
	 * @description Capture user input and add to the running log.
	 */
	function enterLog(e) {
		var keyNum = e.which || e.keyCode,
			evalResponse;

		if(keyNum !== 13) {
			return;
		}
		
	    var rightText = consoleEntry.value;

		if(rightText === null || typeof rightText === "undefined" || rightText.trim() === "") {
		  return 0; // To avoid drawing blank lines in the console.
		}

		lineCounter++;
		consoleLog.innerHTML += "<br/><span class='consoleGray'>&rsaquo;</span> <span class='enteredText'>" + rightText + "</span>";

		try{
			if(rightText.startsWith("jQuery") && typeof jQuery === "undefined") {
				var s = document.createElement("SCRIPT");
				s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js";
				document.body.appendChild(s);
				var err = new Error();
				err.name = "ReferenceError";
				err.message = "jQuery is not defined. Importing jQuery...";
				throw err;
			} else {
				evalResponse = eval.call(window, rightText.replace(/(?:^var\s)|(?:;var\s)/g, "")); // Local variables will be fairly useless, but true global variabes cannot be created within eval code. So we'll mimick true globals with properties of the window object.
			}
		} catch(err) {
			showError(err);
			return;
		} finally {
			consoleEntry.value = "";
			lineCounter++;
			backtrackCount = lineCounter - 1;
			
			if(typeof evalResponse === "undefined") {
				consoleLog.innerHTML += "<br/><span class='consoleGray'>&lsaquo;</span> <span class='consoleResponse'>undefined</span>";
			} else {
				consoleLog.innerHTML += "<br/><span class='consoleGray'>&lsaquo;</span> <span class='consoleResponse'>" + evalResponse + "</span>";
			}

			consoleLog.scrollTop = consoleLog.scrollHeight;
		}
	} // End enterLog()

	/**
	 * @description Records and displays error values from console evaluations.
	 * @param {Object} err - The Error object passed from enterLog().
	 */
	function showError(err)	{
		consoleLog.innerHTML += "<br/><span class='consoleError'>" + err.name + ": " + err.message + "</span>";
		console.error(err);
	} // End showError()

	/**
	 * @description Allows user to tap on the left portion of a log line (entry or response) to have the line's text populate the input field
	 */
	function copyOldEntry(e) {
		if(e.target) {
			// Grab the clicked line and ensure it was tapped on the left.
			if((e.target.matches("span.enteredText") || e.target.matches("span.consoleResponse")) && e.targetTouches[0].pageX <= 100) {
				consoleEntry.value = e.target.innerHTML;
			}
		}
	} // End copyOldEntry()

	/**
	 * @description Interprets a screen tap. Closes the console log if the tap is on the page but outside of the entire console.
	 * @param {Object} - The TouchEvent created by the tap.
	 */
	function shrinkConsole(e) {
		if(e.target && !e.target.matches("#consoleDiv") && !e.target.matches("#consoleLog") && !e.target.matches("#consoleEntry") && !e.target.matches(".enteredText") && !e.target.matches(".consoleGray")) {
			consoleLog.style.height = "0";
			spaceBufferDiv.style.height = "17px";
		}
	} // End shrinkConsole()

	// Capture what information we can from global errors (e.g., from the implementing developer's own scripts).
	window.onerror = function(msg, url, line, col, error){ MobileBrowserConsole.showError({name: msg, message: error || msg})};

	/**
	 * @description Hide the console.
	 */
	function hide() {
		spaceBufferDiv.style.display = "none";
		consoleDiv.style.display = "none";
	} // End hide()
	
	/**
	 * @description Show the hidden console.
	 */
	function show() {
		spaceBufferDiv.style.display = "block";
		consoleDiv.style.display = "block";
	} // End show()

	/**
	 * @description Reset the original console methods and remove the custom console from the DOM.
	 */
	function destroy() {
		window.console = {
			log: oldLog,
			error: oldErr,
			table: oldTab,
			clear: oldClear,
			dir: oldDir,
			warn: oldWarn
		};
		
		window.console.__proto__ = oldProto;
		document.body.removeChild(spaceBufferDiv);
		document.body.removeChild(consoleDiv);
	}; // End destroy()

	// Expose the object methods to the global scope.
	return {
		createConsole: createConsole,
		create: createConsole,
		enterLog: enterLog,
		showError: showError,
		shrinkConsole: shrinkConsole,
		hide: hide,
		show: show,
		destroy: destroy
	};
}());

window.MBC = window.MBC || MobileBrowserConsole; // alias

// Since the most likely use case is to dynamically create this script to test mobile pages, it will be easier to assume it should be started.
if(typeof window.delayConsole === "undefined") {
	MobileBrowserConsole.createConsole();
}