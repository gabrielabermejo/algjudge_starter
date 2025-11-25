import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TestCase } from './testcase.entity';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ChallengeState = 'draft' | 'published' | 'archived';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'varchar', length: 20 })
  difficulty!: Difficulty;

  @Column('simple-array')
  tags!: string[];

  @Column({ type: 'int' })
  timeLimit!: number; // ms

  @Column({ type: 'int' })
  memoryLimit!: number; // MB

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  state!: ChallengeState;

  @OneToMany(() => TestCase, (testCase) => testCase.challenge, { cascade: true })
  testCases!: TestCase[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

