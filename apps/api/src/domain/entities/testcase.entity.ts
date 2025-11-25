import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  challengeId!: string;

  @ManyToOne(() => Challenge, (challenge) => challenge.testCases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'challengeId' })
  challenge!: Challenge;

  @Column('text')
  input!: string;

  @Column('text')
  expectedOutput!: string;

  @Column({ type: 'boolean', default: false })
  isHidden!: boolean; // Para casos ocultos en competencias
}

