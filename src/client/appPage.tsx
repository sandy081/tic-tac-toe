import * as React from 'react';

export class AppPage extends React.Component<void, void> {

	render() {
		return (
			<div>
				<div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0px', fontSize: '50pt', fontFamily: 'cursive' }}>
					<div>Tic Tac Toe</div>
				</div>
				<div>
					<TicTacToe player1={{ name: 'Sandeep', points: 0 }} player2={{ name: 'Sushmi', points: 0 }} />
				</div>
			</div>
		);
	}

}

interface Player {
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
		const border = '8px solid #818182';
		return (
			<div>
				<div style={{ display: 'flex', fontSize: '20pt' }}>
					{[this.state.player1, this.state.player2].map(({ name, points }) => {
						return (
							<div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
								{`${name}: ${points}`}
							</div>
						)
					})}
				</div>
				<div style={{ marginTop: '100px' }}>
					<div style={{ display: 'flex', justifyContent: 'center', /* backgroundColor: '#ffc107', */padding: '20px 0px' }}>
						<div>
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
		if (!this.state.ticTacToe[row]) {
			this.state.ticTacToe[row] = [];
		}
		this.state.ticTacToe[row][column] = this.state.currentTurn;
		if (this.state.ticTacToe[row].length === 3 && this.state.ticTacToe[row].every(value => value && value.symbol === this.state.currentTurn.symbol)) {
			this.state.strike = [{ row, column: 0 }, { row, column: 1 }, { row, column: 2 }]
		} else if (this.state.ticTacToe.length === 3 && this.state.ticTacToe.every(value => value[column] && value[column].symbol === this.state.currentTurn.symbol)) {
			this.state.strike = [{ row: 0, column }, { row: 1, column }, { row: 2, column }]
		} else {
			if ((row === 0 && column === 0) || (row === 1 && column === 1) || (row === 2 && column === 2)) {
				if (this.state.ticTacToe[0] && this.state.ticTacToe[0][0] && this.state.ticTacToe[0][0].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[1] && this.state.ticTacToe[1][1] && this.state.ticTacToe[1][1].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[2] && this.state.ticTacToe[2][2] && this.state.ticTacToe[2][2].symbol === this.state.currentTurn.symbol) {
					this.state.strike = [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }]
				}
			}
			if ((row === 0 && column === 2) || (row === 1 && column === 1) || (row === 2 && column === 0)) {
				if (this.state.ticTacToe[0] && this.state.ticTacToe[0][2] && this.state.ticTacToe[0][2].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[1] && this.state.ticTacToe[1][1] && this.state.ticTacToe[1][1].symbol === this.state.currentTurn.symbol
					&& this.state.ticTacToe[2] && this.state.ticTacToe[2][0] && this.state.ticTacToe[2][0].symbol === this.state.currentTurn.symbol) {
					this.state.strike = [{ row: 0, column: 2 }, { row: 1, column: 1 }, { row: 2, column: 0 }]
				}
			}
		}
		this.state.currentTurn = this.state.player1 === this.state.currentTurn ? this.state.player2 : this.state.player1;
		this.setState(this.state);
	}
}