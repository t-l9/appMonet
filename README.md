
### Instructions:


 * Make sure you have git, node and npm installed.
 * Run `git clone git@github.com:timlauter/appMonet.git` (*DO NOT* `cd` into it)
 * In your terminal run `npm install http-server -g`
 * To serve the app run `http-server ./appMonet -p 1337 -o`
 * Update the url to look like this: `http://127.0.0.1:8080/index.html?requests=15&timeout=75`
 * Update the values of `request` and `timeout` if desired. The current url is a good balance of full responses and timeouts. Because I'm using a proxy, don't make requests a very large number because yahoo will lock you out for a couple minutes. (See the JS Doc above the `xhr()` function in `app.js` for further explaination)
 * Have fun and let me know if you have any questions!
