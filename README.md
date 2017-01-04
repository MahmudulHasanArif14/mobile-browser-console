# MobileBrowserConsole
A JavaScript module for working with a JavaScript console on mobile webpages.

## Usage

### To use in a mobile browser
You will have to import the file for any webpage you visit, each time you visit and want to use this tool. (Note: this is not guaranteed to work on all sites, devices, or browsers.)

To run the file, follow these quick 5 steps:

1. Select and copy all of the text in the url4console.txt file.
2. Go to the webpage you want to work with.
3. Clear the address bar, and paste the copied code into the address bar.
4. Type javascript: into the beginning of the address bar, including the colon (:) - leave no spaces anywhere!
5. Press GO.

The console should open up quickly, and you are ready to work!

### To use for your own development
Download the MobileBrowserConsole.js file (or minified MobileBrowserConsole.min.js file) and store and reference locally.

By default the console will open when the page loads. Writing <code>window.delayConsole = true;</code> in a script before calling in this file will prevent it from opening on page load.
You can then open it dynamically with <code>MobileWebConsole.createConsole();</code>

```
<script>
  window.delayConsole = true;
</script>
<script src="../pathto/MobileBrowserConsole.js"></script>
<script>

  // when it is convenient to open the console...
  MobileWebConsole.createConsole();
</script>
```

### Methods
The module overrides the window.console object (if it exists), adding functionality and new methods. The module name is Mobile Browser Console, with MBC as an alias. Standard methods are shown below (with the MBC alias).

MBC.createConsole() // Initializes module and creates new DOM elements defining console. This is all you need to enter to get the new console up and running.

MBC.create() // An alias for MBC.CreateConsole

MBC.hide() // Hides the console.

MBC.show() // Shows the console, if hidden.

MBC.destroy() // Reinstates initial console processes for the window.console object and removes new console DOM elements from page.

## License
These files are available for use under the MIT license.
