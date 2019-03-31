import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as exphbs from 'express-handlebars';
import { Players } from './players';

const app = express();

// View configuration
app.engine('handlebars', exphbs({ compilerOptions: undefined }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

// Force HTTPS
app.use((req, res, next) => {
	if (req.get('x-site-deployment-id') && !req.get('x-arr-ssl')) {
		return res.redirect('https://' + req.get('host') + req.url);
	}
	next();
});

// Pages
app.get('/', (req: express.Request, res: express.Response) => {
	res.render('index');
});

app.use(new Players().route());

// Statics
app.use('/src', express.static(path.join(__dirname, '..', '..', 'out', 'client')));
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));


const server = app.listen(process.env.PORT || 3000, () => {
		const { address, port } = server.address();
		const timeout = process.env['timeout'];
		server.timeout = timeout ? parseInt(timeout) : 1000 * 60 * 5;
		console.log('server listening on ' + address + ':' + port);
});