import { render } from 'react-dom';
import { createElement } from 'react';
import { AppPage, Player } from './appPage';

export function create() {
	const container = document.getElementById('container');
	getPlayers().then(players => render(createElement(AppPage, { players }), container));
}

function getPlayers(): JQueryPromise<Player[]> {
	const req: JQueryAjaxSettings = {
		url: `/players`,
		method: 'GET'
	};
	return $.ajax(req).then(data => JSON.parse(data));;
}
