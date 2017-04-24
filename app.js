// require and instantiate express
const app = require('express')()
var express = require('express');


/************************************************************/
//Title
var txtTitle = 'Durval Ramos Junior - Knowledge test';
var vLink = '';

// My Info to simulate an use constant data
const myInfo = [
  {
    id: 1,
    key: 'Goals:',
    value: 'Tech Lead and software development'
  },
  {
    id: 2,
    key: 'Cell phone:',
    value: '+55 11-99181-4830'
  },
  {
    id: 3,
    key: 'Email:',
    value: 'durval@msn.com'
  },
  {
    id: 4,
    key: 'Address:',
    value: 'Rua Werner Goldberg, 179, ap.211 Dalia Tower - Jd.Tupancy - 			Barueri, SP - Brazil'
  }
]

/************************************************************/


const sqlite = require('sqlite3');
//Open Database connection
let db = new sqlite.Database('./db/development.sqlite3');

var QryProducts;
db.all("SELECT * FROM products ORDER BY ProductName", function(err, rows) {
	if (err) throw err;
	/*for (var iCount = 0; iCount < rows.length; iCount++) {
		console.log(rows[iCount].id + ": " + rows[iCount].ProductName + " - " + rows[iCount].Price);
	}*/
	QryProducts = rows;
});

var QryCustomers;
db.all("SELECT * FROM customers ORDER BY CustomerName", function(err, rows) {
	if (err) throw err;

	QryCustomers = rows;
});

var QryPriceRules;
db.all("SELECT * FROM price_rules INNER JOIN privileged_customers ON price_rules.PriceRulesID = privileged_customers.PriceRulesID ORDER BY privileged_customers.CustomerID, price_rules.ProductID", function(err, rows) {
	if (err) throw err;

	QryPriceRules = rows;
});


//Close Database connection
function closeDb() {
	db.close((e) => {
	if (e) console.log(e);
	});
}

// Set the view engine to ejs
app.set('view engine', 'ejs')

/************************************************************/
// Presentation pages
/************************************************************/

// Home page
app.get('/', (req, res) => {
  // render `home.ejs` with the list of posts
  res.render('home', { myInfo: myInfo, vLink:vLink, txtTitle:txtTitle})
})

// App Test page
app.get('/test', (req, res) => {
  // render `test.ejs` with my Resume
  res.render('test', { txtTitle:txtTitle, vLink:vLink })
})

// Resume page
app.get('/resume', (req, res) => {
  // render `resume.ejs` with my Resume
  res.render('resume', { myInfo: myInfo, vLink:vLink, txtTitle:txtTitle })
})

// Contact page
app.get('/contact', (req, res) => {
  // render `contact.ejs` with my Personal data
  res.render('contact', { myInfo: myInfo, vLink:vLink, txtTitle:txtTitle })
})


/************************************************************/
// Test App pages
/************************************************************/

// Ads Checkout's system
app.get('/adscheckout', (req, res) => {
  // render `adscheckout.ejs` with Customers / Product's list

  res.render('adscheckout', { txtTitle:txtTitle, vLink:vLink, QryProducts:QryProducts, QryCustomers:QryCustomers, QryPriceRules:QryPriceRules })
})

// Product's pages
app.get('/listproducts', (req, res) => {
  // render `listproducts.ejs` with Product's list

  res.render('listproducts', { QryProducts:QryProducts, vLink:vLink, txtTitle:txtTitle })
})

app.get('/formproducts', (req, res) => {
  // render `formproducts.ejs` with Product's form

  res.render('formproducts', { txtTitle:txtTitle, vLink:vLink })
})

app.get('/newproducts', (req, res) => {
  // render `newproducts.ejs` with New Product's form
  res.render('newproducts', { txtTitle:txtTitle, vLink:vLink })
})


app.get('/formproducts/:id', (req, res) => {
  // render `formproducts.ejs` with Product's form

	var idForm   = req.params.id;
	vLink = '../';

	//const Product = QryProducts.filter((Product) => { return Product.id == idForm })[0]

	db.get("SELECT * FROM products WHERE id = ?", idForm, function(err, row) {
		if (err) throw err;

	  // render the `formproducts.ejs` template with the post content
	  res.render('formproducts', { txtTitle:txtTitle, idForm: idForm, vLink:vLink, Product: row })

	});

})



// Customers pages
app.get('/listcustomers', (req, res) => {
  // render `listcustomers.ejs` with Product's list

  res.render('listcustomers', { QryCustomers:QryCustomers, vLink:vLink, txtTitle:txtTitle })
})

app.get('/formcustomers/:id', (req, res) => {
  // render `formcustomers.ejs` with Customers form

	var idForm   = req.params.id;
	vLink = '../';

	db.get("SELECT * FROM customers WHERE id = ?", idForm, function(err, row) {
		if (err) throw err;

	  // render the `formcustomers.ejs` template with the post content
	  res.render('formcustomers', { txtTitle:txtTitle, idForm: idForm, vLink:vLink, Customer: row })

	});

})

app.get('/newcustomers', (req, res) => {
  // render `newcustomers.ejs` with New Customers form
  res.render('newcustomers', { QryCustomers:QryCustomers, txtTitle:txtTitle, vLink:vLink })
})



// "Price Rules" pages
app.get('/listpricerules', (req, res) => {
  // render `listpricerules.ejs` with "Price Rules" list

  res.render('listpricerules', { QryPriceRules:QryPriceRules, vLink:vLink, txtTitle:txtTitle })
})

app.get('/formpricerules/:id', (req, res) => {
  // render `formpricerules.ejs` with "Price Rules" form

	var idForm   = req.params.id;
	vLink = '../';

	db.get("SELECT * FROM price_rules WHERE PriceRulesID = ?", idForm, function(err, row) {
		if (err) throw err;

	  // render the `formpricerules.ejs` template with the post content
	  res.render('formpricerules', { txtTitle:txtTitle, idForm: idForm, vLink:vLink, Customer: row })

	});

})

app.get('/newpricerules', (req, res) => {
  // render `newpricerules.ejs` with New "Price Rules" form
  res.render('newpricerules', { QryCustomers:QryCustomers, txtTitle:txtTitle, vLink:vLink })
})


/************************************************************/

app.use(express.static(__dirname + '/public'));

app.listen(8080)

console.log('listening on port 8080')
