import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/module/user/entity/user.entity';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoTitle: string;

  @Column()
  videoUrl: string;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @Column()
  thumbnailUrl: string;

  @Column()
  creatorName: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
