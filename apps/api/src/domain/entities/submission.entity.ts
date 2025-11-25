import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Challenge } from './challenge.entity';

export type SubmissionStatus = 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'ACCEPTED' 
  | 'WRONG_ANSWER' 
  | 'TIME_LIMIT_EXCEEDED' 
  | 'RUNTIME_ERROR' 
  | 'COMPILATION_ERROR';

export type Language = 'python' | 'node' | 'cpp' | 'java';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('uuid')
  challengeId!: string;

  @ManyToOne(() => Challenge)
  @JoinColumn({ name: 'challengeId' })
  challenge!: Challenge;

  @Column('text')
  code!: string;

  @Column({ type: 'varchar', length: 20 })
  language!: Language;

  @Column({ type: 'varchar', length: 30, default: 'QUEUED' })
  status!: SubmissionStatus;

  @Column({ type: 'int', nullable: true })
  score!: number | null; // 0-100

  @Column({ type: 'int', nullable: true })
  timeMsTotal!: number | null; // Tiempo total en ms

  @Column({ type: 'int', nullable: true })
  memoryKbTotal!: number | null; // Memoria total en KB

  @Column('jsonb', { nullable: true })
  caseResults!: Array<{
    caseId: string;
    status: string;
    timeMs: number;
    memoryKb?: number;
    output?: string;
    error?: string;
  }> | null;

  @Column('text', { nullable: true })
  compilationError!: string | null;

  @Column('text', { nullable: true })
  runtimeError!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

