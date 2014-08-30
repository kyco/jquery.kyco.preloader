kyco Image Preloader
====================
####Version: 1.2.0

The simplest and most efficient way to preload your images. This plugin lets you
preload your images and CSS backgrounds with ease.

Take a look at the [demo](http://www.kycosoftware.com/projects/demo/image-preloader).

How to install
--------------

Bower: `bower install jquery.kyco.preloader -D`

Manual: Download or clone and include the minified js file after including jquery:

	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="jquery.kyco.preloader.min.js"></script>

For default styling include the CSS file and loading-error.png from the src directory:

	<link rel="stylesheet" href="jquery.kyco.preloader.css">

Call the preloader like this:

	<script>
		$(document).ready(function() {
			$('body').kycoPreload(); // This will preload all images on the page.
		});
	</script>

You can call the preloader on any tag of course, e.g. you only want to preload
your slider images. Below is what a customisation could look like:

	<div id="slider">
		<ul>
			<li><img src="slider01.png" /></li>
			<li style="background:url(slider02.png);"></li>
		</ul>
	</div>

	<script>
		$(document).ready(function() {
			$('#slider').kycoPreload({
				showInContainer: true,
				useOpacity: true,
				forceSequentialLoad: true,
				animateDuration: 1000,
				fadeOutDuration: 1500,
				afterEach: function() {
					$(this).fadeIn(1000); // $(this) refers to image that was preloaded.
				},
				beforeComplete: function() {
					console.log('images preloaded, fading out the overlay and loader at 1.5s');
				},
				onComplete: function() {
					console.log('cool beans!');
				}
			});
		});
	</script>


Configuration - kycoPreload({ *options* })
------------------------------------------

	preloadSelector: true,

If set to true will preload the selector's background image, note that the image will show
as soon as it is loaded and not only once the preloader is done loading.

	truePercentage: true,

*Note: does not work with cross-domain calls*  
If set to true will get the actual (compressed) file size of all the images instead of just looking
at the number of images loaded divided by the total number of images.

	disableOverlay: false,

If set to true will not create the blocking overlay.

	showInContainer: false,

If set to true will load the preloader inside the selector element instead of across the whole page.

	hideBackground: false,

*Note: hideBackground is an option for when showInContainer is set to true*  
If set to true will hide the css background-image of the selector element.

	hideNonImageElements: false,

If set to true will hide all elements of the selector, not only the images.

	progressiveReveal: false,

*Note: if hideNonImageElements is set to true then progessiveReveal might not return 
the expected result because the image element's parent might be hidden*  
If set to true will show images as soon as they are preloaded.

	forceSequentialLoad: false,

Will force images to load in the order they appear in the DOM, this can potentially
increase the load time because images won't start loading in parallel.

	silentMode: false,

If set to true will hide the preloader.

	debugMode: false,

If set to true will show errors.

	useOpacity: false,

If set to true will use opacity property to hide elements instead of display property.

	hidePercentage: false,

If set to true will not show the percentage numbers while loading.

	loaderText: 'loading images, please wait...',

Set the text of the loading message.

	animateDuration: 1000,

Set the duration in milliseconds for each progress animation.

	fadeOutDuration: 100,

Set the duration in milliseconds for the preloader fadeout animation.

	showImagesBeforeComplete: true,

If set to false will wait for the animation of the preloader fadeout to complete before showing the images.

	afterEach: function() {},

Called once after every image load.

	beforeComplete: function() {},

Called once after all images have been loaded and before the fadeout animation of the preloader triggers.

	onComplete: function() {}

Called once after all images have been loaded and all preloader animations have completed.


Styling
-------

By default this preloader shows a progress bar. If you wish to use a spinner or something else
just edit the css file to hide the progress bar. I have added a stylesheet so that it is easy to 
detect which classes are used by the preloader.

One easy way of styling the preloader is to set the <code>animateDuration: 10000000</code> when initiating
the preloader in order for the preloader to stay visible.

The preloader is quite flexible, all styles can 
be deleted except for the *position* attribute of *#kyco_preloader*.


Support
-------

For bugs or improvements please use the [issues tab](https://github.com/kyco/jquery.kyco.preloader/issues)
or email [support@kycosoftware.com](mailto:support@kycosoftware.com).
