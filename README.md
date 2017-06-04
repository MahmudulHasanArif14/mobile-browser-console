# MobileBrowserConsole
A JavaScript module for working with a JavaScript console on mobile webpages.

## Usage

### To use in a mobile browser
You will have to import the file for any webpage you visit, each time you visit and want to use this tool. (Note: this process may be blocked on certain websites, devices, or browsers.)

To run the file, follow these quick 5 steps:

1. Select and copy all of the text in the url4console.txt file.
2. Go to the webpage you want to work with.
3. Clear the address bar, and paste the copied code into the address bar.
4. Type javascript: into the beginning of the address bar, including the colon (:) - leave no spaces anywhere!
5. Press GO.

The console should open up quickly, and you are ready to work!

### To use for your own development
Download the mobile-browser-console.js file (or minified mobile-browser-console.min.js file) and store and reference locally.

By default the console will open when the page loads. Writing <code>window.delayConsole = true;</code> in a script before calling in this file will prevent it from opening on page load.
You can then open it dynamically with <code>MobileBrowserConsole.createConsole();</code>

```javascript
<script>
  window.delayConsole = true;
</script>
<script src="../pathto/mobile-browser-console.js"></script>
<script>

  // when it is convenient to open the console...
  MobileBrowserConsole.createConsole();
</script>
```

### Methods
The module overrides the window.console object (if it exists), adding functionality and new methods. The module name is MobileBrowserConsole, with mbc as an alias. Standard methods are shown below (with the mbc alias).

mbc.createConsole() // Initializes module and creates new DOM elements defining console. This is all you need to enter to get the new console up and running.

`mbc.create();` // An alias for mbc.CreateConsole

`mbc.hide();` // Hides the console.

`mbc.show();` // Shows the console, if hidden.

`mbc.destroy();` // Reinstates initial console processes for the window.console object and removes new console DOM elements from page.

## License
These files are available for use under the MIT license.
