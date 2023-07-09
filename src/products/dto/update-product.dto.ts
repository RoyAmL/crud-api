import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// El PartialType extiende todas las configuraciones que tiene el CreateProductDto y las hace opcionales, si no se quiere esas configuraciones
// se puede eliminar el extends PartialType(CreateProductDto) y definir por nuestra cuenta las propieaades de este dto.
export class UpdateProductDto extends PartialType(CreateProductDto) {}