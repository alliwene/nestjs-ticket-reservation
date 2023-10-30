import { Exclude } from 'class-transformer';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AbstractEntity } from '@app/common';
import { Role } from './role.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable()
  roles?: Role[];
}
