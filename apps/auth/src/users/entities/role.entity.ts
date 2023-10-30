import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  constructor(entity: Partial<Role>) {
    Object.assign(this, entity);
  }
}
