export interface UserDto {
  id: string;
  email: string;
  password: string;
  roles?: Role[];
}

export interface Role {
  name: string;
}
