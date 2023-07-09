import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');                // El logger ayuda a visualizar mejor los errores

  constructor(
    @InjectRepository(Product)                                           // Patron repositorio.  Product es la entidad
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.productRepository.create(createProductDto);   // Crea el producto en la base pero no lo graba
      await this.productRepository.save(product);                              // Guarda o impacta el producto en la base de datos
      return product;
    } catch (error) {
      this.handleDBExceptions(error);                                    // Llamada al método del final que controla los errores
    }
  }

  findAll(paginationDto: PaginationDto) {                               // Se llama a la clase PaginationDto que está en la carpeta common.
    const {limit=10, offset=0} = paginationDto;                         // Destructurar el paginationDto, al tener características opcionales pueden venir o no y si no viene van a tener valores por defecto, el limit es la cantidad que va a venir y el offset desde donde va a empezar.
    return this.productRepository.find({                                // Obtener todos los productos
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(term: string) {                                        // El term puede ser un UUID o slug por eso se cambia el number por string
    let product: Product;
    if(isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});    // Obtener producto por uuid
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();  // Obtener producto por slug o title, con este queryBuilder nos protegemos de las inyecciones SQL.
      	product = await queryBuilder.where('UPPER(title)=:title or slug=:slug', {  // El UPPER(title) junto con el term.toUpperCase() ayuda a que se pueda mandar en minusculas o mayusculas el titulo en la busqueda, osea a que la DB no sea case sensitive.
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne();                                                     // Puede ser que regrese 2, como solo quiero 1 me aseguro de eso con el getOne().
    }

    if(!product)                                                          // Controlar (mediante el id) que el producto exista
      throw new NotFoundException(`Product with id ${term} not found`);   // Mensaje de error si no existe el producto
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({                // El preload le dice a TypeORM que busque un producto por el id y adicionalmente cargue todas las propiedades que esten en el updateProductDto, que pueden ser todas o ninguna ya que son opcionales, esto no actualiza, solo prepara para la actualización.
      id: id,
      ...updateProductDto
    });
    if(!product) throw new NotFoundException(`Product with id ${id} not found`);   // Si el producto no existe lanza un error.
    try {
      await this.productRepository.save(product);                                  // Si el producto existe guarda la actualización de los datos.
      return product;      
    } catch (error) {
      this.handleDBExceptions(error);                                              // Llamada al método del final que controla los errores
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);         // Validar mediante el id si el producto existe gracias al metodo findOne creado anteriormente, si existe se guarda en la variable product.
    await this.productRepository.remove(product);   // Eliminar el producto
  }

  private handleDBExceptions(error: any) {                                               // Controlar errores al interactuar con la DB, y se puede controlar todos los errores que sean necesarios con el else.
    if(error.code==='23505')                                                             // Código de error de llave duplicada se lo puede ver con un console.log(error)
      throw new BadRequestException(error.detail)                                        // Da más detalles del error
    this.logger.error(error)                                                             // Visualizar los errores de mejor manera en la consola
    throw new InternalServerErrorException('Unexpected error, check server logs');       // Esto es lo que ve el usuario
  }

}