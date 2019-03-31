import * as React from 'react';

export class AppPage extends React.Component<{ players: Player[] }, TicTacToeProperties> {

	private regPage: Registeration;

	render() {
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0px', fontSize: '50pt', fontFamily: 'cursive' }}>
					<div>Tic Tac Toe</div>
				</div>
				<div>
					{this.state ? <TicTacToe player1={this.state.player1} player2={this.state.player2} />
						: <Registeration onDidRegister={(player1, player2) => this.addPlayers(player1, player2)} />}
				</div>
			</div>
		);
	}

	private addPlayers(player1: Player, player2: Player) {
		const existingPlayer1 = this.props.players.filter(({ name }) => name === player1.name)[0];
		if (existingPlayer1) {
			player1 = existingPlayer1;
		} else {
			this.props.players.push(player1);
		}
		const existingPlayer2 = this.props.players.filter(({ name }) => name === player2.name)[0];
		if (existingPlayer1) {
			player2 = existingPlayer2;
		} else {
			this.props.players.push(player2);
		}
		savePlayers([player1, player2]);
		this.setState({ player1, player2 });
	}
}

export interface Player {
	name: string,
	points: number
}

interface TicTacToeProperties {
	player1: Player,
	player2: Player,
}

interface PlayerState extends Player {
	symbol: 'O' | 'X';
	className: string,
}

interface TicTacToeState {
	player1: PlayerState,
	player2: PlayerState,
	currentTurn: PlayerState,
	ticTacToe: PlayerState[][];
	strike: { row: number, column: number }[];
}

class Registeration extends React.Component<{ onDidRegister: (player1: Player, player2: Player) => void }, void> {

	private input1: HTMLInputElement;
	private input2: HTMLInputElement;

	render() {
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'center', fontFamily: 'verdana', fontSize: '16pt' }}>
					<div>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<div style={{ marginRight: '20px' }}>Player 1:</div>
							<input ref={input => { this.input1 = input }} />
						</div>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<div style={{ marginRight: '20px' }}>Player 2:</div>
							<input ref={input => { this.input2 = input }} />
						</div>
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
					<div className='button' style={{ fontSize: '20pt', display: 'inline-block', width: '200px', textAlign: 'center', marginLeft: '40px' }} onClick={() => this.props.onDidRegister({ name: this.input1.value, points: 0 }, { name: this.input2.value, points: 0 })}>
						Start
					</div>
				</div>
			</div>
		)
	}
}


class TicTacToe extends React.Component<TicTacToeProperties, TicTacToeState> {

	constructor(props: TicTacToeProperties) {
		super(props);
		this.resetState(props);
	}

	private resetState(props: TicTacToeProperties): void {
		const player1: PlayerState = {
			name: props.player1.name,
			points: props.player1.points,
			className: 'player1',
			symbol: 'X'
		}
		const player2: PlayerState = {
			name: props.player2.name,
			points: props.player2.points,
			className: 'player2',
			symbol: 'O'
		}
		this.state = {
			player1,
			player2,
			currentTurn: player1,
			ticTacToe: [
				[null, null, null],
				[null, null, null],
				[null, null, null]
			],
			strike: []
		}
	}

	componentWillReceiveProps(nextProps: TicTacToeProperties): void {
		this.resetState(nextProps);
	}

	render() {
		return (
			<div>
				<div style={{ display: 'flex', fontSize: '20pt', fontFamily: 'verdana' }}>
					{[this.state.player1, this.state.player2].map(player => {
						return (
							<div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
								<div className={player.className} style={this.state.currentTurn === player ? { borderBottom: '4px solid rgb(10, 140, 10)' } : {}}>{`${player.name}: ${player.points}`}</div>
							</div>
						)
					})}
				</div>
				<div style={{ marginTop: '100px' }}>
					<div style={{ display: 'flex', justifyContent: 'center', /* backgroundColor: '#ffc107', */padding: '20px 0px' }}>
						{this.renderTicTacToeGrid()}
					</div>
				</div>
				<div style={{ marginTop: '100px' }}>
					<div style={{ display: 'flex', justifyContent: 'center', fontSize: '12pt' }}>
						{this.renderStatus()}
					</div>
				</div>
				<div style={{ marginTop: '20px' }}>
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						{this.renderButtons()}
					</div>
				</div>
			</div>
		);
	}

	private renderStatus(): JSX.Element {
		if (this.state.strike.length) {
			return (
				<div className={this.state.currentTurn.className} style={{ fontSize: '30pt' }}>
					{`${this.state.currentTurn.name} Won !!!`}
				</div>
			);
		}
		if (this.isDrawn()) {
			return (
				<div style={{ fontSize: '30pt' }}>
					Game Drawn !!!
				</div>
			);
		}
		return (
			<div className={this.state.currentTurn.className}>
				{`${this.state.currentTurn.name}'s Turn`}
			</div>
		);
	}

	private renderButtons(): JSX.Element {
		if (this.state.strike.length || this.isDrawn()) {
			return (
				<div className='button' style={{ fontSize: '20pt' }} onClick={() => { this.resetState(this.props); this.setState(this.state) }}>
					New Game
				</div>
			);
		}
		return null;
	}

	private renderTicTacToeGrid(): JSX.Element {
		const border = '8px solid #818182';
		return (
			<div className={this.state.strike.length ? 'strike' : ''}>
				<div style={{ display: 'flex' }}>
					<div className={this.getClassName(0, 0)} style={{ borderBottom: border, borderRight: border }} onClick={() => this.onClick(0, 0)}>
						{this.state.ticTacToe[0] && this.state.ticTacToe[0][0] ? this.state.ticTacToe[0][0].symbol : ''}
					</div>
					<div className={this.getClassName(0, 1)} style={{ borderBottom: border, borderRight: border }} onClick={() => this.onClick(0, 1)}>
						{this.state.ticTacToe[0] && this.state.ticTacToe[0][1] ? this.state.ticTacToe[0][1].symbol : ''}
					</div>

					<div className={this.getClassName(0, 2)} style={{ borderBottom: border }} onClick={() => this.onClick(0, 2)}>
						{this.state.ticTacToe[0] && this.state.ticTacToe[0][2] ? this.state.ticTacToe[0][2].symbol : ''}
					</div>
				</div>
				<div style={{ display: 'flex' }}>
					<div className={this.getClassName(1, 0)} style={{ borderBottom: border, borderRight: border }} onClick={() => this.onClick(1, 0)}>
						{this.state.ticTacToe[1] && this.state.ticTacToe[1][0] ? this.state.ticTacToe[1][0].symbol : ''}
					</div>

					<div className={this.getClassName(1, 1)} style={{ borderBottom: border, borderRight: border }} onClick={() => this.onClick(1, 1)}>
						{this.state.ticTacToe[1] && this.state.ticTacToe[1][1] ? this.state.ticTacToe[1][1].symbol : ''}
					</div>

					<div className={this.getClassName(1, 2)} style={{ borderBottom: border }} onClick={() => this.onClick(1, 2)}>
						{this.state.ticTacToe[1] && this.state.ticTacToe[1][2] ? this.state.ticTacToe[1][2].symbol : ''}
					</div>
				</div>
				<div style={{ display: 'flex' }}>
					<div className={this.getClassName(2, 0)} style={{ borderRight: border }} onClick={() => this.onClick(2, 0)}>
						{this.state.ticTacToe[2] && this.state.ticTacToe[2][0] ? this.state.ticTacToe[2][0].symbol : ''}
					</div>

					<div className={this.getClassName(2, 1)} style={{ borderRight: border }} onClick={() => this.onClick(2, 1)}>
						{this.state.ticTacToe[2] && this.state.ticTacToe[2][1] ? this.state.ticTacToe[2][1].symbol : ''}
					</div>

					<div className={this.getClassName(2, 2)} onClick={() => this.onClick(2, 2)}>
						{this.state.ticTacToe[2] && this.state.ticTacToe[2][2] ? this.state.ticTacToe[2][2].symbol : ''}
					</div>
				</div>
			</div>
		);
	}

	private getClassName(row: number, column: number): string {
		let className = 'cell';
		if (this.state.ticTacToe[row] && this.state.ticTacToe[row][column]) {
			className += ' value';
			className += ` ${this.state.ticTacToe[row][column].className}`;
			if (this.state.strike && this.state.strike.some(s => s.row === row && s.column === column)) {
				className += ' strike';
			}
		}
		return className;
	}

	private onClick(row: number, column: number): void {
		if (this.state.ticTacToe[row][column] || this.state.strike.length || this.isDrawn()) {
			return;
		}
		this.state.ticTacToe[row][column] = this.state.currentTurn;
		if (this.state.ticTacToe[row].every(value => value && value.symbol === this.state.currentTurn.symbol)) {
			this.state.strike = [{ row, column: 0 }, { row, column: 1 }, { row, column: 2 }]
		} else if (this.state.ticTacToe.every(value => value[column] && value[column].symbol === this.state.currentTurn.symbol)) {
			this.state.strike = [{ row: 0, column }, { row: 1, column }, { row: 2, column }]
		} else {
			if ((row === 0 && column === 0) || (row === 1 && column === 1) || (row === 2 && column === 2)) {
				if (this.state.ticTacToe[0][0] && this.state.ticTacToe[0][0].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[1][1] && this.state.ticTacToe[1][1].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[2][2] && this.state.ticTacToe[2][2].symbol === this.state.currentTurn.symbol) {
					this.state.strike = [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }]
				}
			}
			if ((row === 0 && column === 2) || (row === 1 && column === 1) || (row === 2 && column === 0)) {
				if (this.state.ticTacToe[0][2] && this.state.ticTacToe[0][2].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[1][1] && this.state.ticTacToe[1][1].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[2][0] && this.state.ticTacToe[2][0].symbol === this.state.currentTurn.symbol) {
					this.state.strike = [{ row: 0, column: 2 }, { row: 1, column: 1 }, { row: 2, column: 0 }]
				}
			}
		}
		if (this.state.strike.length) {
			this.state.currentTurn.points++;
		} else {
			this.state.currentTurn = this.state.player1 === this.state.currentTurn ? this.state.player2 : this.state.player1;
		}
		this.setState(this.state);
	}

	private isDrawn(): boolean {
		return this.state.ticTacToe.every(row => row.every(col => !!col));
	}
}

function savePlayers(players: Player[]): JQueryPromise<void> {
	const req: JQueryAjaxSettings = {
		url: `/players`,
		method: 'POST',
		data: JSON.stringify(players),
		headers: {
			'Content-Type': 'application/json'
		}
	};
	return $.ajax(req);
}