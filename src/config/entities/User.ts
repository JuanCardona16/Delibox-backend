export interface User {
  _id: string;
  uuid: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export type UserDto = Omit<User, 'uuid'>
export type UserDtoUpdate = Partial<User>
