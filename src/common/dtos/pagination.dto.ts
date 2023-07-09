import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()          // Con el @IsPositive ya no es necesario poner el @IsNumber
    @Type(()=>Number)      // Es igual que el enableImplicitConversion: true   , transforma el valor a número ya que sino se usa esto llega como string.
    limit?: number;

    @IsOptional()          // En la propiedad offset no se coloca @IsPositive porque nest al 0 no lo considera como positivo y sí puede empezar desde la posición 0.
    @Min(0)
    @Type(()=>Number)
    offset?: number;
}