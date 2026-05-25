import type { ChildNote, User } from "@prisma/client";
import { RewardRepository } from "../repositories/reward-repository";

type Actor = Pick<User, "id" | "roleHint">;

export class ChildNoteService {
  constructor(private readonly repository = new RewardRepository()) {}

  async listVisibleNotes(actor: Actor, childId: string): Promise<ChildNote[]> {
    if (actor.roleHint !== "child" || actor.id !== childId) {
      return [];
    }

    return this.repository.getChildPrivateNotes(childId);
  }
}
