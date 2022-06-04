import UserSettings from "./userSettings";

class User {
  id: string;
  settings: UserSettings;

  constructor(id: string, settings?: UserSettings) {
    if (!id) {
      throw "User id must be non-empty and defined."
    }
    this.id = id;
    this.settings = settings ?? this.#getDefaultSettings();
  }

  #getDefaultSettings(): UserSettings {
    return { name: `user${this.id}`};
  }
}

export default User;
