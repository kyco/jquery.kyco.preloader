// jquery.kyco.preloader brought to you by www.kyco.co.za. Copyright 2013 Cornelius Weidmann. Distributed under the GPL.
(function($) {
    var methods = {
        init: function(options) {
            var defaults = {
                preloadSelector: true,
                // default: true
                // if set to true will preload the selector's background image, note that the image will show
                // as soon as it is loaded and not only once the preloader is done loading
                truePercentage: true,
                // default: true
                // NOTE: does not work with cross-domain calls
                // if set to true will get the actual (compressed) file size of all the images instead of just looking
                // at the number of images loaded divided by the total number of images
                showInContainer: false,
                // default: false
                // if set to true will load the preloader inside the selector element instead of across the whole page
                progressiveReveal: false,
                // default: false
                // if set to true will show images as soon as they are preloaded
                silentMode: false,
                // default: false
                // if set to true will hide the preloader
                debugMode: false,
                // default: false
                // if set to true will show errors
                useOpacity: false,
                // default: false
                // if set to true will use opacity property to hide elements instead of display property
                hidePercentage: false,
                // default: false
                // if set to true will not show the percentage numbers while loading
                loaderText: 'loading images, please wait...',
                // default: 'loading images, please wait...'
                // set the text of the loading message
                animateDuration: 0,
                // default: 0
                // set the duration in milliseconds for each progress animation
                fadeOutDuration: 100,
                // default: 100
                // set the duration in milliseconds for the preloader fade out animation
                onComplete: function() {}
                // default: function() {}
                // called once after all images have been loaded and all preloader animations have completed
            };

            var settings = $.extend({}, defaults, options);

            return this.each(function() {
                var parent = $(this);
                var elementChildren = getAllChildren(parent);
                var imageElements = [];
                var imagesLoaded = 0;
                var totalImages = 0;
                var progressPercentage = 0;
                var totalPercentage = 0;

                // Create preloader DOM elements.
                var preloadContainer = $('<div id="kyco_preloader"></div>');
                if (!settings.showInContainer) {
                    preloadContainer.appendTo('body');
                } else {
                    preloadContainer.appendTo(parent);
                    parent.css('position', 'relative');
                    preloadContainer.css('position', 'absolute');
                }
                var preloadOverlay = $('<div class="kyco_loader_overlay"></div>').appendTo(preloadContainer);
                var preloadLoader = $('<div class="kyco_loader"></div>').appendTo(preloadContainer);
                if (!settings.hidePercentage) {
                    var progressNotification = $('<div class="kyco_progress_notification">' + settings.loaderText + ' <span class="kyco_progress_percentage">' + progressPercentage + '</span>%</div>').appendTo(preloadLoader);
                } else {
                    var progressNotification = $('<div class="kyco_progress_notification">' + settings.loaderText + '</div>').appendTo(preloadLoader);
                }
                var progressBar = $('<div class="kyco_progress_bar"></div>').appendTo(preloadLoader);
                var progressLoaded = $('<div class="kyco_progress_loaded"></div>').appendTo(progressBar);

                if (settings.silentMode) {
                    preloadContainer.hide();
                }
                // Get all elements that contain images or background images
                // to check how many images have to be preloaded.
                elementChildren.forEach(function(child) {
                    if (child.is('img') || child.css('backgroundImage') !== 'none') {
                        // While preloading hide all elements except parent if set to false.
                        if (!(settings.preloadSelector && settings.showInContainer && child === parent)) {
                            if (!settings.useOpacity) {
                                child.hide();
                            } else {
                                child.css('opacity', '0');
                            }
                        }
                        var imageElement = {
                            node: child,
                            fileSize: 0
                        };
                        imageElements.push(imageElement);
                        totalImages++;
                    }
                });

                // Get the percentage total of all the images. Once this number is reached
                // by the preloader the loading is done.
                if (settings.truePercentage) {
                    var count = 0;
                    // Get the Content-Length attribute as rough estimate of the actual file size.
                    // Use this to get the total file size of all images and calculate percentage relative to it.
                    imageElements.forEach(function(element) {
                        $.ajax({
                            type: 'HEAD',
                            url: getImgUrl(element.node),
                            success: function(response, message, object) {
                                element.fileSize = parseInt(object.getResponseHeader('Content-Length'));
                                totalPercentage += parseInt(object.getResponseHeader('Content-Length'));
                                count++;
                                if (count === totalImages) {
                                    startPreloading();
                                }
                            },
                            error: function(object, response, message) {
                                if (settings.debugMode) {
                                    if (object.status === 404) {
                                        if (progressNotification.find('pre').length !== 0) {
                                            $('<div>Not found: ' + getImgUrl(element.node) + '</div>').appendTo(progressNotification.find('pre'));
                                        } else {
                                            progressNotification.html('Failed loading images:<pre><div>Not found: ' + getImgUrl(element.node) + '</div></pre>');
                                        }
                                    } else if (object.status === 0) {
                                        if (progressNotification.find('pre').length !== 0) {
                                            $('<div>Invalid cross-domain call: ' + getImgUrl(element.node) + '</div>').appendTo(progressNotification.find('pre'));
                                        } else {
                                            progressNotification.html('Failed loading images:<pre><div>Invalid cross-domain call: ' + getImgUrl(element.node) + '</div></pre>');
                                        }
                                    } else {
                                        if (progressNotification.find('pre').length !== 0) {
                                            $('<div>Couldn\'t get file size, set {truePercentage: false}</div>').appendTo(progressNotification.find('pre'));
                                        } else {
                                            progressNotification.html('Failed loading images:<pre><div>Couldn\'t get file size, set {truePercentage: false}</div></pre>');
                                        }
                                    }
                                    progressNotification.css('text-align', 'left');
                                } else {
                                    progressNotification.html('failed loading one or more images... please refresh the page');
                                }
                            }
                        });
                    });
                } else {
                    // Get number of total images and use that to calculate percentage relative
                    // to number of images loaded.
                    totalPercentage = totalImages;
                    startPreloading();
                }

                function startPreloading() {
                    // Get the url of the image or the css background image. Create a DOM image element which
                    // holds the image (preloads it) and triggers a progressbar update on successful load.
                    // Show all images or elements with background images only once all images have been preloaded.
                    imageElements.forEach(function(element) {
                        var img = $('<img src="' + getImgUrl(element.node) + '" />');
                        var imgLoadError = false; // Hack for Firefox: Firefox triggers the img.error() function twice.
                        img.load(function() {
                            imagesLoaded++;
                            calculateCurrentLoadPercentage(element);
                            updateProgressbar(progressPercentage);
                            if (settings.progressiveReveal) {
                                revealElement(element.node);
                            }
                        }).error(function() {
                            // Ignore failed image loads but notify user with a console message.
                            if (!imgLoadError) {
                                imgLoadError = true;
                                if (settings.debugMode) {
                                    var errorUrl = img.attr('src') ? img.attr('src') : img.css('backgroundImage');
                                    if (progressNotification.find('pre').length !== 0) {
                                        $('<div>Not found: ' + errorUrl + '</div>').appendTo(progressNotification.find('pre'));
                                    } else {
                                        progressNotification.html('Failed loading images:<pre><div>Not found: ' + errorUrl + '</div></pre>');
                                    }
                                    progressNotification.css('text-align', 'left');
                                } else {
                                    progressNotification.html('failed loading one or more images... please refresh the page');
                                }
                            }
                        });

                        function calculateCurrentLoadPercentage(element) {
                            if (settings.truePercentage) {
                                progressPercentage += (element.fileSize / totalPercentage) * 100;
                            } else {
                                progressPercentage = (imagesLoaded / totalPercentage) * 100;
                            }
                        }
                    });
                }

                function updateProgressbar(value) {
                    // Updates the progress bar to the value specified.
                    // Sometimes truePercentage calculations end up being slighlty less or greater than 100% due to
                    // JavaScript's handling of floating point numbers, so here we make sure the progress is 100%.
                    progressPercentage = value > 99 ? 100 : value;
                    var totalWidth = progressBar.width();
                    progressLoaded.stop().animate({'width': progressPercentage + '%'}, {
                        duration: settings.animateDuration,
                        easing: 'linear',
                        progress: function() {
                            progressNotification.children('span').html(Math.floor((progressLoaded.width() / totalWidth) * 100));
                        }
                    });

                    // Once done loading show all elements and delete preloader DOM elements.
                    if (imagesLoaded === totalImages) {
                        imageElements.forEach(function(element) {
                            revealElement(element.node);
                        });

                        progressLoaded.queue(function() {
                            preloadContainer.animate({'opacity':'0'}, settings.fadeOutDuration, function() {
                                preloadContainer.remove();
                                settings.onComplete.call(this);
                            });
                        });
                    }
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

                function getImgUrl(image) {
                    if (image.css('backgroundImage') !== 'none') {
                        return image.css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
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
                }
            });
        }
    };

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