import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('urls')
export class UrlEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'varchar', length: 63, nullable: true })
  @Index({ unique: true })
  slug: string | null;

  @Column({ type: 'varchar', length: 63, nullable: true })
  user_id: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
