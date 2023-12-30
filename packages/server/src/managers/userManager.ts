import User from '../types/user'

/** Bijective hash on 32-bit ints */
function hashInt32(x: number): number {
  let h = x | 0;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h = ((h >> 16) ^ h) * 0x45d9f3b;
  h ^= h >> 16;
  return h;
}

/** A simple in-process user manager. */
class UserManager {
  /** Number of digits in each user id, from [4..9]. */
  idLength: number;
  /** Maximum number of users. */
  maxCount: number;
  /** Number of users created. */
  count: number;
  /** Map from user id to User. */
  users: Map<string, User>;
  /** Internal seed for user id generator. */
  #seed: number;

  /**
   * Creates a new in-process UserManager.
   * @param idLength number of digits in each user id, from [4..9]
   * @param maxCount optional max user count. Defaults to 10^(idLength - 2)
   */
  constructor(idLength: number, maxCount?: number) {
    if (idLength < 4 || idLength > 9) {
      throw "UserManager id length must be in closed range [4..9].";
    }
    this.idLength = idLength;
    this.maxCount = maxCount ?? Math.pow(10, idLength - 2);
    this.count = 0;
    this.users = new Map();
    this.#seed = 0;
  }

  /**
   * Generates the next user id. Not necessarily unique.
   * @returns the next user id
   */
  #nextId(): string {
    let h = hashInt32(this.#seed);
    const id = [];
    for (let i = 0; i < this.idLength; i += 1) {
      id.push(`${h % 10}`);
      h = (h / 10) | 0;
    }
    this.#seed += 1;
    return id.join("");
  }

  /**
   * Creates a new User with a unique id and returns it.
   * @returns the newly created User
   */
  newUser(): User {
    if (this.count > this.maxCount) {
      throw `UserManager reached max user count of ${this.maxCount}.`;
    }

    // TODO: find a more scalable and robust id algorithm.
    // With small max user counts << 10^idLength, expect collisions to be rare.
    let id: string;
    do {
      id = this.#nextId();
    } while (this.users.has(id));

    const user = new User(id);
    this.users.set(id, user);
    this.count += 1;

    return user;
  }

  /**
   * Retrieves a User by id, or return undefined if the id does not exist.
   * Use the returned User reference to modify preferences.
   * @param id the user id to look up
   * @returns the User if found, else undefined
   */
  getUser(id: string): User | undefined {
    return this.users.get(id);
  }
}

const userManager = new UserManager(8);

export default userManager;
