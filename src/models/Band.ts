export class Band {
	public name: string;
	public url: string;
	public genre: string;
	public location: string;
	public country: string;
	public status: string;

	constructor(name: string, url: string, genre: string, location: string, country: string, status: string) {
		this.name = name;
		this.url = url;
		this.genre = genre;
		this.location = location;
		this.country = country;
		this.status = status;
	}
}
