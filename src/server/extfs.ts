import * as fs from 'fs';

export function exists(path: string): Promise<boolean> {
	return new Promise((c, e) => fs.exists(path, c));
}

export function readFile(path: string, encoding: string): Promise<string> {
	return new Promise((c, e) => {
		fs.readFile(path, { encoding }, (error, data) => error ? e(error) : c(data));
	});
}

export interface IWriteFileOptions {
	mode?: number;
	flag?: string;
}

let canFlush = true;

export function writeFile(path: string, data: string | NodeBuffer, options?: IWriteFileOptions): Promise<void> {
	return new Promise((c, e) => {
		options = ensureOptions(options);
		doWriteFileAndFlush(path, data, options, error => error ? e(error) : c());
	});
}

// Calls fs.writeFile() followed by a fs.sync() call to flush the changes to disk
// We do this in cases where we want to make sure the data is really on disk and
// not in some cache.
//
// See https://github.com/nodejs/node/blob/v5.10.0/lib/fs.js#L1194
function doWriteFileAndFlush(path: string, data: string | NodeBuffer, options: IWriteFileOptions, callback: (error?: Error) => void): void {
	if (!canFlush) {
		return fs.writeFile(path, data, { mode: options.mode, flag: options.flag }, callback);
	}

	// Open the file with same flags and mode as fs.writeFile()
	fs.open(path, options.flag, options.mode, (openError, fd) => {
		if (openError) {
			return callback(openError);
		}

		// It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
		fs.writeFile(fd, data, writeError => {
			if (writeError) {
				return fs.close(fd, () => callback(writeError)); // still need to close the handle on error!
			}

			// Flush contents (not metadata) of the file to disk
			fs.fdatasync(fd, (syncError: Error) => {

				// In some exotic setups it is well possible that node fails to sync
				// In that case we disable flushing and warn to the console
				if (syncError) {
					console.warn('[node.js fs] fdatasync is now disabled for this session because it failed: ', syncError);
					canFlush = false;
				}

				return fs.close(fd, closeError => callback(closeError));
			});
		});
	});
}

function ensureOptions(options?: IWriteFileOptions): IWriteFileOptions {
	if (!options) {
		return { mode: 0o666, flag: 'w' };
	}

	const ensuredOptions: IWriteFileOptions = { mode: options.mode, flag: options.flag };

	if (typeof ensuredOptions.mode !== 'number') {
		ensuredOptions.mode = 0o666;
	}

	if (typeof ensuredOptions.flag !== 'string') {
		ensuredOptions.flag = 'w';
	}

	return ensuredOptions;
}