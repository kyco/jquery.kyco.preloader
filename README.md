jquery.kyco.preloader
=====================

A jQuery image preloader plugin. This plugin lets you preload your images and CSS backgrounds with ease.


How to install
--------------

Download the js file and include it in your head after including jquery:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" />
    <script src="jquery.kyco.preloader.min.js" />

Also include the css file:

    <link rel="stylesheet" type="text/css" href="jquery.kyco.preloader.css" />

Call the preloader like this:

    <script>
        $(document).ready(function() {
            $('body').kycoPreload();
        });
    </script>


Configuration - kycoPreload({ <em>options</em> })
-------------------------------------------------

    preloadSelector: true,

Default: true  
If set to true will preload the selector's background image, note that the image will show
as soon as it is loaded and not only once the preloader is done loading.

    truePercentage: true,

Default: true *(NOTE: does not work with cross-domain calls)*  
If set to true will get the actual (compressed) file size of all the images instead of just looking
at the number of images loaded divided by the total number of images.

    showInContainer: false,

Default: false  
If set to true will load the preloader inside the selector element instead of across the whole page.


    hideBackground: false,

Default: false *(NOTE: hideBackground is an option for when showInContainer is set to true)*  
If set to true will hide the css background-image of the selector element.

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

    showImagesBeforeComplete: true,

Default: true  
If set to false will wait for the animation of the preloader fade out to complete before showing the images.

    beforeComplete: function() {},

Default: function() {}  
Called once after all images have been loaded and before the fade out animation of the preloader triggers.

    onComplete: function() {}

Default: function() {}  
Called once after all images have been loaded and all preloader animations have completed.


Styling
-------

By default this preloader shows a progress bar. If you wish to use a spinner or something else
just edit the css file to hide the progress bar. I have added a stylesheet so that it is easy to 
detect which classes are used by the preloader. The preloader is quite flexible, all styles can 
be deleted except for the *position* attribute of *#kyco_preloader*.


What's to come
--------------

Demo files and a function that can be called after each image element has been loaded.


Support
-------

For bugs or improvements please email info@kyco.co.za.