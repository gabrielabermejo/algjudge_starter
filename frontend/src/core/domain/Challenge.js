
export class Challenge {
  constructor({
    id,
    title,
    description,
    difficulty,
    tags,
    timeLimit,
    memoryLimit,
    state,
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;
    this.tags = tags || [];
    this.timeLimit = timeLimit;
    this.memoryLimit = memoryLimit;
    this.state = state;
  }
}
