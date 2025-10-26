import { Injectable, NotFoundException } from '@nestjs/common';
import { Challenge } from './challenge.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ChallengesService {
  private data: Challenge[] = [];

  list(): Challenge[] { return this.data; }
  get(id: string): Challenge {
    const c = this.data.find(x => x.id === id);
    if (!c) throw new NotFoundException('Challenge not found');
    return c;
  }
  create(input: Omit<Challenge,'id'>): Challenge {
    const c: Challenge = { id: randomUUID(), ...input };
    this.data.push(c);
    return c;
  }
  update(id: string, input: Omit<Challenge,'id'>): Challenge {
    const ix = this.data.findIndex(x => x.id === id);
    if (ix < 0) throw new NotFoundException('Challenge not found');
    const c: Challenge = { id, ...input };
    this.data[ix] = c;
    return c;
  }
  remove(id: string) {
    const ix = this.data.findIndex(x => x.id === id);
    if (ix < 0) throw new NotFoundException('Challenge not found');
    this.data.splice(ix,1);
    return { deleted: true };
  }
}
