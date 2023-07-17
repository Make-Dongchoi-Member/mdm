import {} from "class-validator";

export class gameHistoryDto {
	readonly result: boolean;
	readonly date: string;
	readonly time: string;
	readonly enemy: string;
	
}
