import UserSettings from "./userSettings";

class User {
  id: string;
  settings: Record<string, any>;

  constructor(id: string, settings?: Record<string, any>) {
    if (!id) {
      throw "User id must be non-empty and defined."
    }
    this.id = id;
    this.settings = settings ?? this.#getDefaultSettings();
  }

  #getDefaultSettings(): Record<string, any> {
    return { name: `user${this.id}`};
  }
}

export default User;
