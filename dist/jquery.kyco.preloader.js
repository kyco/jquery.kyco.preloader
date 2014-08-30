/***************************************\

	jquery.kyco.preloader
	=====================

	Version 1.2.0

	Brought to you by
	http://www.kycosoftware.com

	Copyright 2014 Cornelius Weidmann

	Distributed under the GPL

\***************************************/

(function($) {
	/*
	**	Defaults:
	**
	**	preloadSelector
	**		If set to true will preload the selector's background image, note
	**		that the image will show as soon as it is loaded and not only
	**		once the preloader is done loading.
	**
	**	truePercentage
	**		NOTE: does not work with cross-domain calls.
	**		If set to true will get the actual (compressed) file size of all
	**		the images instead of just looking at the number of images loaded
	**		divided by the total number of images.
	**
	**	disableOverlay
	**		If set to true will not create the blocking overlay.
	**
	**	showInContainer
	**		If set to true will load the preloader inside the selector element
	**		instead of across the whole page.
	**
	**	hideBackground
	**		NOTE: hideBackground is an option for when showInContainer is set
	**		to true.
	**		If set to true will hide the css background-image of the selector
	**		element.
	**
	**	hideNonImageElements
	**		If set to true will hide all elements of the selector, not only
	**		the images.
	**
	**	progressiveReveal
	**		NOTE: if hideNonImageElements is set to true then progessiveReveal
	**		might not return the expected result because the image element's
	**		parent might be hidden.
	**		If set to true will show images as soon as they are preloaded.
	**
	**	forceSequentialLoad
	**		Will force images to load in the order they appear in the DOM, this
	**		can potentially increase the load time because images won't start
	**		loading in parallel.
	**
	**	silentMode
	**		If set to true will hide the preloader.
	**
	**	debugMode
	**		If set to true will show errors.
	**
	**	useOpacity
	**		If set to true will use opacity property to hide elements instead
	**		of display property.
	**
	**	hidePercentage
	**		If set to true will not show the percentage numbers while loading.
	**
	**	loaderText
	**		Set the text of the loading message.
	**
	**	animateDuration
	**		Set the duration in milliseconds for each progress animation.
	**
	**	fadeOutDuration
	**		Set the duration in milliseconds for the preloader fadeout animation.
	**
	**	showImagesBeforeComplete
	**		If set to false will wait for the animation of the preloader fadeout
	**		to complete before showing the images.
	**
	**	afterEach
	**		Called once after every image load.
	**
	**	beforeComplete
	**		Called once after all images have been loaded and before the fadeout
	**		animation of the preloader triggers.
	**
	**	onComplete
	**		Called once after all images have been loaded and all preloader
	**		animations have completed.
	*/

	var defaults = {
		preloadSelector          : true,
		truePercentage           : true,
		disableOverlay           : false,
		showInContainer          : false,
		hideBackground           : false,
		hideNonImageElements     : false,
		progressiveReveal        : false,
		forceSequentialLoad      : false,
		silentMode               : false,
		debugMode                : false,
		useOpacity               : false,
		hidePercentage           : false,
		loaderText               : 'loading images, please wait...',
		animateDuration          : 1000,
		fadeOutDuration          : 100,
		showImagesBeforeComplete : true,
		afterEach                : function() {},
		beforeComplete           : function() {},
		onComplete               : function() {}
	};

	var methods = {
		init: function(options) {
			var settings = $.extend({}, defaults, options);

			return this.each(function() {
				var parent             = $(this);
				var elementChildren    = getAllChildren(parent);
				var imageElements      = [];
				var nonImageElements   = [];
				var imagesLoaded       = 0;
				var totalImages        = 0;
				var progressPercentage = 0;
				var totalPercentage    = 0;
				var count              = 0;
				var trickleSpeed       = 3000; // 3s, only used initially

				// Create preloader DOM elements.
				var preloadContainer = $('<div id="kyco_preloader"></div>');

				if (!settings.showInContainer) {
					preloadContainer.appendTo('body');
				} else {
					preloadContainer.appendTo(parent);
					parent.css('position', 'relative');
					preloadContainer.css('position', 'absolute');
				}

				if (!settings.disableOverlay) {
					var preloadOverlay = $('<div class="kyco_loader_overlay"></div>').appendTo(preloadContainer);
				} else {
					preloadContainer.css('height', 'auto');
				}

				var preloadLoader = $('<div class="kyco_loader"></div>').appendTo(preloadContainer);

				if (!settings.hidePercentage) {
					var progressNotification = $('<div class="kyco_progress_notification">' + settings.loaderText + ' <span class="kyco_progress_percentage">' + progressPercentage + '</span>%</div>').appendTo(preloadLoader);
				} else {
					var progressNotification = $('<div class="kyco_progress_notification">' + settings.loaderText + '</div>').appendTo(preloadLoader);
				}

				var progressBar    = $('<div class="kyco_progress_bar"></div>').appendTo(preloadLoader);
				var progressLoaded = $('<div class="kyco_progress_loaded"></div>').appendTo(progressBar);

				if (settings.silentMode) {
					preloadContainer.hide();
				}

				// Start animating progress bar to indicate activity
				if (settings.truePercentage) {
					updateProgressbar(1, trickleSpeed);
				}

				if (settings.debugMode) {
					var startTime = (new Date).getTime();

					console.groupCollapsed('kycoPreload > ', parent);
					console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': scanning DOM for image elements...');
					console.groupCollapsed('image elements');
				}

				/*
				**	Get all elements that contain images or background images
				**	to check how many images have to be preloaded.
				*/
				elementChildren.forEach(function(child) {
					if (child.is('img') || child.css('background-image') !== 'none' && child.css('background-image').indexOf('gradient') == -1) {
						// While preloading hide all elements except parent if set to false.
						if (!(settings.preloadSelector && settings.showInContainer && child === parent)) {
							if (!settings.useOpacity) {
								child.hide();
							} else {
								child.css('opacity', '0');
							}
						} else if (settings.hideBackground) {
							child.attr('data-bg', child.css('background-image')).css('background-image', 'none');
						}

						var imageElement = {
							node     : child,
							fileSize : 0
						};

						if (settings.debugMode) {
							console.log(imageElement.node);
						}

						imageElements.push(imageElement);
						totalImages++;
					} else if (settings.hideNonImageElements) {
						if (!settings.useOpacity) {
							child.hide();
						} else {
							child.css('opacity', '0');
						}
						nonImageElements.push(child);
					}
				});

				if (settings.debugMode) {
					console.groupEnd();
					console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': scanning DOM for image elements DONE');
				}

				/*
				**	Get the percentage total of all the images. Once this number is reached
				**	by the preloader the loading is done.
				*/
				if (settings.truePercentage) {
					if (settings.debugMode) {
						console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': getting image sizes...');
						console.groupCollapsed('image sizes');
					}

					/*
					**	Get the Content-Length attribute as rough estimate of the actual
					**	file size. Use this to get the total file size of all images and
					**	calculate percentage relative to it.
					*/
					imageElements.forEach(function(element) {
						$.ajax({
							type: 'HEAD',
							cache: false,
							url: getImageUrl(element.node),
							success: function(response, message, object) {
								element.fileSize = parseInt(object.getResponseHeader('Content-Length'));
								totalPercentage += element.fileSize;

								if (settings.debugMode) {
									console.log((element.fileSize / 1000).toFixed(2) + ' KB \t' + (totalPercentage / 1000).toFixed(2) + ' KB total');
								}

								continueCounting();
							},
							error: function(object, response, message) {
								// Ignore errors, they will be handled later. Show a message to notify.
								continueCounting();

								var markup = '';

								markup += 'Not all of your images were preloaded!<br>';
								markup += 'Loader failed getting image sizes.<br><br>';
								markup += '1. Make sure your images exist.<br>';
								markup += '2. Make sure your image paths/urls are correct.<br>';
								markup += '3. If you load images from a remote domain set <code>truePercentage: false</code>.<br><br>';
								markup += '<button>Close</button>';

								progressNotification.addClass('error').html(markup);
								progressBar.addClass('error');

								settings.fadeOutDuration = 500000;

								$('#kyco_preloader button').click(function() {
									preloadContainer.remove();
								});
							}
						});

						function continueCounting() {
							count++;

							if (count === totalImages) {
								if (settings.debugMode) {
									console.groupEnd();
									console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': getting image sizes DONE');
								}

								startPreloading();
							}
						}
					});
				} else {
					if (settings.debugMode) {
						console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': getting image sizes SKIPPED');
					}

					/*
					**	Get number of total images and use that to calculate percentage
					**	relative to number of images loaded.
					*/
					totalPercentage = totalImages;
					startPreloading();
				}

				function startPreloading() {
					if (settings.debugMode) {
						console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': preloading image elements...');
						console.groupCollapsed('intervals');
					}

					/*
					**	Get the url of the image or the css background image. Create a
					**	DOM image element which holds the image (preloads it) and triggers
					**	a progressbar update on successful load. Show all images or elements
					**	with background images only once all images have been preloaded.
					*/
					if (!settings.forceSequentialLoad) {
						imageElements.forEach(function(element, index) {
							var img = $('<img>').attr('src', getImageUrl(element.node));

							img.load(function() {
								updateLoader(element);
							}).error(function() {
								updateLoader(element);
								handleLoadingError(img, element);
							});
						});
					} else {
						(function loadImage(index) {
							var currentElement = imageElements[index];
							var img            = $('<img>').attr('src', getImageUrl(currentElement.node));

							img.load(function() {
								updateLoader(currentElement);

								if (++index < imageElements.length) {
									loadImage(index);
								}
							}).error(function() {
								// Ignore failed image loads but add an error class to the image.
								updateLoader(currentElement);

								if (++index < imageElements.length) {
									loadImage(index);
								}

								handleLoadingError(img, currentElement);
							});
						})(0);
					}
				}

				function handleLoadingError(image, element) {
					element.node.addClass('kyco_preloader_not_found_error');
				}

				function updateLoader(element) {
					imagesLoaded++;
					updateProgressPercentage(element);
					updateProgressbar(progressPercentage, undefined, element);

					if (settings.progressiveReveal) {
						revealElement(element.node);
					}

					settings.afterEach.call(element.node);
				}

				function updateProgressPercentage(element) {
					if (settings.truePercentage) {
						progressPercentage += (element.fileSize / totalPercentage) * 100;

						if (imagesLoaded === totalImages) {
							/*
							**	Sometimes truePercentage calculations end up being slighlty
							**	less or greater than 100% due to JavaScript's handling of
							**	floating point numbers, so here we make sure the progress
							**	is 100%.
							*/
							progressPercentage = 100;
						}
					} else {
						progressPercentage = (imagesLoaded / totalPercentage) * 100;
					}
				}

				function updateProgressbar(value, updateDuration, element) {
					if (updateDuration === undefined && settings.debugMode) {
						console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': ' + value.toFixed(2) + '%');
					}

					// Animates the progress bar and percentage to reflect the value specified.
					updateDuration = updateDuration !== undefined ? updateDuration : settings.animateDuration;
					var totalWidth = 0;

					if (settings.truePercentage) {
						if (element !== undefined) {
							updateDuration = Math.round(element.fileSize / 100);
						}

						if (value === 100) {
							updateDuration = settings.animateDuration;
						}
					}

					progressLoaded.stop();

					progressLoaded.animate({'width': value + '%'}, {
						duration: updateDuration,
						easing: 'linear',
						step: function() {
							/*
							**	Update totalWidth on each step rather than at top of function
							**	to ensure that the loading percentage is correct for the odd
							**	case when the browser window gets resized during loading.
							*/
							totalWidth = progressBar.width();

							// Set the progress percentage text to the currently animated width.
							progressNotification.children('span').html(Math.round((progressLoaded.width() / totalWidth) * 100));
						},
						complete: function() {
							/*
							**	The "step" function does not always trigger after the animation
							**	is done, that is why we make sure to always set the value here.
							**	E.g. we animate width to 100%, but at 99% the "step" function
							**	might trigger for the last time, which would cause an unwanted
							**	result. Also, the lower the animation speed is the less accurate
							**	the "step" gets, leading to scenarios where the progress bar's
							**	width could be 100% while the text reads something like 87%.
							*/
							progressNotification.children('span').html(Math.round(value));

							// Once done loading show all elements and delete preloader DOM elements.
							if (imagesLoaded === totalImages) {
								if (settings.debugMode) {
									console.groupEnd();
									console.log((((new Date).getTime() - startTime) / 1000).toFixed(3) + ': preloading image elements DONE');
									console.groupEnd();
								}

								progressLoaded.delay(100).queue(function() {
									if (settings.showImagesBeforeComplete) {
										imageElements.forEach(function(element) {
											revealElement(element.node);
										});

										nonImageElements.forEach(function(element) {
											revealElement(element);
										});

										settings.beforeComplete.call(this);

										preloadContainer.animate({'opacity':'0'}, settings.fadeOutDuration, function() {
											preloadContainer.remove();
											settings.onComplete.call(this);
										});
									} else {
										settings.beforeComplete.call(this);

										preloadContainer.animate({'opacity':'0'}, settings.fadeOutDuration, function() {
											imageElements.forEach(function(element) {
												revealElement(element.node);
											});

											nonImageElements.forEach(function(element) {
												revealElement(element);
											});

											preloadContainer.remove();
											settings.onComplete.call(this);
										});
									}
								});
							}
						}
					});
				}

				function getAllChildren(selector) {
					var selectorChildren = [];

					if (selector.children().length > 0) {
						if (settings.preloadSelector) {
							selectorChildren.push(selector);
						}

						getChildren(selector);
					} else if (settings.preloadSelector) {
						selectorChildren.push(selector);
					}

					function getChildren(element) {
						var children = element.children();

						if (children.length > 0) {
							children.each(function() {
								var _this = $(this);

								selectorChildren.push(_this);

								if (_this.children().length > 0) {
									getChildren(_this);
								}
							});
						}
					}

					return selectorChildren;
				}

				function getImageUrl(image) {
					if (image.css('background-image') !== 'none') {
						return image.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
					} else if (image.css('background-image') === 'none' && image.attr('data-bg')) {
						return image.attr('data-bg').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
					} else {
						return image.attr('src');
					}
				}

				function revealElement(element) {
					if (!settings.useOpacity) {
						element.show();
					} else {
						element.css('opacity', '1');
					}
					if (element.attr('data-bg')) {
						element.css('background-image', element.attr('data-bg'));
					}
				}
			});
		}
	};

	/*
	**	Check if browser supports Array.forEach() method, if it doesn't
	**	mimic that functionality, implementation from here:
	**	http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
	*/
	if (!('forEach' in Array.prototype)) {
		Array.prototype.forEach = function(action, that /*opt*/) {
			for (var i = 0, n = this.length; i < n; i++) {
				if (i in this) {
					action.call(that, this[i], i, this);
				}
			}
		};
	}

	$.fn.kycoPreload = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.kycoPreload');
		}
	};
})(jQuery);
