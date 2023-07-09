import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float', {       // Float porque puede tener decimales
        default: 0
    })
    price: number;

    @Column({                 // Se puede usar diferentes técnicas para especificar los types de datos
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    //Images


    // Las configuraciones before podrian en un solo métodos de la siguiente manera:
    // @BeforeInsert()
    // @BefortUpdate()
    // checkSlug()
    // Ya que contienen lo mismo, pero no lo hice así para dejar comentarios de lo que hace cada uno.

    @BeforeInsert()                    // Controlar que el slug cumpla con las características deseadas antes de ser insertado en la DB
    checkSlugInsert() {
        if(!this.slug) {               // Si no viene el slug va a ser igual al título
            this.slug=this.title;
        }
    

        this.slug=this.slug           // El slug se va a transformar con las características indicadas.
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if(!this.slug) {                  // Si se manda el slug vacio va a ser igual al título
            this.slug=this.title;
        }

        this.slug=this.slug               // Si se manda el slug se va a transformar con las características indicadas.
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }
}