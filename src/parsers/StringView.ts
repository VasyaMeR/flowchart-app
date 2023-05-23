class StringView {
	private _string: string;
	private _index: number;

	constructor(str: string) {
		this._string = str.slice();
		this._index = 0;
	}

	getString(): string {
		return this._string.slice(this._index);
	}

	removePrefix(prefix: number): void {
		this._index += prefix;
		return;
		if (this._index >= this._string.length) {
			throw Error();
		}
	}

	get(index: number): string {
		return this._string[index + this._index];
	}

	front(): string {
		return this.get(0);
	}

	length(): number {
		return this._string.length - this._index;
	}

	removePrefixWhitespaces(): void {
		while (this.length() > 0 && this.front().search(/\s/) === 0) {
			this.removePrefix(1);
		}
	}

	isPrefix(prefix: string): boolean {
		if (this.length() < prefix.length) 
			return false;
		
		for (let i = 0; i < prefix.length; i++) {
			if (this.get(i) !== prefix[i])
				return false;
		}
		return true;
	}
}

export default StringView;