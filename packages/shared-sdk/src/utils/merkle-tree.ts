import * as crypto from 'crypto';

export interface MerkleProof {
  position: 'left' | 'right';
  sibling: string;
}

export class MerkleTree {
  private leaves: string[];
  private levels: string[][];
  private root: string;

  constructor(leaves: string[] = []) {
    this.leaves = leaves.map(l => this.hashLeaf(l));
    this.levels = [];
    this.root = '';
    if (this.leaves.length > 0) {
      this.buildTree();
    }
  }

  private hashLeaf(leaf: string): string {
    return crypto.createHash('sha256').update(leaf).digest('hex');
  }

  private hashPair(left: string, right: string): string {
    return crypto.createHash('sha256').update(left + right).digest('hex');
  }

  private buildTree(): void {
    this.levels = [this.leaves];
    let currentLevel = this.leaves;

    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]!;
        const right = currentLevel[i + 1] ?? left;
        nextLevel.push(this.hashPair(left, right));
      }
      this.levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    this.root = currentLevel[0] ?? '';
  }

  getRoot(): string {
    return this.root;
  }

  getLevels(): string[][] {
    return this.levels;
  }

  getProof(leaf: string): MerkleProof[] {
    const hashedLeaf = this.hashLeaf(leaf);
    const leafIndex = this.leaves.indexOf(hashedLeaf);

    if (leafIndex === -1) {
      throw new Error('Leaf not found in tree');
    }

    const proof: MerkleProof[] = [];
    let index = leafIndex;

    for (let level = 0; level < this.levels.length - 1; level++) {
      const currentLevel = this.levels[level]!;
      const isRight = index % 2 === 1;
      const siblingIndex = isRight ? index - 1 : index + 1;

      if (siblingIndex < currentLevel.length) {
        proof.push({
          position: isRight ? 'right' : 'left',
          sibling: currentLevel[siblingIndex]!,
        });
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  addLeaf(leaf: string): void {
    const hashedLeaf = this.hashLeaf(leaf);
    this.leaves.push(hashedLeaf);
    this.buildTree();
  }

  static verifyProof(root: string, leaf: string, proof: MerkleProof[]): boolean {
    const hashedLeaf = crypto.createHash('sha256').update(leaf).digest('hex');
    let current = hashedLeaf;

    for (const p of proof) {
      current =
        p.position === 'left'
          ? crypto.createHash('sha256').update(p.sibling + current).digest('hex')
          : crypto.createHash('sha256').update(current + p.sibling).digest('hex');
    }

    return current === root;
  }
}