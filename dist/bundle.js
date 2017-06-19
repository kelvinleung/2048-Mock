/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "88e3c7a4901b9ce64399"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(9)(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

eval("exports = module.exports = __webpack_require__(5)(undefined);\n// imports\n\n\n// module\nexports.push([module.i, \"html, body {\\n  margin: 0;\\n  padding: 0;\\n  background: #faf8ef;\\n  color: #776e65;\\n  font-family: 'Helvetica Neue', Arial, sans-serif;\\n  font-size: 18px;\\n}\\n\\nbody {\\n  margin: 80px 0;\\n}\\n\\n.container {\\n  width: 500px;\\n  margin: 0 auto;\\n}\\n\\n.game-info {\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: flex;\\n  -webkit-box-pack: justify;\\n      -ms-flex-pack: justify;\\n          justify-content: space-between;\\n  -webkit-box-align: start;\\n      -ms-flex-align: start;\\n          align-items: flex-start;\\n  margin-bottom: 20px;\\n}\\n\\n.scores-container {\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: flex;\\n}\\n\\n.score-container, .best-container {\\n  padding: 10px 24px;\\n  border-radius: 3px;\\n  background: #bbada0;\\n}\\n\\n.score-container {\\n  margin-right: 10px;\\n}\\n\\np.score-title {\\n  margin: 0;\\n  margin-bottom: 5px;\\n  text-align: center;\\n  color: #eee4da;\\n  font-size: 15px;\\n}\\n\\n#score, #best {\\n  margin: 0;\\n  color: #fff;\\n  font-size: 28px;\\n  font-weight: bold;\\n  text-align: center;\\n}\\n\\nh1.title {\\n  margin: 0;\\n  font-size: 80px;\\n  font-weight: bold;\\n}\\n\\n.game-controll {\\n  display: -webkit-box;\\n  display: -ms-flexbox;\\n  display: flex;\\n  -webkit-box-pack: justify;\\n      -ms-flex-pack: justify;\\n          justify-content: space-between;\\n  -webkit-box-align: center;\\n      -ms-flex-align: center;\\n          align-items: center;\\n}\\n\\np.game-intro {\\n  margin: 0;\\n}\\n\\n#btn-restart {\\n  height: 48px;\\n  line-height: 48px;\\n  border-radius: 3px;\\n  padding: 0 20px;\\n  background: #8f7a66;\\n  color: #f9f6f2;\\n  cursor: pointer;\\n}\\n\\n.game-container {\\n  position: relative;\\n  padding: 15px;\\n  background: #bbada0;\\n  border-radius: 6px;\\n  width: 500px;\\n  height: 500px;\\n  margin-top: 40px;\\n  box-sizing: border-box;\\n}\\n\\n.grid-container {\\n  position: absolute;\\n  z-index: 1;\\n}\\n\\n.grid-row {\\n  margin-bottom: 15px;\\n}\\n\\n.grid-row:last-child {\\n  margin-bottom: 0;\\n}\\n\\n.grid-row::after {\\n  content: '';\\n  display: block;\\n  clear: both;\\n}\\n\\n.grid-cell {\\n  width: 106.25px;\\n  height: 106.25px;\\n  margin-right: 15px;\\n  float: left;\\n  border-radius: 3px;\\n  background: rgba(238, 228, 218, .35);\\n}\\n\\n.grid-cell:last-child {\\n  margin-right: 0;\\n}\\n\\n.tile-container {\\n  position: absolute;\\n  z-index: 2;\\n}\\n\\n.tile, .tile .tile-inner {\\n  width: 107px;\\n  height: 107px;\\n  line-height: 107px;\\n}\\n\\n.tile {\\n  position: absolute;\\n  -webkit-transition: 100ms ease-in-out;\\n  transition: 100ms ease-in-out;\\n  transition-property: -webkit-transform;\\n  -webkit-transition-property: -webkit-transform;\\n  transition-property: transform;\\n  transition-property: transform, -webkit-transform;\\n}\\n\\n.tile .tile-inner {\\n  border-radius: 3px;\\n  background: #eee4da;\\n  text-align: center;\\n  font-weight: bold;\\n  z-index: 10;\\n  font-size: 55px;\\n}\\n\\n.tile.tile-position-0-0 {\\n  -webkit-transform: translate(0px, 0px);\\n  transform: translate(0px, 0px);\\n}\\n\\n.tile.tile-position-0-1 {\\n  -webkit-transform: translate(0px, 121px);\\n  transform: translate(0px, 121px);\\n}\\n\\n.tile.tile-position-0-2 {\\n  -webkit-transform: translate(0px, 242px);\\n  transform: translate(0px, 242px);\\n}\\n\\n.tile.tile-position-0-3 {\\n  -webkit-transform: translate(0px, 363px);\\n  transform: translate(0px, 363px);\\n}\\n\\n.tile.tile-position-1-0 {\\n  -webkit-transform: translate(121px, 0px);\\n  transform: translate(121px, 0px);\\n}\\n\\n.tile.tile-position-1-1 {\\n  -webkit-transform: translate(121px, 121px);\\n  transform: translate(121px, 121px);\\n}\\n\\n.tile.tile-position-1-2 {\\n  -webkit-transform: translate(121px, 242px);\\n  transform: translate(121px, 242px);\\n}\\n\\n.tile.tile-position-1-3 {\\n  -webkit-transform: translate(121px, 363px);\\n  transform: translate(121px, 363px);\\n}\\n\\n.tile.tile-position-2-0 {\\n  -webkit-transform: translate(242px, 0px);\\n  transform: translate(242px, 0px);\\n}\\n\\n.tile.tile-position-2-1 {\\n  -webkit-transform: translate(242px, 121px);\\n  transform: translate(242px, 121px);\\n}\\n\\n.tile.tile-position-2-2 {\\n  -webkit-transform: translate(242px, 242px);\\n  transform: translate(242px, 242px);\\n}\\n\\n.tile.tile-position-2-3 {\\n  -webkit-transform: translate(242px, 363px);\\n  transform: translate(242px, 363px);\\n}\\n\\n.tile.tile-position-3-0 {\\n  -webkit-transform: translate(363px, 0px);\\n  transform: translate(363px, 0px);\\n}\\n\\n.tile.tile-position-3-1 {\\n  -webkit-transform: translate(363px, 121px);\\n  transform: translate(363px, 121px);\\n}\\n\\n.tile.tile-position-3-2 {\\n  -webkit-transform: translate(363px, 242px);\\n  transform: translate(363px, 242px);\\n}\\n\\n.tile.tile-position-3-3 {\\n  -webkit-transform: translate(363px, 363px);\\n  transform: translate(363px, 363px);\\n}\\n\\n@-webkit-keyframes appear {\\n  0% {\\n    opacity: 0;\\n    -webkit-transform: scale(0);\\n    transform: scale(0);\\n  }\\n  100% {\\n    opacity: 1;\\n    -webkit-transform: scale(1);\\n    transform: scale(1);\\n  }\\n}\\n\\n@keyframes appear {\\n  0% {\\n    opacity: 0;\\n    -webkit-transform: scale(0);\\n    transform: scale(0);\\n  }\\n  100% {\\n    opacity: 1;\\n    -webkit-transform: scale(1);\\n    transform: scale(1);\\n  }\\n}\\n\\n.tile-new .tile-inner {\\n  -webkit-animation: appear 200ms ease 100ms;\\n          animation: appear 200ms ease 100ms;\\n  -webkit-animation-fill-mode: backwards;\\n          animation-fill-mode: backwards;\\n}\\n\\n@-webkit-keyframes pop {\\n  0% {\\n    -webkit-transform: scale(0);\\n            transform: scale(0);\\n  }\\n  50% {\\n    -webkit-transform: scale(1.2);\\n            transform: scale(1.2);\\n  }\\n  100% {\\n    -webkit-transform: scale(1);\\n            transform: scale(1);\\n  }\\n}\\n\\n@keyframes pop {\\n  0% {\\n    -webkit-transform: scale(0);\\n            transform: scale(0);\\n  }\\n  50% {\\n    -webkit-transform: scale(1.2);\\n            transform: scale(1.2);\\n  }\\n  100% {\\n    -webkit-transform: scale(1);\\n            transform: scale(1);\\n  }\\n}\\n\\n.tile-merged .tile-inner {\\n  z-index: 20;\\n  -webkit-animation: pop 200ms ease 100ms;\\n          animation: pop 200ms ease 100ms;\\n  -webkit-animation-fill-mode: backwards;\\n          animation-fill-mode: backwards;\\n}\\n\", \"\"]);\n\n// exports\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS9tYWluLmNzcz85NDk1Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7OztBQUdBO0FBQ0EscUNBQXNDLGNBQWMsZUFBZSx3QkFBd0IsbUJBQW1CLHFEQUFxRCxvQkFBb0IsR0FBRyxVQUFVLG1CQUFtQixHQUFHLGdCQUFnQixpQkFBaUIsbUJBQW1CLEdBQUcsZ0JBQWdCLHlCQUF5Qix5QkFBeUIsa0JBQWtCLDhCQUE4QiwrQkFBK0IsMkNBQTJDLDZCQUE2Qiw4QkFBOEIsb0NBQW9DLHdCQUF3QixHQUFHLHVCQUF1Qix5QkFBeUIseUJBQXlCLGtCQUFrQixHQUFHLHVDQUF1Qyx1QkFBdUIsdUJBQXVCLHdCQUF3QixHQUFHLHNCQUFzQix1QkFBdUIsR0FBRyxtQkFBbUIsY0FBYyx1QkFBdUIsdUJBQXVCLG1CQUFtQixvQkFBb0IsR0FBRyxtQkFBbUIsY0FBYyxnQkFBZ0Isb0JBQW9CLHNCQUFzQix1QkFBdUIsR0FBRyxjQUFjLGNBQWMsb0JBQW9CLHNCQUFzQixHQUFHLG9CQUFvQix5QkFBeUIseUJBQXlCLGtCQUFrQiw4QkFBOEIsK0JBQStCLDJDQUEyQyw4QkFBOEIsK0JBQStCLGdDQUFnQyxHQUFHLGtCQUFrQixjQUFjLEdBQUcsa0JBQWtCLGlCQUFpQixzQkFBc0IsdUJBQXVCLG9CQUFvQix3QkFBd0IsbUJBQW1CLG9CQUFvQixHQUFHLHFCQUFxQix1QkFBdUIsa0JBQWtCLHdCQUF3Qix1QkFBdUIsaUJBQWlCLGtCQUFrQixxQkFBcUIsMkJBQTJCLEdBQUcscUJBQXFCLHVCQUF1QixlQUFlLEdBQUcsZUFBZSx3QkFBd0IsR0FBRywwQkFBMEIscUJBQXFCLEdBQUcsc0JBQXNCLGdCQUFnQixtQkFBbUIsZ0JBQWdCLEdBQUcsZ0JBQWdCLG9CQUFvQixxQkFBcUIsdUJBQXVCLGdCQUFnQix1QkFBdUIseUNBQXlDLEdBQUcsMkJBQTJCLG9CQUFvQixHQUFHLHFCQUFxQix1QkFBdUIsZUFBZSxHQUFHLDhCQUE4QixpQkFBaUIsa0JBQWtCLHVCQUF1QixHQUFHLFdBQVcsdUJBQXVCLDBDQUEwQyxrQ0FBa0MsMkNBQTJDLG1EQUFtRCxtQ0FBbUMsc0RBQXNELEdBQUcsdUJBQXVCLHVCQUF1Qix3QkFBd0IsdUJBQXVCLHNCQUFzQixnQkFBZ0Isb0JBQW9CLEdBQUcsNkJBQTZCLDJDQUEyQyxtQ0FBbUMsR0FBRyw2QkFBNkIsNkNBQTZDLHFDQUFxQyxHQUFHLDZCQUE2Qiw2Q0FBNkMscUNBQXFDLEdBQUcsNkJBQTZCLDZDQUE2QyxxQ0FBcUMsR0FBRyw2QkFBNkIsNkNBQTZDLHFDQUFxQyxHQUFHLDZCQUE2QiwrQ0FBK0MsdUNBQXVDLEdBQUcsNkJBQTZCLCtDQUErQyx1Q0FBdUMsR0FBRyw2QkFBNkIsK0NBQStDLHVDQUF1QyxHQUFHLDZCQUE2Qiw2Q0FBNkMscUNBQXFDLEdBQUcsNkJBQTZCLCtDQUErQyx1Q0FBdUMsR0FBRyw2QkFBNkIsK0NBQStDLHVDQUF1QyxHQUFHLDZCQUE2QiwrQ0FBK0MsdUNBQXVDLEdBQUcsNkJBQTZCLDZDQUE2QyxxQ0FBcUMsR0FBRyw2QkFBNkIsK0NBQStDLHVDQUF1QyxHQUFHLDZCQUE2QiwrQ0FBK0MsdUNBQXVDLEdBQUcsNkJBQTZCLCtDQUErQyx1Q0FBdUMsR0FBRywrQkFBK0IsUUFBUSxpQkFBaUIsa0NBQWtDLDBCQUEwQixLQUFLLFVBQVUsaUJBQWlCLGtDQUFrQywwQkFBMEIsS0FBSyxHQUFHLHVCQUF1QixRQUFRLGlCQUFpQixrQ0FBa0MsMEJBQTBCLEtBQUssVUFBVSxpQkFBaUIsa0NBQWtDLDBCQUEwQixLQUFLLEdBQUcsMkJBQTJCLCtDQUErQywrQ0FBK0MsMkNBQTJDLDJDQUEyQyxHQUFHLDRCQUE0QixRQUFRLGtDQUFrQyxrQ0FBa0MsS0FBSyxTQUFTLG9DQUFvQyxvQ0FBb0MsS0FBSyxVQUFVLGtDQUFrQyxrQ0FBa0MsS0FBSyxHQUFHLG9CQUFvQixRQUFRLGtDQUFrQyxrQ0FBa0MsS0FBSyxTQUFTLG9DQUFvQyxvQ0FBb0MsS0FBSyxVQUFVLGtDQUFrQyxrQ0FBa0MsS0FBSyxHQUFHLDhCQUE4QixnQkFBZ0IsNENBQTRDLDRDQUE0QywyQ0FBMkMsMkNBQTJDLEdBQUc7O0FBRWpnTSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiaHRtbCwgYm9keSB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYmFja2dyb3VuZDogI2ZhZjhlZjtcXG4gIGNvbG9yOiAjNzc2ZTY1O1xcbiAgZm9udC1mYW1pbHk6ICdIZWx2ZXRpY2EgTmV1ZScsIEFyaWFsLCBzYW5zLXNlcmlmO1xcbiAgZm9udC1zaXplOiAxOHB4O1xcbn1cXG5cXG5ib2R5IHtcXG4gIG1hcmdpbjogODBweCAwO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIHdpZHRoOiA1MDBweDtcXG4gIG1hcmdpbjogMCBhdXRvO1xcbn1cXG5cXG4uZ2FtZS1pbmZvIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtcGFjazoganVzdGlmeTtcXG4gICAgICAtbXMtZmxleC1wYWNrOiBqdXN0aWZ5O1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAtd2Via2l0LWJveC1hbGlnbjogc3RhcnQ7XFxuICAgICAgLW1zLWZsZXgtYWxpZ246IHN0YXJ0O1xcbiAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxufVxcblxcbi5zY29yZXMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG5cXG4uc2NvcmUtY29udGFpbmVyLCAuYmVzdC1jb250YWluZXIge1xcbiAgcGFkZGluZzogMTBweCAyNHB4O1xcbiAgYm9yZGVyLXJhZGl1czogM3B4O1xcbiAgYmFja2dyb3VuZDogI2JiYWRhMDtcXG59XFxuXFxuLnNjb3JlLWNvbnRhaW5lciB7XFxuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XFxufVxcblxcbnAuc2NvcmUtdGl0bGUge1xcbiAgbWFyZ2luOiAwO1xcbiAgbWFyZ2luLWJvdHRvbTogNXB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICNlZWU0ZGE7XFxuICBmb250LXNpemU6IDE1cHg7XFxufVxcblxcbiNzY29yZSwgI2Jlc3Qge1xcbiAgbWFyZ2luOiAwO1xcbiAgY29sb3I6ICNmZmY7XFxuICBmb250LXNpemU6IDI4cHg7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuaDEudGl0bGUge1xcbiAgbWFyZ2luOiAwO1xcbiAgZm9udC1zaXplOiA4MHB4O1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxufVxcblxcbi5nYW1lLWNvbnRyb2xsIHtcXG4gIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcbiAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgLXdlYmtpdC1ib3gtcGFjazoganVzdGlmeTtcXG4gICAgICAtbXMtZmxleC1wYWNrOiBqdXN0aWZ5O1xcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyO1xcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XFxuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbnAuZ2FtZS1pbnRybyB7XFxuICBtYXJnaW46IDA7XFxufVxcblxcbiNidG4tcmVzdGFydCB7XFxuICBoZWlnaHQ6IDQ4cHg7XFxuICBsaW5lLWhlaWdodDogNDhweDtcXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcXG4gIHBhZGRpbmc6IDAgMjBweDtcXG4gIGJhY2tncm91bmQ6ICM4ZjdhNjY7XFxuICBjb2xvcjogI2Y5ZjZmMjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmdhbWUtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmc6IDE1cHg7XFxuICBiYWNrZ3JvdW5kOiAjYmJhZGEwO1xcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xcbiAgd2lkdGg6IDUwMHB4O1xcbiAgaGVpZ2h0OiA1MDBweDtcXG4gIG1hcmdpbi10b3A6IDQwcHg7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG4uZ3JpZC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgei1pbmRleDogMTtcXG59XFxuXFxuLmdyaWQtcm93IHtcXG4gIG1hcmdpbi1ib3R0b206IDE1cHg7XFxufVxcblxcbi5ncmlkLXJvdzpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxufVxcblxcbi5ncmlkLXJvdzo6YWZ0ZXIge1xcbiAgY29udGVudDogJyc7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGNsZWFyOiBib3RoO1xcbn1cXG5cXG4uZ3JpZC1jZWxsIHtcXG4gIHdpZHRoOiAxMDYuMjVweDtcXG4gIGhlaWdodDogMTA2LjI1cHg7XFxuICBtYXJnaW4tcmlnaHQ6IDE1cHg7XFxuICBmbG9hdDogbGVmdDtcXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMjM4LCAyMjgsIDIxOCwgLjM1KTtcXG59XFxuXFxuLmdyaWQtY2VsbDpsYXN0LWNoaWxkIHtcXG4gIG1hcmdpbi1yaWdodDogMDtcXG59XFxuXFxuLnRpbGUtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHotaW5kZXg6IDI7XFxufVxcblxcbi50aWxlLCAudGlsZSAudGlsZS1pbm5lciB7XFxuICB3aWR0aDogMTA3cHg7XFxuICBoZWlnaHQ6IDEwN3B4O1xcbiAgbGluZS1oZWlnaHQ6IDEwN3B4O1xcbn1cXG5cXG4udGlsZSB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAtd2Via2l0LXRyYW5zaXRpb246IDEwMG1zIGVhc2UtaW4tb3V0O1xcbiAgdHJhbnNpdGlvbjogMTAwbXMgZWFzZS1pbi1vdXQ7XFxuICB0cmFuc2l0aW9uLXByb3BlcnR5OiAtd2Via2l0LXRyYW5zZm9ybTtcXG4gIC13ZWJraXQtdHJhbnNpdGlvbi1wcm9wZXJ0eTogLXdlYmtpdC10cmFuc2Zvcm07XFxuICB0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm07XFxuICB0cmFuc2l0aW9uLXByb3BlcnR5OiB0cmFuc2Zvcm0sIC13ZWJraXQtdHJhbnNmb3JtO1xcbn1cXG5cXG4udGlsZSAudGlsZS1pbm5lciB7XFxuICBib3JkZXItcmFkaXVzOiAzcHg7XFxuICBiYWNrZ3JvdW5kOiAjZWVlNGRhO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICB6LWluZGV4OiAxMDtcXG4gIGZvbnQtc2l6ZTogNTVweDtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0wLTAge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDBweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDBweCk7XFxufVxcblxcbi50aWxlLnRpbGUtcG9zaXRpb24tMC0xIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4LCAxMjFweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDEyMXB4KTtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0wLTIge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgwcHgsIDI0MnB4KTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgMjQycHgpO1xcbn1cXG5cXG4udGlsZS50aWxlLXBvc2l0aW9uLTAtMyB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDBweCwgMzYzcHgpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMHB4LCAzNjNweCk7XFxufVxcblxcbi50aWxlLnRpbGUtcG9zaXRpb24tMS0wIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTIxcHgsIDBweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMjFweCwgMHB4KTtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0xLTEge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMjFweCwgMTIxcHgpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTIxcHgsIDEyMXB4KTtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0xLTIge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMjFweCwgMjQycHgpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTIxcHgsIDI0MnB4KTtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0xLTMge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgxMjFweCwgMzYzcHgpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMTIxcHgsIDM2M3B4KTtcXG59XFxuXFxuLnRpbGUudGlsZS1wb3NpdGlvbi0yLTAge1xcbiAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgyNDJweCwgMHB4KTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDI0MnB4LCAwcHgpO1xcbn1cXG5cXG4udGlsZS50aWxlLXBvc2l0aW9uLTItMSB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDI0MnB4LCAxMjFweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgyNDJweCwgMTIxcHgpO1xcbn1cXG5cXG4udGlsZS50aWxlLXBvc2l0aW9uLTItMiB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDI0MnB4LCAyNDJweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgyNDJweCwgMjQycHgpO1xcbn1cXG5cXG4udGlsZS50aWxlLXBvc2l0aW9uLTItMyB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDI0MnB4LCAzNjNweCk7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgyNDJweCwgMzYzcHgpO1xcbn1cXG5cXG4udGlsZS50aWxlLXBvc2l0aW9uLTMtMCB7XFxuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKDM2M3B4LCAwcHgpO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoMzYzcHgsIDBweCk7XFxufVxcblxcbi50aWxlLnRpbGUtcG9zaXRpb24tMy0xIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMzYzcHgsIDEyMXB4KTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDM2M3B4LCAxMjFweCk7XFxufVxcblxcbi50aWxlLnRpbGUtcG9zaXRpb24tMy0yIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMzYzcHgsIDI0MnB4KTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDM2M3B4LCAyNDJweCk7XFxufVxcblxcbi50aWxlLnRpbGUtcG9zaXRpb24tMy0zIHtcXG4gIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoMzYzcHgsIDM2M3B4KTtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKDM2M3B4LCAzNjNweCk7XFxufVxcblxcbkAtd2Via2l0LWtleWZyYW1lcyBhcHBlYXIge1xcbiAgMCUge1xcbiAgICBvcGFjaXR5OiAwO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgb3BhY2l0eTogMTtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGFwcGVhciB7XFxuICAwJSB7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgwKTtcXG4gICAgdHJhbnNmb3JtOiBzY2FsZSgwKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICBvcGFjaXR5OiAxO1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcblxcbi50aWxlLW5ldyAudGlsZS1pbm5lciB7XFxuICAtd2Via2l0LWFuaW1hdGlvbjogYXBwZWFyIDIwMG1zIGVhc2UgMTAwbXM7XFxuICAgICAgICAgIGFuaW1hdGlvbjogYXBwZWFyIDIwMG1zIGVhc2UgMTAwbXM7XFxuICAtd2Via2l0LWFuaW1hdGlvbi1maWxsLW1vZGU6IGJhY2t3YXJkcztcXG4gICAgICAgICAgYW5pbWF0aW9uLWZpbGwtbW9kZTogYmFja3dhcmRzO1xcbn1cXG5cXG5ALXdlYmtpdC1rZXlmcmFtZXMgcG9wIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICA1MCUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMS4yKTtcXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgcG9wIHtcXG4gIDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDApO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMCk7XFxuICB9XFxuICA1MCUge1xcbiAgICAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoMS4yKTtcXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMik7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm06IHNjYWxlKDEpO1xcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XFxuICB9XFxufVxcblxcbi50aWxlLW1lcmdlZCAudGlsZS1pbm5lciB7XFxuICB6LWluZGV4OiAyMDtcXG4gIC13ZWJraXQtYW5pbWF0aW9uOiBwb3AgMjAwbXMgZWFzZSAxMDBtcztcXG4gICAgICAgICAgYW5pbWF0aW9uOiBwb3AgMjAwbXMgZWFzZSAxMDBtcztcXG4gIC13ZWJraXQtYW5pbWF0aW9uLWZpbGwtbW9kZTogYmFja3dhcmRzO1xcbiAgICAgICAgICBhbmltYXRpb24tZmlsbC1tb2RlOiBiYWNrd2FyZHM7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vc3R5bGUvbWFpbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

eval("// style-loader: Adds some css to the DOM by adding a <style> tag\n\n// load the styles\nvar content = __webpack_require__(0);\nif(typeof content === 'string') content = [[module.i, content, '']];\n// Prepare cssTransformation\nvar transform;\n\nvar options = {}\noptions.transform = transform\n// add the styles to the DOM\nvar update = __webpack_require__(6)(content, options);\nif(content.locals) module.exports = content.locals;\n// Hot Module Replacement\nif(true) {\n\t// When the styles change, update the <style> tags\n\tif(!content.locals) {\n\t\tmodule.hot.accept(0, function() {\n\t\t\tvar newContent = __webpack_require__(0);\n\t\t\tif(typeof newContent === 'string') newContent = [[module.i, newContent, '']];\n\t\t\tupdate(newContent);\n\t\t});\n\t}\n\t// When the module is disposed, remove the <style> tags\n\tmodule.hot.dispose(function() { update(); });\n}//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zdHlsZS9tYWluLmNzcz84ZGUzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMiLCJmaWxlIjoiMS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21haW4uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21haW4uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuL21haW4uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3N0eWxlL21haW4uY3NzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tile__ = __webpack_require__(10);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__grid__ = __webpack_require__(8);\n/* \n  整个游戏的管理\n*/\n\n\n\n\nclass GameManager {\n  constructor(size, Actuator, InputManager) {\n    this.size = size\n    this.inputManager = new InputManager\n    this.actuator = new Actuator\n    this.startTiles = 2\n    // 记录当前最高分数\n    this.best = 0\n\n    // 绑定 this 到 move()，为了后续调用的正确，this = new GameManager\n    this.inputManager.addEventHandler('move', this.move.bind(this))\n    // 重新开始游戏\n    this.inputManager.addEventHandler('restart', this.restart.bind(this))\n\n    this.setup()\n  }\n  \n  // 初始化：新建网格，添加初始块，DOM 初始化\n  setup() {\n    this.grid = new __WEBPACK_IMPORTED_MODULE_1__grid__[\"a\" /* Grid */](this.size)\n    // 记录当前的得分\n    this.score = 0\n    this.addStartTiles()\n    this.actuate()\n  }\n\n  // 重新开始游戏\n  restart() {\n    // 重新初始化\n    this.setup()\n  }\n\n  // 初始化最开始的块\n  addStartTiles() {\n    for (let i = 0; i < this.startTiles; i++) {\n      this.addRandomTile()\n    }\n  }\n\n  // 在随机位置添加块\n  addRandomTile() {\n    if (this.grid.cellsAvailable()) {\n      let value = Math.random() < 0.9 ? 2 : 4\n      let tile = new __WEBPACK_IMPORTED_MODULE_0__tile__[\"a\" /* Tile */](this.grid.randomAvailableCell(), value)\n      this.grid.insertTile(tile)\n    }\n  }\n\n  // DOM 初始化\n  actuate() {\n    this.actuator.actuate(\n      this.grid,\n      {\n        score: this.score,\n        best: this.best\n      }\n    )\n  }\n\n  /* ---------- 游戏操作部分 ---------- */\n\n  // 处理移动的逻辑，按键后的操作\n  move(direction) {\n    let cell, tile\n    // 与按键对应的向量\n    let vector = this.getVector(direction)\n    // 用于遍历的二维数组，从远到近\n    let traversals = this.buildTraversals(vector)\n    let moved = false\n\n    // 记录移动前的位置，保存到块中\n    this.prepareTiles()\n\n    // 开始遍历所有位置，找到块，找到块的最远可移动位置\n    traversals.x.forEach((x) => {\n      traversals.y.forEach((y) => {\n        cell = { x: x, y: y }\n        tile = this.grid.cellContent(cell)\n\n        if (tile) {\n          // 寻找到块要移动到的最远位置\n          let position = this.findFarthestPosition(cell, vector)\n          let next = this.grid.cellContent(position.next)\n          // 只能合并一次，合并条件为两者的值相等\n          if (next && next.value === tile.value && !next.mergedFrom) {\n            let mergedTile = new __WEBPACK_IMPORTED_MODULE_0__tile__[\"a\" /* Tile */](position.next, tile.value * 2)\n            mergedTile.mergedFrom = [tile, next]\n            // 只保留合并后的块\n            this.grid.insertTile(mergedTile)\n            this.grid.removeTile(tile)\n\n            tile.updatePosition(position.next)\n            // 更新当前的得分\n            this.score += mergedTile.value\n            // 更新当前最高得分记录\n            if (this.score > this.best) {\n              this.best = this.score\n            }\n          } else {\n            // 将块移动到最远的位置，即更新块的位置坐标\n            this.moveTile(tile, position.farthest)\n          }\n\n          // 判断块的前后坐标是否一致，即是否有移动\n          if (!this.positionsEqual(tile, cell)) {\n            moved = true\n          }\n        }\n      })\n    })\n\n    // 移动后增加新的块，并刷新 DOM\n    if (moved) {\n      this.addRandomTile()\n      this.actuate()\n    }\n  }\n\n  // 移动块，实际为更新块的位置\n  moveTile(tile, cell) {\n    this.grid.cells[tile.x][tile.y] = null\n    this.grid.cells[cell.x][cell.y] = tile\n    // 浅拷贝\n    tile.updatePosition(cell)\n  }\n\n  // 记录所有块移动前的位置，保存到块中\n  prepareTiles() {\n    this.grid.eachCell((x, y, tile) => {\n      if (tile) {\n        // 移动前清除所有已经合并的块\n        tile.mergedFrom = null\n        tile.savePosition()\n      }\n    })\n  }\n\n  // 根据按键方向，返回对应的向量，用于遍历\n  getVector(direction) {\n    const map = {\n      'up': { x: 0, y: -1 },\n      'right': { x: 1, y: 0 },\n      'down': { x: 0, y: 1 },\n      'left': { x: -1, y: 0 }\n    }\n    return map[direction]\n  }\n\n  // 返回一个二维数组，用于之后根据方向，从远到近遍历整个网格\n  buildTraversals(vector) {\n    let traversals = { x: [], y: [] }\n\n    for (let i = 0; i < this.size; i++) {\n      traversals.x.push(i)\n      traversals.y.push(i)\n    }\n    // 根据方向，从最远的位置到最近，块是先移动远的再到近的\n    if (vector.x === 1) {\n      traversals.x = traversals.x.reverse()\n    }\n    if (vector.y === 1) {\n      traversals.y = traversals.y.reverse()\n    }\n\n    return traversals\n  }\n\n  // 寻找最远的可移动位置，即根据向量，寻找空置的格，直到有障碍出现（格不为空）\n  findFarthestPosition(cell, vector) {\n    let previous\n    do {\n      previous = cell\n      // 根据向量，往对应的方向走一格\n      cell = {\n        x: previous.x + vector.x,\n        y: previous.y + vector.y\n      }\n    } while (this.grid.withinBounds(cell) && this.grid.cellAvailable(cell))\n    return { farthest: previous, next: cell }\n  }\n\n  // 判断块的前后位置是否一致，即是否有移动\n  positionsEqual(before, after) {\n    return before.x === after.x && before.y === after.y\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = GameManager;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS1tYW5hZ2VyLmpzPzMxNTAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFDQTtBQUNBOztBQUVlO0FBQ0E7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLHFCQUFxQjtBQUN4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLGNBQWM7QUFDM0IsZ0JBQWdCLGFBQWE7QUFDN0IsZUFBZSxhQUFhO0FBQzVCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFzQjs7QUFFdEIsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxZQUFZO0FBQ1o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUEiLCJmaWxlIjoiMi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFxuICDmlbTkuKrmuLjmiI/nmoTnrqHnkIZcbiovXG5cbmltcG9ydCB7IFRpbGUgfSBmcm9tICcuL3RpbGUnXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAnLi9ncmlkJ1xuXG5leHBvcnQgY2xhc3MgR2FtZU1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcihzaXplLCBBY3R1YXRvciwgSW5wdXRNYW5hZ2VyKSB7XG4gICAgdGhpcy5zaXplID0gc2l6ZVxuICAgIHRoaXMuaW5wdXRNYW5hZ2VyID0gbmV3IElucHV0TWFuYWdlclxuICAgIHRoaXMuYWN0dWF0b3IgPSBuZXcgQWN0dWF0b3JcbiAgICB0aGlzLnN0YXJ0VGlsZXMgPSAyXG4gICAgLy8g6K6w5b2V5b2T5YmN5pyA6auY5YiG5pWwXG4gICAgdGhpcy5iZXN0ID0gMFxuXG4gICAgLy8g57uR5a6aIHRoaXMg5YiwIG1vdmUoKe+8jOS4uuS6huWQjue7reiwg+eUqOeahOato+ehru+8jHRoaXMgPSBuZXcgR2FtZU1hbmFnZXJcbiAgICB0aGlzLmlucHV0TWFuYWdlci5hZGRFdmVudEhhbmRsZXIoJ21vdmUnLCB0aGlzLm1vdmUuYmluZCh0aGlzKSlcbiAgICAvLyDph43mlrDlvIDlp4vmuLjmiI9cbiAgICB0aGlzLmlucHV0TWFuYWdlci5hZGRFdmVudEhhbmRsZXIoJ3Jlc3RhcnQnLCB0aGlzLnJlc3RhcnQuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuc2V0dXAoKVxuICB9XG4gIFxuICAvLyDliJ3lp4vljJbvvJrmlrDlu7rnvZHmoLzvvIzmt7vliqDliJ3lp4vlnZfvvIxET00g5Yid5aeL5YyWXG4gIHNldHVwKCkge1xuICAgIHRoaXMuZ3JpZCA9IG5ldyBHcmlkKHRoaXMuc2l6ZSlcbiAgICAvLyDorrDlvZXlvZPliY3nmoTlvpfliIZcbiAgICB0aGlzLnNjb3JlID0gMFxuICAgIHRoaXMuYWRkU3RhcnRUaWxlcygpXG4gICAgdGhpcy5hY3R1YXRlKClcbiAgfVxuXG4gIC8vIOmHjeaWsOW8gOWni+a4uOaIj1xuICByZXN0YXJ0KCkge1xuICAgIC8vIOmHjeaWsOWIneWni+WMllxuICAgIHRoaXMuc2V0dXAoKVxuICB9XG5cbiAgLy8g5Yid5aeL5YyW5pyA5byA5aeL55qE5Z2XXG4gIGFkZFN0YXJ0VGlsZXMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXJ0VGlsZXM7IGkrKykge1xuICAgICAgdGhpcy5hZGRSYW5kb21UaWxlKClcbiAgICB9XG4gIH1cblxuICAvLyDlnKjpmo/mnLrkvY3nva7mt7vliqDlnZdcbiAgYWRkUmFuZG9tVGlsZSgpIHtcbiAgICBpZiAodGhpcy5ncmlkLmNlbGxzQXZhaWxhYmxlKCkpIHtcbiAgICAgIGxldCB2YWx1ZSA9IE1hdGgucmFuZG9tKCkgPCAwLjkgPyAyIDogNFxuICAgICAgbGV0IHRpbGUgPSBuZXcgVGlsZSh0aGlzLmdyaWQucmFuZG9tQXZhaWxhYmxlQ2VsbCgpLCB2YWx1ZSlcbiAgICAgIHRoaXMuZ3JpZC5pbnNlcnRUaWxlKHRpbGUpXG4gICAgfVxuICB9XG5cbiAgLy8gRE9NIOWIneWni+WMllxuICBhY3R1YXRlKCkge1xuICAgIHRoaXMuYWN0dWF0b3IuYWN0dWF0ZShcbiAgICAgIHRoaXMuZ3JpZCxcbiAgICAgIHtcbiAgICAgICAgc2NvcmU6IHRoaXMuc2NvcmUsXG4gICAgICAgIGJlc3Q6IHRoaXMuYmVzdFxuICAgICAgfVxuICAgIClcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0g5ri45oiP5pON5L2c6YOo5YiGIC0tLS0tLS0tLS0gKi9cblxuICAvLyDlpITnkIbnp7vliqjnmoTpgLvovpHvvIzmjInplK7lkI7nmoTmk43kvZxcbiAgbW92ZShkaXJlY3Rpb24pIHtcbiAgICBsZXQgY2VsbCwgdGlsZVxuICAgIC8vIOS4juaMiemUruWvueW6lOeahOWQkemHj1xuICAgIGxldCB2ZWN0b3IgPSB0aGlzLmdldFZlY3RvcihkaXJlY3Rpb24pXG4gICAgLy8g55So5LqO6YGN5Y6G55qE5LqM57u05pWw57uE77yM5LuO6L+c5Yiw6L+RXG4gICAgbGV0IHRyYXZlcnNhbHMgPSB0aGlzLmJ1aWxkVHJhdmVyc2Fscyh2ZWN0b3IpXG4gICAgbGV0IG1vdmVkID0gZmFsc2VcblxuICAgIC8vIOiusOW9leenu+WKqOWJjeeahOS9jee9ru+8jOS/neWtmOWIsOWdl+S4rVxuICAgIHRoaXMucHJlcGFyZVRpbGVzKClcblxuICAgIC8vIOW8gOWni+mBjeWOhuaJgOacieS9jee9ru+8jOaJvuWIsOWdl++8jOaJvuWIsOWdl+eahOacgOi/nOWPr+enu+WKqOS9jee9rlxuICAgIHRyYXZlcnNhbHMueC5mb3JFYWNoKCh4KSA9PiB7XG4gICAgICB0cmF2ZXJzYWxzLnkuZm9yRWFjaCgoeSkgPT4ge1xuICAgICAgICBjZWxsID0geyB4OiB4LCB5OiB5IH1cbiAgICAgICAgdGlsZSA9IHRoaXMuZ3JpZC5jZWxsQ29udGVudChjZWxsKVxuXG4gICAgICAgIGlmICh0aWxlKSB7XG4gICAgICAgICAgLy8g5a+75om+5Yiw5Z2X6KaB56e75Yqo5Yiw55qE5pyA6L+c5L2N572uXG4gICAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5maW5kRmFydGhlc3RQb3NpdGlvbihjZWxsLCB2ZWN0b3IpXG4gICAgICAgICAgbGV0IG5leHQgPSB0aGlzLmdyaWQuY2VsbENvbnRlbnQocG9zaXRpb24ubmV4dClcbiAgICAgICAgICAvLyDlj6rog73lkIjlubbkuIDmrKHvvIzlkIjlubbmnaHku7bkuLrkuKTogIXnmoTlgLznm7jnrYlcbiAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0LnZhbHVlID09PSB0aWxlLnZhbHVlICYmICFuZXh0Lm1lcmdlZEZyb20pIHtcbiAgICAgICAgICAgIGxldCBtZXJnZWRUaWxlID0gbmV3IFRpbGUocG9zaXRpb24ubmV4dCwgdGlsZS52YWx1ZSAqIDIpXG4gICAgICAgICAgICBtZXJnZWRUaWxlLm1lcmdlZEZyb20gPSBbdGlsZSwgbmV4dF1cbiAgICAgICAgICAgIC8vIOWPquS/neeVmeWQiOW5tuWQjueahOWdl1xuICAgICAgICAgICAgdGhpcy5ncmlkLmluc2VydFRpbGUobWVyZ2VkVGlsZSlcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5yZW1vdmVUaWxlKHRpbGUpXG5cbiAgICAgICAgICAgIHRpbGUudXBkYXRlUG9zaXRpb24ocG9zaXRpb24ubmV4dClcbiAgICAgICAgICAgIC8vIOabtOaWsOW9k+WJjeeahOW+l+WIhlxuICAgICAgICAgICAgdGhpcy5zY29yZSArPSBtZXJnZWRUaWxlLnZhbHVlXG4gICAgICAgICAgICAvLyDmm7TmlrDlvZPliY3mnIDpq5jlvpfliIborrDlvZVcbiAgICAgICAgICAgIGlmICh0aGlzLnNjb3JlID4gdGhpcy5iZXN0KSB7XG4gICAgICAgICAgICAgIHRoaXMuYmVzdCA9IHRoaXMuc2NvcmVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g5bCG5Z2X56e75Yqo5Yiw5pyA6L+c55qE5L2N572u77yM5Y2z5pu05paw5Z2X55qE5L2N572u5Z2Q5qCHXG4gICAgICAgICAgICB0aGlzLm1vdmVUaWxlKHRpbGUsIHBvc2l0aW9uLmZhcnRoZXN0KVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIOWIpOaWreWdl+eahOWJjeWQjuWdkOagh+aYr+WQpuS4gOiHtO+8jOWNs+aYr+WQpuacieenu+WKqFxuICAgICAgICAgIGlmICghdGhpcy5wb3NpdGlvbnNFcXVhbCh0aWxlLCBjZWxsKSkge1xuICAgICAgICAgICAgbW92ZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyDnp7vliqjlkI7lop7liqDmlrDnmoTlnZfvvIzlubbliLfmlrAgRE9NXG4gICAgaWYgKG1vdmVkKSB7XG4gICAgICB0aGlzLmFkZFJhbmRvbVRpbGUoKVxuICAgICAgdGhpcy5hY3R1YXRlKClcbiAgICB9XG4gIH1cblxuICAvLyDnp7vliqjlnZfvvIzlrp7pmYXkuLrmm7TmlrDlnZfnmoTkvY3nva5cbiAgbW92ZVRpbGUodGlsZSwgY2VsbCkge1xuICAgIHRoaXMuZ3JpZC5jZWxsc1t0aWxlLnhdW3RpbGUueV0gPSBudWxsXG4gICAgdGhpcy5ncmlkLmNlbGxzW2NlbGwueF1bY2VsbC55XSA9IHRpbGVcbiAgICAvLyDmtYXmi7fotJ1cbiAgICB0aWxlLnVwZGF0ZVBvc2l0aW9uKGNlbGwpXG4gIH1cblxuICAvLyDorrDlvZXmiYDmnInlnZfnp7vliqjliY3nmoTkvY3nva7vvIzkv53lrZjliLDlnZfkuK1cbiAgcHJlcGFyZVRpbGVzKCkge1xuICAgIHRoaXMuZ3JpZC5lYWNoQ2VsbCgoeCwgeSwgdGlsZSkgPT4ge1xuICAgICAgaWYgKHRpbGUpIHtcbiAgICAgICAgLy8g56e75Yqo5YmN5riF6Zmk5omA5pyJ5bey57uP5ZCI5bm255qE5Z2XXG4gICAgICAgIHRpbGUubWVyZ2VkRnJvbSA9IG51bGxcbiAgICAgICAgdGlsZS5zYXZlUG9zaXRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyDmoLnmja7mjInplK7mlrnlkJHvvIzov5Tlm57lr7nlupTnmoTlkJHph4/vvIznlKjkuo7pgY3ljoZcbiAgZ2V0VmVjdG9yKGRpcmVjdGlvbikge1xuICAgIGNvbnN0IG1hcCA9IHtcbiAgICAgICd1cCc6IHsgeDogMCwgeTogLTEgfSxcbiAgICAgICdyaWdodCc6IHsgeDogMSwgeTogMCB9LFxuICAgICAgJ2Rvd24nOiB7IHg6IDAsIHk6IDEgfSxcbiAgICAgICdsZWZ0JzogeyB4OiAtMSwgeTogMCB9XG4gICAgfVxuICAgIHJldHVybiBtYXBbZGlyZWN0aW9uXVxuICB9XG5cbiAgLy8g6L+U5Zue5LiA5Liq5LqM57u05pWw57uE77yM55So5LqO5LmL5ZCO5qC55o2u5pa55ZCR77yM5LuO6L+c5Yiw6L+R6YGN5Y6G5pW05Liq572R5qC8XG4gIGJ1aWxkVHJhdmVyc2Fscyh2ZWN0b3IpIHtcbiAgICBsZXQgdHJhdmVyc2FscyA9IHsgeDogW10sIHk6IFtdIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcbiAgICAgIHRyYXZlcnNhbHMueC5wdXNoKGkpXG4gICAgICB0cmF2ZXJzYWxzLnkucHVzaChpKVxuICAgIH1cbiAgICAvLyDmoLnmja7mlrnlkJHvvIzku47mnIDov5znmoTkvY3nva7liLDmnIDov5HvvIzlnZfmmK/lhYjnp7vliqjov5znmoTlho3liLDov5HnmoRcbiAgICBpZiAodmVjdG9yLnggPT09IDEpIHtcbiAgICAgIHRyYXZlcnNhbHMueCA9IHRyYXZlcnNhbHMueC5yZXZlcnNlKClcbiAgICB9XG4gICAgaWYgKHZlY3Rvci55ID09PSAxKSB7XG4gICAgICB0cmF2ZXJzYWxzLnkgPSB0cmF2ZXJzYWxzLnkucmV2ZXJzZSgpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYXZlcnNhbHNcbiAgfVxuXG4gIC8vIOWvu+aJvuacgOi/nOeahOWPr+enu+WKqOS9jee9ru+8jOWNs+agueaNruWQkemHj++8jOWvu+aJvuepuue9rueahOagvO+8jOebtOWIsOaciemanOeijeWHuueOsO+8iOagvOS4jeS4uuepuu+8iVxuICBmaW5kRmFydGhlc3RQb3NpdGlvbihjZWxsLCB2ZWN0b3IpIHtcbiAgICBsZXQgcHJldmlvdXNcbiAgICBkbyB7XG4gICAgICBwcmV2aW91cyA9IGNlbGxcbiAgICAgIC8vIOagueaNruWQkemHj++8jOW+gOWvueW6lOeahOaWueWQkei1sOS4gOagvFxuICAgICAgY2VsbCA9IHtcbiAgICAgICAgeDogcHJldmlvdXMueCArIHZlY3Rvci54LFxuICAgICAgICB5OiBwcmV2aW91cy55ICsgdmVjdG9yLnlcbiAgICAgIH1cbiAgICB9IHdoaWxlICh0aGlzLmdyaWQud2l0aGluQm91bmRzKGNlbGwpICYmIHRoaXMuZ3JpZC5jZWxsQXZhaWxhYmxlKGNlbGwpKVxuICAgIHJldHVybiB7IGZhcnRoZXN0OiBwcmV2aW91cywgbmV4dDogY2VsbCB9XG4gIH1cblxuICAvLyDliKTmlq3lnZfnmoTliY3lkI7kvY3nva7mmK/lkKbkuIDoh7TvvIzljbPmmK/lkKbmnInnp7vliqhcbiAgcG9zaXRpb25zRXF1YWwoYmVmb3JlLCBhZnRlcikge1xuICAgIHJldHVybiBiZWZvcmUueCA9PT0gYWZ0ZXIueCAmJiBiZWZvcmUueSA9PT0gYWZ0ZXIueVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9nYW1lLW1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/*\n  处理所有 DOM 相关操作\n*/\n\nclass HTMLActuator {\n  constructor() {\n    this.tileContainer = document.querySelector('.tile-container')\n    this.scoreContainer = document.getElementById('score')\n    this.bestContainer = document.getElementById('best')\n  }\n\n  // 初始化网格到 DOM\n  actuate(grid, metaData) {\n    window.requestAnimationFrame(() => {\n      this.clearContainer(this.tileContainer)\n      grid.cells.forEach((column) => {\n        column.forEach((cell) => {\n          if (cell) {\n            this.addTile(cell)\n          }\n        })\n      })\n      // 更新得分的数据到 DOM\n      this.updateScore(metaData.score)\n      // 更新最高得分的数据到 DOM\n      this.updateBest(metaData.best)\n    })\n  }\n\n  // 清除网格中的所有块\n  clearContainer(container) {\n    while (container.firstChild) {\n      container.removeChild(container.firstChild)\n    }\n  }\n\n  // 添加一个块到 DOM\n  addTile(tile) {\n    const wrapper = document.createElement('div')\n    const inner = document.createElement('div')\n    // 先放置在前置的位置\n    const position = tile.previousPosition || { x: tile.x, y: tile.y }\n    const positionClass = this.positionClass(position)\n\n    // 先放置在前置的位置，产生移动的动画\n    let classes = ['tile', positionClass]\n    this.applyClasses(wrapper, classes)\n\n    inner.classList.add('tile-inner')\n    inner.textContent = tile.value\n\n    // 判断某个块是否有前置的位置（是否要有移动动画）\n    if (tile.previousPosition) {\n      window.requestAnimationFrame(() => {\n        classes[1] = this.positionClass({ x: tile.x, y: tile.y })\n        this.applyClasses(wrapper, classes)\n      })\n    } else if (tile.mergedFrom) {\n      // 合并产生的块，添加合并的动画\n      classes.push('tile-merged')\n      this.applyClasses(wrapper, classes)\n      // 合并的两个块，要有过渡动画，分别为移动以及保持原位，最终会在合并的位置产生三个重叠的块\n      tile.mergedFrom.forEach((merged) => {\n        this.addTile(merged)\n      })\n    } else {\n      // 没有前置位置的话，添加新增块的动画\n      classes.push('tile-new')\n      this.applyClasses(wrapper, classes)\n    }\n\n    wrapper.appendChild(inner)\n    this.tileContainer.appendChild(wrapper)\n  }\n\n  // 添加块的 CSS\n  applyClasses(element, classes) {\n    element.setAttribute('class', classes.join(' '))\n  }\n\n  // 添加块的 CSS 中的位置\n  positionClass(position) {\n    return 'tile-position-' + position.x + '-' + position.y\n  }\n\n  // 更新得分\n  updateScore(score) {\n    this.scoreContainer.textContent = score\n  }\n  // 更新最高记录\n  updateBest(score) {\n    this.bestContainer.textContent = score\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = HTMLActuator;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaHRtbC1hY3R1YXRvci5qcz9iN2ZjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsdUJBQXVCO0FBQ2hFO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBIiwiZmlsZSI6IjMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICDlpITnkIbmiYDmnIkgRE9NIOebuOWFs+aTjeS9nFxuKi9cblxuZXhwb3J0IGNsYXNzIEhUTUxBY3R1YXRvciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGlsZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aWxlLWNvbnRhaW5lcicpXG4gICAgdGhpcy5zY29yZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpXG4gICAgdGhpcy5iZXN0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jlc3QnKVxuICB9XG5cbiAgLy8g5Yid5aeL5YyW572R5qC85YiwIERPTVxuICBhY3R1YXRlKGdyaWQsIG1ldGFEYXRhKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ29udGFpbmVyKHRoaXMudGlsZUNvbnRhaW5lcilcbiAgICAgIGdyaWQuY2VsbHMuZm9yRWFjaCgoY29sdW1uKSA9PiB7XG4gICAgICAgIGNvbHVtbi5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVGlsZShjZWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICAvLyDmm7TmlrDlvpfliIbnmoTmlbDmja7liLAgRE9NXG4gICAgICB0aGlzLnVwZGF0ZVNjb3JlKG1ldGFEYXRhLnNjb3JlKVxuICAgICAgLy8g5pu05paw5pyA6auY5b6X5YiG55qE5pWw5o2u5YiwIERPTVxuICAgICAgdGhpcy51cGRhdGVCZXN0KG1ldGFEYXRhLmJlc3QpXG4gICAgfSlcbiAgfVxuXG4gIC8vIOa4hemZpOe9keagvOS4reeahOaJgOacieWdl1xuICBjbGVhckNvbnRhaW5lcihjb250YWluZXIpIHtcbiAgICB3aGlsZSAoY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGNvbnRhaW5lci5yZW1vdmVDaGlsZChjb250YWluZXIuZmlyc3RDaGlsZClcbiAgICB9XG4gIH1cblxuICAvLyDmt7vliqDkuIDkuKrlnZfliLAgRE9NXG4gIGFkZFRpbGUodGlsZSkge1xuICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIGNvbnN0IGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAvLyDlhYjmlL7nva7lnKjliY3nva7nmoTkvY3nva5cbiAgICBjb25zdCBwb3NpdGlvbiA9IHRpbGUucHJldmlvdXNQb3NpdGlvbiB8fCB7IHg6IHRpbGUueCwgeTogdGlsZS55IH1cbiAgICBjb25zdCBwb3NpdGlvbkNsYXNzID0gdGhpcy5wb3NpdGlvbkNsYXNzKHBvc2l0aW9uKVxuXG4gICAgLy8g5YWI5pS+572u5Zyo5YmN572u55qE5L2N572u77yM5Lqn55Sf56e75Yqo55qE5Yqo55S7XG4gICAgbGV0IGNsYXNzZXMgPSBbJ3RpbGUnLCBwb3NpdGlvbkNsYXNzXVxuICAgIHRoaXMuYXBwbHlDbGFzc2VzKHdyYXBwZXIsIGNsYXNzZXMpXG5cbiAgICBpbm5lci5jbGFzc0xpc3QuYWRkKCd0aWxlLWlubmVyJylcbiAgICBpbm5lci50ZXh0Q29udGVudCA9IHRpbGUudmFsdWVcblxuICAgIC8vIOWIpOaWreafkOS4quWdl+aYr+WQpuacieWJjee9rueahOS9jee9ru+8iOaYr+WQpuimgeacieenu+WKqOWKqOeUu++8iVxuICAgIGlmICh0aWxlLnByZXZpb3VzUG9zaXRpb24pIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBjbGFzc2VzWzFdID0gdGhpcy5wb3NpdGlvbkNsYXNzKHsgeDogdGlsZS54LCB5OiB0aWxlLnkgfSlcbiAgICAgICAgdGhpcy5hcHBseUNsYXNzZXMod3JhcHBlciwgY2xhc3NlcylcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aWxlLm1lcmdlZEZyb20pIHtcbiAgICAgIC8vIOWQiOW5tuS6p+eUn+eahOWdl++8jOa3u+WKoOWQiOW5tueahOWKqOeUu1xuICAgICAgY2xhc3Nlcy5wdXNoKCd0aWxlLW1lcmdlZCcpXG4gICAgICB0aGlzLmFwcGx5Q2xhc3Nlcyh3cmFwcGVyLCBjbGFzc2VzKVxuICAgICAgLy8g5ZCI5bm255qE5Lik5Liq5Z2X77yM6KaB5pyJ6L+H5rih5Yqo55S777yM5YiG5Yir5Li656e75Yqo5Lul5Y+K5L+d5oyB5Y6f5L2N77yM5pyA57uI5Lya5Zyo5ZCI5bm255qE5L2N572u5Lqn55Sf5LiJ5Liq6YeN5Y+g55qE5Z2XXG4gICAgICB0aWxlLm1lcmdlZEZyb20uZm9yRWFjaCgobWVyZ2VkKSA9PiB7XG4gICAgICAgIHRoaXMuYWRkVGlsZShtZXJnZWQpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDmsqHmnInliY3nva7kvY3nva7nmoTor53vvIzmt7vliqDmlrDlop7lnZfnmoTliqjnlLtcbiAgICAgIGNsYXNzZXMucHVzaCgndGlsZS1uZXcnKVxuICAgICAgdGhpcy5hcHBseUNsYXNzZXMod3JhcHBlciwgY2xhc3NlcylcbiAgICB9XG5cbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGlubmVyKVxuICAgIHRoaXMudGlsZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICB9XG5cbiAgLy8g5re75Yqg5Z2X55qEIENTU1xuICBhcHBseUNsYXNzZXMoZWxlbWVudCwgY2xhc3Nlcykge1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzZXMuam9pbignICcpKVxuICB9XG5cbiAgLy8g5re75Yqg5Z2X55qEIENTUyDkuK3nmoTkvY3nva5cbiAgcG9zaXRpb25DbGFzcyhwb3NpdGlvbikge1xuICAgIHJldHVybiAndGlsZS1wb3NpdGlvbi0nICsgcG9zaXRpb24ueCArICctJyArIHBvc2l0aW9uLnlcbiAgfVxuXG4gIC8vIOabtOaWsOW+l+WIhlxuICB1cGRhdGVTY29yZShzY29yZSkge1xuICAgIHRoaXMuc2NvcmVDb250YWluZXIudGV4dENvbnRlbnQgPSBzY29yZVxuICB9XG4gIC8vIOabtOaWsOacgOmrmOiusOW9lVxuICB1cGRhdGVCZXN0KHNjb3JlKSB7XG4gICAgdGhpcy5iZXN0Q29udGFpbmVyLnRleHRDb250ZW50ID0gc2NvcmVcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvaHRtbC1hY3R1YXRvci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/*\n  按键操作的处理\n*/\n\nclass InputManager {\n  constructor() {\n    // 储存所有需要处理的事件\n    this.events = {}\n    this.listen()\n  }\n\n  listen() {\n    // 按键对应的 key code\n    const keyMap = {\n      38: 'up',\n      39: 'right',\n      40: 'down',\n      37: 'left'\n    }\n\n    // 添加 keydown 事件的处理\n    document.addEventListener('keydown', (event) => {\n      let keyPressed = keyMap[event.which]\n      // 如果按下的不是方向键，则忽略不处理\n      if (keyPressed !== undefined) {\n        event.preventDefault()\n        this.emit('move', keyPressed)\n      }\n    })\n\n    // 添加重新开始按钮点击事件的处理\n    let restartButton = document.getElementById('btn-restart')\n    restartButton.addEventListener('click', (event) => {\n      event.preventDefault()\n      this.emit('restart')\n    })\n  }\n\n  // 添加事件的 handler\n  addEventHandler(event, handler) {\n    this.events[event] = handler\n  }\n\n  // 事件发生时，调用对应的 handler\n  emit(event, params) {\n    // 取出储存的事件的 handler\n    let handler = this.events[event]\n    if (handler) {\n      handler(params)\n    }\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = InputManager;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5wdXQtbWFuYWdlci5qcz80NjhkIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUEiLCJmaWxlIjoiNC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gIOaMiemUruaTjeS9nOeahOWkhOeQhlxuKi9cblxuZXhwb3J0IGNsYXNzIElucHV0TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIOWCqOWtmOaJgOaciemcgOimgeWkhOeQhueahOS6i+S7tlxuICAgIHRoaXMuZXZlbnRzID0ge31cbiAgICB0aGlzLmxpc3RlbigpXG4gIH1cblxuICBsaXN0ZW4oKSB7XG4gICAgLy8g5oyJ6ZSu5a+55bqU55qEIGtleSBjb2RlXG4gICAgY29uc3Qga2V5TWFwID0ge1xuICAgICAgMzg6ICd1cCcsXG4gICAgICAzOTogJ3JpZ2h0JyxcbiAgICAgIDQwOiAnZG93bicsXG4gICAgICAzNzogJ2xlZnQnXG4gICAgfVxuXG4gICAgLy8g5re75YqgIGtleWRvd24g5LqL5Lu255qE5aSE55CGXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgbGV0IGtleVByZXNzZWQgPSBrZXlNYXBbZXZlbnQud2hpY2hdXG4gICAgICAvLyDlpoLmnpzmjInkuIvnmoTkuI3mmK/mlrnlkJHplK7vvIzliJnlv73nlaXkuI3lpITnkIZcbiAgICAgIGlmIChrZXlQcmVzc2VkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLmVtaXQoJ21vdmUnLCBrZXlQcmVzc2VkKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyDmt7vliqDph43mlrDlvIDlp4vmjInpkq7ngrnlh7vkuovku7bnmoTlpITnkIZcbiAgICBsZXQgcmVzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4tcmVzdGFydCcpXG4gICAgcmVzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5lbWl0KCdyZXN0YXJ0JylcbiAgICB9KVxuICB9XG5cbiAgLy8g5re75Yqg5LqL5Lu255qEIGhhbmRsZXJcbiAgYWRkRXZlbnRIYW5kbGVyKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnRdID0gaGFuZGxlclxuICB9XG5cbiAgLy8g5LqL5Lu25Y+R55Sf5pe277yM6LCD55So5a+55bqU55qEIGhhbmRsZXJcbiAgZW1pdChldmVudCwgcGFyYW1zKSB7XG4gICAgLy8g5Y+W5Ye65YKo5a2Y55qE5LqL5Lu255qEIGhhbmRsZXJcbiAgICBsZXQgaGFuZGxlciA9IHRoaXMuZXZlbnRzW2V2ZW50XVxuICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICBoYW5kbGVyKHBhcmFtcylcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2lucHV0LW1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n// css base code, injected by the css-loader\nmodule.exports = function(useSourceMap) {\n\tvar list = [];\n\n\t// return the list of modules as css string\n\tlist.toString = function toString() {\n\t\treturn this.map(function (item) {\n\t\t\tvar content = cssWithMappingToString(item, useSourceMap);\n\t\t\tif(item[2]) {\n\t\t\t\treturn \"@media \" + item[2] + \"{\" + content + \"}\";\n\t\t\t} else {\n\t\t\t\treturn content;\n\t\t\t}\n\t\t}).join(\"\");\n\t};\n\n\t// import a list of modules into the list\n\tlist.i = function(modules, mediaQuery) {\n\t\tif(typeof modules === \"string\")\n\t\t\tmodules = [[null, modules, \"\"]];\n\t\tvar alreadyImportedModules = {};\n\t\tfor(var i = 0; i < this.length; i++) {\n\t\t\tvar id = this[i][0];\n\t\t\tif(typeof id === \"number\")\n\t\t\t\talreadyImportedModules[id] = true;\n\t\t}\n\t\tfor(i = 0; i < modules.length; i++) {\n\t\t\tvar item = modules[i];\n\t\t\t// skip already imported module\n\t\t\t// this implementation is not 100% perfect for weird media query combinations\n\t\t\t//  when a module is imported multiple times with different media queries.\n\t\t\t//  I hope this will never occur (Hey this way we have smaller bundles)\n\t\t\tif(typeof item[0] !== \"number\" || !alreadyImportedModules[item[0]]) {\n\t\t\t\tif(mediaQuery && !item[2]) {\n\t\t\t\t\titem[2] = mediaQuery;\n\t\t\t\t} else if(mediaQuery) {\n\t\t\t\t\titem[2] = \"(\" + item[2] + \") and (\" + mediaQuery + \")\";\n\t\t\t\t}\n\t\t\t\tlist.push(item);\n\t\t\t}\n\t\t}\n\t};\n\treturn list;\n};\n\nfunction cssWithMappingToString(item, useSourceMap) {\n\tvar content = item[1] || '';\n\tvar cssMapping = item[3];\n\tif (!cssMapping) {\n\t\treturn content;\n\t}\n\n\tif (useSourceMap && typeof btoa === 'function') {\n\t\tvar sourceMapping = toComment(cssMapping);\n\t\tvar sourceURLs = cssMapping.sources.map(function (source) {\n\t\t\treturn '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'\n\t\t});\n\n\t\treturn [content].concat(sourceURLs).concat([sourceMapping]).join('\\n');\n\t}\n\n\treturn [content].join('\\n');\n}\n\n// Adapted from convert-source-map (MIT)\nfunction toComment(sourceMap) {\n\t// eslint-disable-next-line no-undef\n\tvar base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));\n\tvar data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;\n\n\treturn '/*# ' + data + ' */';\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzP2RhMDQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxnQkFBZ0I7QUFDbkQsSUFBSTtBQUNKO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG9CQUFvQjtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsY0FBYzs7QUFFbEU7QUFDQSIsImZpbGUiOiI1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

eval("/*\n\tMIT License http://www.opensource.org/licenses/mit-license.php\n\tAuthor Tobias Koppers @sokra\n*/\n\nvar stylesInDom = {};\n\nvar\tmemoize = function (fn) {\n\tvar memo;\n\n\treturn function () {\n\t\tif (typeof memo === \"undefined\") memo = fn.apply(this, arguments);\n\t\treturn memo;\n\t};\n};\n\nvar isOldIE = memoize(function () {\n\t// Test for IE <= 9 as proposed by Browserhacks\n\t// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805\n\t// Tests for existence of standard globals is to allow style-loader\n\t// to operate correctly into non-standard environments\n\t// @see https://github.com/webpack-contrib/style-loader/issues/177\n\treturn window && document && document.all && !window.atob;\n});\n\nvar getElement = (function (fn) {\n\tvar memo = {};\n\n\treturn function(selector) {\n\t\tif (typeof memo[selector] === \"undefined\") {\n\t\t\tmemo[selector] = fn.call(this, selector);\n\t\t}\n\n\t\treturn memo[selector]\n\t};\n})(function (target) {\n\treturn document.querySelector(target)\n});\n\nvar singleton = null;\nvar\tsingletonCounter = 0;\nvar\tstylesInsertedAtTop = [];\n\nvar\tfixUrls = __webpack_require__(7);\n\nmodule.exports = function(list, options) {\n\tif (typeof DEBUG !== \"undefined\" && DEBUG) {\n\t\tif (typeof document !== \"object\") throw new Error(\"The style-loader cannot be used in a non-browser environment\");\n\t}\n\n\toptions = options || {};\n\n\toptions.attrs = typeof options.attrs === \"object\" ? options.attrs : {};\n\n\t// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>\n\t// tags it will allow on a page\n\tif (!options.singleton) options.singleton = isOldIE();\n\n\t// By default, add <style> tags to the <head> element\n\tif (!options.insertInto) options.insertInto = \"head\";\n\n\t// By default, add <style> tags to the bottom of the target\n\tif (!options.insertAt) options.insertAt = \"bottom\";\n\n\tvar styles = listToStyles(list, options);\n\n\taddStylesToDom(styles, options);\n\n\treturn function update (newList) {\n\t\tvar mayRemove = [];\n\n\t\tfor (var i = 0; i < styles.length; i++) {\n\t\t\tvar item = styles[i];\n\t\t\tvar domStyle = stylesInDom[item.id];\n\n\t\t\tdomStyle.refs--;\n\t\t\tmayRemove.push(domStyle);\n\t\t}\n\n\t\tif(newList) {\n\t\t\tvar newStyles = listToStyles(newList, options);\n\t\t\taddStylesToDom(newStyles, options);\n\t\t}\n\n\t\tfor (var i = 0; i < mayRemove.length; i++) {\n\t\t\tvar domStyle = mayRemove[i];\n\n\t\t\tif(domStyle.refs === 0) {\n\t\t\t\tfor (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();\n\n\t\t\t\tdelete stylesInDom[domStyle.id];\n\t\t\t}\n\t\t}\n\t};\n};\n\nfunction addStylesToDom (styles, options) {\n\tfor (var i = 0; i < styles.length; i++) {\n\t\tvar item = styles[i];\n\t\tvar domStyle = stylesInDom[item.id];\n\n\t\tif(domStyle) {\n\t\t\tdomStyle.refs++;\n\n\t\t\tfor(var j = 0; j < domStyle.parts.length; j++) {\n\t\t\t\tdomStyle.parts[j](item.parts[j]);\n\t\t\t}\n\n\t\t\tfor(; j < item.parts.length; j++) {\n\t\t\t\tdomStyle.parts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\t\t} else {\n\t\t\tvar parts = [];\n\n\t\t\tfor(var j = 0; j < item.parts.length; j++) {\n\t\t\t\tparts.push(addStyle(item.parts[j], options));\n\t\t\t}\n\n\t\t\tstylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};\n\t\t}\n\t}\n}\n\nfunction listToStyles (list, options) {\n\tvar styles = [];\n\tvar newStyles = {};\n\n\tfor (var i = 0; i < list.length; i++) {\n\t\tvar item = list[i];\n\t\tvar id = options.base ? item[0] + options.base : item[0];\n\t\tvar css = item[1];\n\t\tvar media = item[2];\n\t\tvar sourceMap = item[3];\n\t\tvar part = {css: css, media: media, sourceMap: sourceMap};\n\n\t\tif(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});\n\t\telse newStyles[id].parts.push(part);\n\t}\n\n\treturn styles;\n}\n\nfunction insertStyleElement (options, style) {\n\tvar target = getElement(options.insertInto)\n\n\tif (!target) {\n\t\tthrow new Error(\"Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.\");\n\t}\n\n\tvar lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];\n\n\tif (options.insertAt === \"top\") {\n\t\tif (!lastStyleElementInsertedAtTop) {\n\t\t\ttarget.insertBefore(style, target.firstChild);\n\t\t} else if (lastStyleElementInsertedAtTop.nextSibling) {\n\t\t\ttarget.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);\n\t\t} else {\n\t\t\ttarget.appendChild(style);\n\t\t}\n\t\tstylesInsertedAtTop.push(style);\n\t} else if (options.insertAt === \"bottom\") {\n\t\ttarget.appendChild(style);\n\t} else {\n\t\tthrow new Error(\"Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.\");\n\t}\n}\n\nfunction removeStyleElement (style) {\n\tif (style.parentNode === null) return false;\n\tstyle.parentNode.removeChild(style);\n\n\tvar idx = stylesInsertedAtTop.indexOf(style);\n\tif(idx >= 0) {\n\t\tstylesInsertedAtTop.splice(idx, 1);\n\t}\n}\n\nfunction createStyleElement (options) {\n\tvar style = document.createElement(\"style\");\n\n\toptions.attrs.type = \"text/css\";\n\n\taddAttrs(style, options.attrs);\n\tinsertStyleElement(options, style);\n\n\treturn style;\n}\n\nfunction createLinkElement (options) {\n\tvar link = document.createElement(\"link\");\n\n\toptions.attrs.type = \"text/css\";\n\toptions.attrs.rel = \"stylesheet\";\n\n\taddAttrs(link, options.attrs);\n\tinsertStyleElement(options, link);\n\n\treturn link;\n}\n\nfunction addAttrs (el, attrs) {\n\tObject.keys(attrs).forEach(function (key) {\n\t\tel.setAttribute(key, attrs[key]);\n\t});\n}\n\nfunction addStyle (obj, options) {\n\tvar style, update, remove, result;\n\n\t// If a transform function was defined, run it on the css\n\tif (options.transform && obj.css) {\n\t    result = options.transform(obj.css);\n\n\t    if (result) {\n\t    \t// If transform returns a value, use that instead of the original css.\n\t    \t// This allows running runtime transformations on the css.\n\t    \tobj.css = result;\n\t    } else {\n\t    \t// If the transform function returns a falsy value, don't add this css.\n\t    \t// This allows conditional loading of css\n\t    \treturn function() {\n\t    \t\t// noop\n\t    \t};\n\t    }\n\t}\n\n\tif (options.singleton) {\n\t\tvar styleIndex = singletonCounter++;\n\n\t\tstyle = singleton || (singleton = createStyleElement(options));\n\n\t\tupdate = applyToSingletonTag.bind(null, style, styleIndex, false);\n\t\tremove = applyToSingletonTag.bind(null, style, styleIndex, true);\n\n\t} else if (\n\t\tobj.sourceMap &&\n\t\ttypeof URL === \"function\" &&\n\t\ttypeof URL.createObjectURL === \"function\" &&\n\t\ttypeof URL.revokeObjectURL === \"function\" &&\n\t\ttypeof Blob === \"function\" &&\n\t\ttypeof btoa === \"function\"\n\t) {\n\t\tstyle = createLinkElement(options);\n\t\tupdate = updateLink.bind(null, style, options);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\n\t\t\tif(style.href) URL.revokeObjectURL(style.href);\n\t\t};\n\t} else {\n\t\tstyle = createStyleElement(options);\n\t\tupdate = applyToTag.bind(null, style);\n\t\tremove = function () {\n\t\t\tremoveStyleElement(style);\n\t\t};\n\t}\n\n\tupdate(obj);\n\n\treturn function updateStyle (newObj) {\n\t\tif (newObj) {\n\t\t\tif (\n\t\t\t\tnewObj.css === obj.css &&\n\t\t\t\tnewObj.media === obj.media &&\n\t\t\t\tnewObj.sourceMap === obj.sourceMap\n\t\t\t) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tupdate(obj = newObj);\n\t\t} else {\n\t\t\tremove();\n\t\t}\n\t};\n}\n\nvar replaceText = (function () {\n\tvar textStore = [];\n\n\treturn function (index, replacement) {\n\t\ttextStore[index] = replacement;\n\n\t\treturn textStore.filter(Boolean).join('\\n');\n\t};\n})();\n\nfunction applyToSingletonTag (style, index, remove, obj) {\n\tvar css = remove ? \"\" : obj.css;\n\n\tif (style.styleSheet) {\n\t\tstyle.styleSheet.cssText = replaceText(index, css);\n\t} else {\n\t\tvar cssNode = document.createTextNode(css);\n\t\tvar childNodes = style.childNodes;\n\n\t\tif (childNodes[index]) style.removeChild(childNodes[index]);\n\n\t\tif (childNodes.length) {\n\t\t\tstyle.insertBefore(cssNode, childNodes[index]);\n\t\t} else {\n\t\t\tstyle.appendChild(cssNode);\n\t\t}\n\t}\n}\n\nfunction applyToTag (style, obj) {\n\tvar css = obj.css;\n\tvar media = obj.media;\n\n\tif(media) {\n\t\tstyle.setAttribute(\"media\", media)\n\t}\n\n\tif(style.styleSheet) {\n\t\tstyle.styleSheet.cssText = css;\n\t} else {\n\t\twhile(style.firstChild) {\n\t\t\tstyle.removeChild(style.firstChild);\n\t\t}\n\n\t\tstyle.appendChild(document.createTextNode(css));\n\t}\n}\n\nfunction updateLink (link, options, obj) {\n\tvar css = obj.css;\n\tvar sourceMap = obj.sourceMap;\n\n\t/*\n\t\tIf convertToAbsoluteUrls isn't defined, but sourcemaps are enabled\n\t\tand there is no publicPath defined then lets turn convertToAbsoluteUrls\n\t\ton by default.  Otherwise default to the convertToAbsoluteUrls option\n\t\tdirectly\n\t*/\n\tvar autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;\n\n\tif (options.convertToAbsoluteUrls || autoFixUrls) {\n\t\tcss = fixUrls(css);\n\t}\n\n\tif (sourceMap) {\n\t\t// http://stackoverflow.com/a/26603875\n\t\tcss += \"\\n/*# sourceMappingURL=data:application/json;base64,\" + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + \" */\";\n\t}\n\n\tvar blob = new Blob([css], { type: \"text/css\" });\n\n\tvar oldSrc = link.href;\n\n\tlink.href = URL.createObjectURL(blob);\n\n\tif(oldSrc) URL.revokeObjectURL(oldSrc);\n}\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzP2I3ODEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsaUJBQWlCLG1CQUFtQjtBQUNwQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUIsc0JBQXNCO0FBQ3ZDOztBQUVBO0FBQ0EsbUJBQW1CLDJCQUEyQjs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlCQUFpQiwyQkFBMkI7QUFDNUM7QUFDQTs7QUFFQSxRQUFRLHVCQUF1QjtBQUMvQjtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjOztBQUVkLGtEQUFrRCxzQkFBc0I7QUFDeEU7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0EiLCJmaWxlIjoiNi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

eval("\n/**\n * When source maps are enabled, `style-loader` uses a link element with a data-uri to\n * embed the css on the page. This breaks all relative urls because now they are relative to a\n * bundle instead of the current page.\n *\n * One solution is to only use full urls, but that may be impossible.\n *\n * Instead, this function \"fixes\" the relative urls to be absolute according to the current page location.\n *\n * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.\n *\n */\n\nmodule.exports = function (css) {\n  // get current location\n  var location = typeof window !== \"undefined\" && window.location;\n\n  if (!location) {\n    throw new Error(\"fixUrls requires window.location\");\n  }\n\n\t// blank or null?\n\tif (!css || typeof css !== \"string\") {\n\t  return css;\n  }\n\n  var baseUrl = location.protocol + \"//\" + location.host;\n  var currentDir = baseUrl + location.pathname.replace(/\\/[^\\/]*$/, \"/\");\n\n\t// convert each url(...)\n\t/*\n\tThis regular expression is just a way to recursively match brackets within\n\ta string.\n\n\t /url\\s*\\(  = Match on the word \"url\" with any whitespace after it and then a parens\n\t   (  = Start a capturing group\n\t     (?:  = Start a non-capturing group\n\t         [^)(]  = Match anything that isn't a parentheses\n\t         |  = OR\n\t         \\(  = Match a start parentheses\n\t             (?:  = Start another non-capturing groups\n\t                 [^)(]+  = Match anything that isn't a parentheses\n\t                 |  = OR\n\t                 \\(  = Match a start parentheses\n\t                     [^)(]*  = Match anything that isn't a parentheses\n\t                 \\)  = Match a end parentheses\n\t             )  = End Group\n              *\\) = Match anything and then a close parens\n          )  = Close non-capturing group\n          *  = Match anything\n       )  = Close capturing group\n\t \\)  = Match a close parens\n\n\t /gi  = Get all matches, not the first.  Be case insensitive.\n\t */\n\tvar fixedCss = css.replace(/url\\s*\\(((?:[^)(]|\\((?:[^)(]+|\\([^)(]*\\))*\\))*)\\)/gi, function(fullMatch, origUrl) {\n\t\t// strip quotes (if they exist)\n\t\tvar unquotedOrigUrl = origUrl\n\t\t\t.trim()\n\t\t\t.replace(/^\"(.*)\"$/, function(o, $1){ return $1; })\n\t\t\t.replace(/^'(.*)'$/, function(o, $1){ return $1; });\n\n\t\t// already a full url? no change\n\t\tif (/^(#|data:|http:\\/\\/|https:\\/\\/|file:\\/\\/\\/)/i.test(unquotedOrigUrl)) {\n\t\t  return fullMatch;\n\t\t}\n\n\t\t// convert the url to a full url\n\t\tvar newUrl;\n\n\t\tif (unquotedOrigUrl.indexOf(\"//\") === 0) {\n\t\t  \t//TODO: should we add protocol?\n\t\t\tnewUrl = unquotedOrigUrl;\n\t\t} else if (unquotedOrigUrl.indexOf(\"/\") === 0) {\n\t\t\t// path should be relative to the base url\n\t\t\tnewUrl = baseUrl + unquotedOrigUrl; // already starts with '/'\n\t\t} else {\n\t\t\t// path should be relative to current directory\n\t\t\tnewUrl = currentDir + unquotedOrigUrl.replace(/^\\.\\//, \"\"); // Strip leading './'\n\t\t}\n\n\t\t// send back the fixed url(...)\n\t\treturn \"url(\" + JSON.stringify(newUrl) + \")\";\n\t});\n\n\t// send back the fixed css\n\treturn fixedCss;\n};\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9saWIvdXJscy5qcz85YzMxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVyxFQUFFO0FBQ3JELHdDQUF3QyxXQUFXLEVBQUU7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esc0NBQXNDO0FBQ3RDLEdBQUc7QUFDSDtBQUNBLDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EiLCJmaWxlIjoiNy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/*\n  网格类，初始化，判断有没有空位，插入块\n*/\n\nclass Grid {\n  constructor(size) {\n    this.size = size\n    this.cells = this.empty()\n  }\n\n  // 根据给定的 size 生成一个空的网格\n  empty() {\n    let cells = []\n    for (let x = 0; x < this.size; x++) {\n      let row = cells[x] = []\n      for (let y = 0; y < this.size; y++) {\n        row.push(null)\n      }\n    }\n    return cells\n  }\n\n  // 方便遍历所有元素\n  eachCell(cb) {\n    for (let x = 0; x < this.size; x++) {\n      for (let y = 0; y < this.size; y++) {\n        cb(x, y, this.cells[x][y])\n      }\n    }\n  }\n\n  // 返回所有为空的格\n  availableCells() {\n    let cells = []\n    this.eachCell((x, y, tile) => {\n      if (!tile) {\n        cells.push({ x: x, y: y })\n      }\n    })\n    return cells\n  }\n\n  // 随机找一个空置的位置\n  randomAvailableCell() {\n    let cells = this.availableCells()\n    if (cells.length) {\n      return cells[Math.floor(Math.random() * cells.length)]\n    }\n  }\n\n  // 是否还有空的格存在\n  cellsAvailable() {\n    return !!this.availableCells().length\n  }\n\n  // 提取某个位置中的块的内容\n  cellContent(cell) {\n    if (this.withinBounds(cell)) {\n      return this.cells[cell.x][cell.y]\n    } else {\n      return null\n    }\n  }\n\n  // 检查某个位置是否为空\n  cellAvailable(cell) {\n    return !this.cellContent(cell)\n  }\n\n  // 检查某个位置是否在网格内（越界）\n  withinBounds(position) {\n    return position.x >= 0 && position.x < this.size &&\n           position.y >= 0 && position.y < this.size\n  }\n\n  // 在给定的块的位置上填入一个块\n  insertTile(tile) {\n    this.cells[tile.x][tile.y] = tile\n  }\n  // 去掉指定的块，置空块的位置\n  removeTile(tile) {\n    this.cells[tile.x][tile.y] = null\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = Grid;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZ3JpZC5qcz84OTJhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixlQUFlO0FBQ2xDO0FBQ0EscUJBQXFCLGVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEMscUJBQXFCLGVBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQSIsImZpbGUiOiI4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAg572R5qC857G777yM5Yid5aeL5YyW77yM5Yik5pat5pyJ5rKh5pyJ56m65L2N77yM5o+S5YWl5Z2XXG4qL1xuXG5leHBvcnQgY2xhc3MgR3JpZCB7XG4gIGNvbnN0cnVjdG9yKHNpemUpIHtcbiAgICB0aGlzLnNpemUgPSBzaXplXG4gICAgdGhpcy5jZWxscyA9IHRoaXMuZW1wdHkoKVxuICB9XG5cbiAgLy8g5qC55o2u57uZ5a6a55qEIHNpemUg55Sf5oiQ5LiA5Liq56m655qE572R5qC8XG4gIGVtcHR5KCkge1xuICAgIGxldCBjZWxscyA9IFtdXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLnNpemU7IHgrKykge1xuICAgICAgbGV0IHJvdyA9IGNlbGxzW3hdID0gW11cbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5zaXplOyB5KyspIHtcbiAgICAgICAgcm93LnB1c2gobnVsbClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNlbGxzXG4gIH1cblxuICAvLyDmlrnkvr/pgY3ljobmiYDmnInlhYPntKBcbiAgZWFjaENlbGwoY2IpIHtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuc2l6ZTsgeCsrKSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuc2l6ZTsgeSsrKSB7XG4gICAgICAgIGNiKHgsIHksIHRoaXMuY2VsbHNbeF1beV0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8g6L+U5Zue5omA5pyJ5Li656m655qE5qC8XG4gIGF2YWlsYWJsZUNlbGxzKCkge1xuICAgIGxldCBjZWxscyA9IFtdXG4gICAgdGhpcy5lYWNoQ2VsbCgoeCwgeSwgdGlsZSkgPT4ge1xuICAgICAgaWYgKCF0aWxlKSB7XG4gICAgICAgIGNlbGxzLnB1c2goeyB4OiB4LCB5OiB5IH0pXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gY2VsbHNcbiAgfVxuXG4gIC8vIOmaj+acuuaJvuS4gOS4quepuue9rueahOS9jee9rlxuICByYW5kb21BdmFpbGFibGVDZWxsKCkge1xuICAgIGxldCBjZWxscyA9IHRoaXMuYXZhaWxhYmxlQ2VsbHMoKVxuICAgIGlmIChjZWxscy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBjZWxsc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjZWxscy5sZW5ndGgpXVxuICAgIH1cbiAgfVxuXG4gIC8vIOaYr+WQpui/mOacieepuueahOagvOWtmOWcqFxuICBjZWxsc0F2YWlsYWJsZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLmF2YWlsYWJsZUNlbGxzKCkubGVuZ3RoXG4gIH1cblxuICAvLyDmj5Dlj5bmn5DkuKrkvY3nva7kuK3nmoTlnZfnmoTlhoXlrrlcbiAgY2VsbENvbnRlbnQoY2VsbCkge1xuICAgIGlmICh0aGlzLndpdGhpbkJvdW5kcyhjZWxsKSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2VsbHNbY2VsbC54XVtjZWxsLnldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgLy8g5qOA5p+l5p+Q5Liq5L2N572u5piv5ZCm5Li656m6XG4gIGNlbGxBdmFpbGFibGUoY2VsbCkge1xuICAgIHJldHVybiAhdGhpcy5jZWxsQ29udGVudChjZWxsKVxuICB9XG5cbiAgLy8g5qOA5p+l5p+Q5Liq5L2N572u5piv5ZCm5Zyo572R5qC85YaF77yI6LaK55WM77yJXG4gIHdpdGhpbkJvdW5kcyhwb3NpdGlvbikge1xuICAgIHJldHVybiBwb3NpdGlvbi54ID49IDAgJiYgcG9zaXRpb24ueCA8IHRoaXMuc2l6ZSAmJlxuICAgICAgICAgICBwb3NpdGlvbi55ID49IDAgJiYgcG9zaXRpb24ueSA8IHRoaXMuc2l6ZVxuICB9XG5cbiAgLy8g5Zyo57uZ5a6a55qE5Z2X55qE5L2N572u5LiK5aGr5YWl5LiA5Liq5Z2XXG4gIGluc2VydFRpbGUodGlsZSkge1xuICAgIHRoaXMuY2VsbHNbdGlsZS54XVt0aWxlLnldID0gdGlsZVxuICB9XG4gIC8vIOWOu+aOieaMh+WumueahOWdl++8jOe9ruepuuWdl+eahOS9jee9rlxuICByZW1vdmVUaWxlKHRpbGUpIHtcbiAgICB0aGlzLmNlbGxzW3RpbGUueF1bdGlsZS55XSA9IG51bGxcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZ3JpZC5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("Object.defineProperty(__webpack_exports__, \"__esModule\", { value: true });\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_manager__ = __webpack_require__(2);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__html_actuator__ = __webpack_require__(3);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__input_manager__ = __webpack_require__(4);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_main_css__ = __webpack_require__(1);\n/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__style_main_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__style_main_css__);\n\n\n\n\n\n// 等待浏览器准备好了再开始\nwindow.requestAnimationFrame(() => {\n  new __WEBPACK_IMPORTED_MODULE_0__game_manager__[\"a\" /* GameManager */](4, __WEBPACK_IMPORTED_MODULE_1__html_actuator__[\"a\" /* HTMLActuator */], __WEBPACK_IMPORTED_MODULE_2__input_manager__[\"a\" /* InputManager */])\n})\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/OTU1MiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBc0I7QUFDQztBQUNBO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJmaWxlIjoiOS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdhbWVNYW5hZ2VyIH0gZnJvbSAnLi9nYW1lLW1hbmFnZXInXG5pbXBvcnQgeyBIVE1MQWN0dWF0b3IgfSBmcm9tICcuL2h0bWwtYWN0dWF0b3InXG5pbXBvcnQgeyBJbnB1dE1hbmFnZXIgfSBmcm9tICcuL2lucHV0LW1hbmFnZXInXG5pbXBvcnQgc3R5bGUgZnJvbSAnLi4vc3R5bGUvbWFpbi5jc3MnXG5cbi8vIOetieW+hea1j+iniOWZqOWHhuWkh+WlveS6huWGjeW8gOWni1xud2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gIG5ldyBHYW1lTWFuYWdlcig0LCBIVE1MQWN0dWF0b3IsIElucHV0TWFuYWdlcilcbn0pXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/*\n  “块”的类\n*/\n\nclass Tile {\n  constructor(position, value) {\n    this.x = position.x\n    this.y = position.y\n    this.value = value || 2\n    // 用于记录前置位置，产生移动的动画\n    this.previousPosition = null\n    // 用于记录合并的位置，产生合并的动画\n    this.mergedFrom = null\n  }\n\n  // 移动前，保存前置位置\n  savePosition() {\n    this.previousPosition = { x: this.x, y: this.y }\n  }\n\n  // 保存当前的最新位置\n  updatePosition(position) {\n    this.x = position.x\n    this.y = position.y\n  }\n}\n/* harmony export (immutable) */ __webpack_exports__[\"a\"] = Tile;\n\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvdGlsZS5qcz9iMGQzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUEiLCJmaWxlIjoiMTAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICDigJzlnZfigJ3nmoTnsbtcbiovXG5cbmV4cG9ydCBjbGFzcyBUaWxlIHtcbiAgY29uc3RydWN0b3IocG9zaXRpb24sIHZhbHVlKSB7XG4gICAgdGhpcy54ID0gcG9zaXRpb24ueFxuICAgIHRoaXMueSA9IHBvc2l0aW9uLnlcbiAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgMlxuICAgIC8vIOeUqOS6juiusOW9leWJjee9ruS9jee9ru+8jOS6p+eUn+enu+WKqOeahOWKqOeUu1xuICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IG51bGxcbiAgICAvLyDnlKjkuo7orrDlvZXlkIjlubbnmoTkvY3nva7vvIzkuqfnlJ/lkIjlubbnmoTliqjnlLtcbiAgICB0aGlzLm1lcmdlZEZyb20gPSBudWxsXG4gIH1cblxuICAvLyDnp7vliqjliY3vvIzkv53lrZjliY3nva7kvY3nva5cbiAgc2F2ZVBvc2l0aW9uKCkge1xuICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHsgeDogdGhpcy54LCB5OiB0aGlzLnkgfVxuICB9XG5cbiAgLy8g5L+d5a2Y5b2T5YmN55qE5pyA5paw5L2N572uXG4gIHVwZGF0ZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgdGhpcy54ID0gcG9zaXRpb24ueFxuICAgIHRoaXMueSA9IHBvc2l0aW9uLnlcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdGlsZS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==");

/***/ })
/******/ ]);