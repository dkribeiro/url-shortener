import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UrlEntity } from '../../url/db/url.entity';

@Entity('tracker_counters')
export class TrackerCounterEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'url_id' })
  url_id: number;

  @ManyToOne(() => UrlEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'url_id' })
  url: UrlEntity;

  @Column({ type: 'bigint', default: 0 })
  counter: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}