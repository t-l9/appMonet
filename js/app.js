(function($) {
    let qs = getQueryParams(location);
    let prices = [];
    let highest = 0;
    var error = null;
    const yql_url = 'https://query.yahooapis.com/v1/public/yql';
    const url = 'http://us-east.dc-1.net/rtb/v1';


    /**
     * Calls the yql proxy to circumvent the Access-Control-Allow-Origin
     * header in order to call the desired url with price data.
     * The success of the function pushes the price to the prices
     * array then finds the current highest bid.
     * @returns {undefined}
     */
    function xhr(){
        return $.ajax({
            url: yql_url,
            data: {
                'q': 'SELECT * FROM json WHERE url="'+url+'"',
                'format': 'json',
                'jsonCompat': 'new',
            },
            dataType: 'json',
            timeout: qs.timeout,
            success: function (data) {
                let price = JSON.stringify(data['query']['results']['json']['response'][0]['price']);
                prices.push(price);
                getHighestPrice(prices);
                console.log(`Current Highest Bid: ${highest}`);
            },
            error: function(e, textstatus, message) {
                error = textstatus;
            }
        });
    }


    /**
     * Starts the calls to the endpoint by calling xhr()
     * and logging out the current highest bid, largest bid,
     * and possible errors.
     * @returns {undefined}
     */
    function makeRequest() {
        let p = $.when([]);
        for(let i = 0; i < qs.requests; i++) {
            p = p.then(() => xhr());
        }

        p.then(() => {
            console.log(`%c Final Highest Bid: ${highest} `, 'background: black; color: white');
        }).catch(reason => {
            if(error==="timeout") {
                console.error('The bidding request timed out.');
            } else {
                console.error(`textstatus ${textstatus}`);
            }
        });
    }


    /**
     * Get highest bid from prices
     * @param {array} arr   prices
     * @returns {object}    highest number
     */
    function getHighestPrice(arr) {
        for(let i = 0; i <= arr.length; i++) {
            if (arr[i] > highest) {
                highest = arr[i];
            }
        }

        return highest;
    }


    /**
     * Returns validated query params
     * @param {object} url  location object
     * @returns {object}    sanitized query param
     */
    function getQueryParams(url) {
        let qs = new Map(url.href.split('?')[1].split('&').map(q=>q.split("=")));
        let qsObject = strMapToObj(qs);
        const valid = validateQueryParams(qsObject);

        if (!valid) {
            console.error('Those query params are invalid.')
            throw qsObject
        }

        return qsObject;
    }


    /**
     * Returns validated query strings
     * @param {object} map  map of query params
     * @returns {object}    new object
     */
    function strMapToObj(map) {
        let obj = new Object;
        for (let [k,v] of map) {
            obj[k] = v;
        }

        return obj;
    }


    /**
     * Returns bool whether query params are valid
     * @param {object} qs   query params
     * @returns {boolean}
     */
    function validateQueryParams(qs) {
        let isValidNum = isValidNumber(qs);
        if(!isValidNum) {
            return false;
        }

        return true;
    }


    /**
     * Returns bool wheter query params are digits
     * and positive values
     * @param {object} qs   query params
     * @returns {boolean}
     */
    function isValidNumber(qs) {
        for (let key in qs) {
            if (qs.hasOwnProperty(key)) {
                if (/^\d+$/.test(qs[key]) == true && qs[key] > 0) {
                    continue;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }


    makeRequest()
})(jQuery);
