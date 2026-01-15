import { JwtDTO } from 'src/app/models/login/jwt-dto';

export interface LoginResponseDto {
  jwt: JwtDTO;
  primerLogueo: boolean;
}