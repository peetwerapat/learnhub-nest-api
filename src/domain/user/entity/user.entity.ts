import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Content } from 'src/domain/content/entity/content.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @OneToMany(() => Content, (content) => content.user)
  contents: Content[];
}
