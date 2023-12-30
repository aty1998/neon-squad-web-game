import { createContext, useEffect, useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { Mutex } from "async-mutex";
import { fetchUserAsync, setUserSettingsAsync } from "../api/userApi";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(null);
  
  const userMutex = new Mutex();

  // Fetch stored user else create new user
  useEffect(() => {
    userMutex.runExclusive(fetchUserAsync)
    //userMutex.runExclusive(async () => await fetchUserAsync(cookies))
      .then(setUser)
      .catch(err => {
        console.error(`Error creating new user: ${err}.`);
        setUserError(err);
      });
  }, []);
  useEffect(() => console.log(`User: ${JSON.stringify(user)}`), [user]);

  // Update user id separately
  useEffect(() => { user && user.id !== userId && setUserId(user.id); }, [user, userId]);
  
  // Function for setting user settings
  const setUserSettings = useCallback(settings => {
    if (!userId) return;
    userMutex.runExclusive(() => setUserSettingsAsync(userId, settings))
      .then(setUser)
      .catch(err => console.error(`Unable to set settings ${settings} for user id ${userId}: ${err}.`));
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, userId, userError, setUserSettings }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Provides a context containing a stateful user and functions to modify it. */
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { useUser, UserProvider };

