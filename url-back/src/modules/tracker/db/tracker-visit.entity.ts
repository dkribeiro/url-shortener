import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UrlEntity } from '../../url/db/url.entity';

@Entity('tracker_visits')
export class TrackerVisitEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'url_id' })
  url_id: number;

  @ManyToOne(() => UrlEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'url_id' })
  url: UrlEntity;

  @Column({ type: 'text', nullable: true })
  user_agent: string | null;

  @Column({ type: 'text', nullable: true })
  referrer: string | null;

  @Column({ type: 'varchar', length: 63, nullable: true })
  ip: string | null;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}