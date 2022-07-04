var express = require('express');
const axios = require('axios')
const cheerio = require('cheerio')
var router = express.Router();

const url = 'https://www.leslibraires.fr/recherche/?q='

/* GET users listing. */
router.get('/get', function(req, res, next) {
	const ean = req.query.ean
	if(typeof ean != 'undefined' || ean  !== ""){
		axios(url + ean)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            var book = {
            	"name" : undefined,
            	"author" : undefined,
            	"price" : undefined
            }

            $('div.main-infos', html).each(function () { //<-- cannot be a function expression
                const title = $(this).text()
                book.name = $(this).find('h1').find('span').text()
                book.author = $(this).find('h2').find('a').text()
            })
            $('div.offer', html).each(function () { //<-- cannot be a function expression
                book.price = $(this).find('span.price').text()
            })

            if(typeof book.name != 'undefined' ){
            	res.json({book})
            }else{
            	res.json({"status" : 400,
					"message" : "Book not find"})
            }
        }).catch(err => console.log(err))
	}else{
		res.json({"status" : 400,
			"message" : "EAN is required"})
	}
	
});

module.exports = router;
