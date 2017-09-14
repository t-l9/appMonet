(function($) {
    let qs = getQueryParams(location);
    let prices = [];
    let highest = 0;

    const yql_url = 'https://query.yahooapis.com/v1/public/yql';
    const url = 'http://us-east.dc-1.net/rtb/v1';

    function xhr(qs){
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
                let json = JSON.stringify(data['query']['results']['json']['response'][0]['price']);
                prices.push(json);
                getHighestPrice(prices);
                console.log(`Current Highest Bid: ${highest}`);
            },
            error: function(e, textstatus, message) {
                if(textstatus==="timeout") {
                    console.error(textstatus);
                } else {
                    console.error(textstatus);
                }
            }
        });
    }

    function makeRequest(qs) {
        for(let i = 0; i < qs.requests; i++) {
            xhr(qs);
        }
    }

    function getHighestPrice(arr) {
        for(let i = 0; i <= arr.length; i++) {
            if (arr[i] > highest) {
                highest = arr[i]
            }
        }

        return highest;
    }

    function getQueryParams(url) {

        let qs = new Map(url.href.split('?')[1].split('&').map(q=>q.split("=")));
        let qsObject = strMapToObj(qs);
        const valid = validateQueryParams(qsObject);

        if (!valid) {
            return new Error('Those query params are invalid.')
        }

        return qsObject;
    }

    function strMapToObj(map) {
        let obj = new Object;
        for (let [k,v] of map) {
            obj[k] = v;
        }

        return obj;
    }

    function validateQueryParams(qs) {
        let isValidNum = isValidNumber(qs);
        if(!isValidNum) {
            return false;
        }

        return true
    }

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

    makeRequest(qs)
})(jQuery);
