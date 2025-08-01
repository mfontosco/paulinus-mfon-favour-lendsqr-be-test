export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  karma_id: string;
}
// src/interfaces/user.interface.ts

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  karma_id: string;
}