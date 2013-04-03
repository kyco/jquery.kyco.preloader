jquery.kyco.preloader
=====================

This is a simple preloader for preloading images and css backgrounds.

How to install
--------------

Download the jquery.kyco.preloader.js file and include it in your head after including jquery:

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js" />
    <script src="jquery.kyco.preloader.min.js" />

Call the preloader like this:

    <script>
        $(document).ready(function() {
            $('body').kycoPreload();
        });
    </script>