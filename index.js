const express = require('express')

var flash = require('express-flash') // thư viện hiển thị thông báo
const cookieParser = require('cookie-parser');
const session = require('express-session');


require('dotenv').config();
const database = require("./config/database")
var methodOverride = require('method-override')
var bodyParser = require('body-parser')

const route = require('./routes/client/index.route')
const routeAdmin = require('./routes/admin/index.route')

const systemConfig = require('./config/system')

const app = express()
const port = process.env.PORT;
app.use(methodOverride('_method'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


database.connect();
app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug')
// flash
app.use(cookieParser('dnnnnnnnnnn'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// end flash
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`))

// route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})