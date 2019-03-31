import * as express from 'express';
import { writeFile, exists, readFile } from './extfs';
import * as path from 'path';

interface Player {
	name: string;
	points: number;
}

export class Players {

	private players: Player[] = null;
	private playersFile: string = path.join(__dirname, 'players.json');;

	route(): express.Router {
		const router = express.Router();
		router.get('/players', (req, res) => this.getPlayers().then(players => res.send(JSON.stringify(players))));
		router.post('/players', (req, res) => this.savePlayers(req.body));
		return router;
	}

	private savePlayers(newPlayers: Player[]) {
		return this.getPlayers()
			.then(players => {
				this.players = newPlayers;
				for (const player of players) {
					if (this.players.every(({ name }) => name !== player.name)) {
						this.players.push(player);
					}
				}
				return writeFile(this.playersFile, JSON.stringify(this.players, null, '\t'));
			});
	}

	private getPlayers(): Promise<Player[]> {
		if (this.players) {
			return Promise.resolve(this.players);
		}
		return exists(this.playersFile)
			.then(exists => exists ? this.readPlayers() : []);
	}

	private readPlayers(): Promise<Player[]> {
		return readFile(this.playersFile, 'utf8')
			.then(content => <Player[]>JSON.parse(content));
	}

}