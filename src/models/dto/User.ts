import { Address, Role } from "../User";

export interface UserMinDto {
	_id: string,
	displayName: string
}

export interface UserPublicDto {
	role: Role,
	displayName: string,
	mainPhoneNumber?: string,
	altPhoneNumber?: string,
	address?: Address,
	email?: string,
}

export interface UserDto extends UserPublicDto {
	_id: string
}