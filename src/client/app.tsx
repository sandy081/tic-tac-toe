import { render } from 'react-dom';
import { createElement } from 'react';
import { AppPage } from './appPage';

export function create() {
	const container = document.getElementById('container');
	render(createElement(AppPage), container)
}
