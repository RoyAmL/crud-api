import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;
    
    @IsString({each:true})         // El each: true ayuda a que cada uno de los elementos del arreglo cumplan la condición de ser string.
    @IsArray()
    sizes: string[];
    
    @IsString()
    @MinLength(1)
    title: string;
    
    @IsString()
    @IsOptional()
    description?: string;          // El ? es para que en typescript sea opcional y el @IsOptional es para la DB
    
    @IsNumber()                      // Es número porque sí puede recibir decimales
    @IsPositive()                    // No puede tener valores negativos
    @IsOptional()
    price?: number;
    
    @IsString()
    @IsOptional()
    slug?: string;
    
    @IsInt()                         // Es entero porque no puede recibir decimales
    @IsPositive()                    // No puede tener valores negativos
    @IsOptional()
    stock?: number;
    
    @IsString({each:true})         // El each: true ayuda a que cada uno de los elementos del arreglo cumplan la condición de ser string.
    @IsArray()
    @IsOptional()
    tags: string[];
}