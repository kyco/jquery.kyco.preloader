jquery.kyco.preloader
=====================

A jQuery image preloader plugin. This plugin let's you preload your images and CSS backgrounds with ease.


How to install
--------------

Download the jquery.kyco.preloader.min.js file and include it in your head after including jquery:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" />
    <script src="jquery.kyco.preloader.min.js" />

Also include the jquery.kyco.preloader.css file or integrate it directly into your stylesheet:

    <link rel="stylesheet" type="text/css" href="jquery.kyco.preloader.css" />

At it's most basic level call the preloader like this:

    <script>
        $(document).ready(function() {
            $('body').kycoPreload();
        });
    </script>

A customised example:

    <script>
        $(document).ready(function() {
            $('#mydiv').kycoPreload({
                truePercentage: false,
                showInContainer: true,
                progressiveReveal: true,
                debugMode: true,
                useOpacity: true,
                hidePercentage: true,
                loaderText: 'my custom loading text...',
                animationSpeed: 250,
                fadeOutDuration: 2500,
                onComplete: function() {
                    console.log('done');
                }
            });
        });
    </script>


Configuration
-------------

Options:

    preloadSelector: true,

Default: true
If set to true will preload the selector's background image, note that the image will show
as soon as it is loaded and not only once the preloader is done loading.

    truePercentage: true,

Default: true
NOTE: does not work with cross-domain calls.
If set to true will get the actual (compressed) file size of all the images instead of just looking
at the number of images loaded divided by the total number of images.

    showInContainer: false,

Default: false
If set to true will load the preloader inside the selector element instead of across the whole page.

    progressiveReveal: false,

Default: false
If set to true will show images as soon as they are preloaded.

    silentMode: false,

Default: false
If set to true will hide the preloader.

    debugMode: false,

Default: false
If set to true will show errors.

    useOpacity: false,

Default: false
If set to true will use opacity property to hide elements instead of display property.

    hidePercentage: false,

Default: false
If set to true will not show the percentage numbers while loading.

    loaderText: 'loading images, please wait...',

Default: 'loading images, please wait...'
Set the text of the loading message.

    animateDuration: 0,

Default: 0
Set the duration in milliseconds for each progress animation.

    fadeOutDuration: 100,

Default: 100
Set the duration in milliseconds for the preloader fade out animation.

    onComplete: function() {}

Default: function() {}
Called once after all images have been loaded and all preloader animations have completed.

Support
-------

For bugs or improvements please contact info@kyco.co.za