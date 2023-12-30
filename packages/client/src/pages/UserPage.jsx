import { useState } from "react";
import { useUser } from "../hooks/userHook";

function UserPage() {
  const { user, userError, setUserSettings } = useUser();
  const [newName, setNewName] = useState("");

  return (
    <div className="UserPage">
      <p>User ID: {user?.id}</p>
      <p>User Name: {user?.settings?.name}</p>
      <p>Error: {JSON.stringify(userError)}</p>
      <input 
        value={newName}
        placeholder="Enter a new name"
        onKeyUp={e => {
          if (e.key === "Enter") {
            setUserSettings({ name: newName });
            setNewName("");
          }
        }}
        onInput={e => setNewName(e.target.value)}
      />
    </div>
  );
}

export default UserPage;
