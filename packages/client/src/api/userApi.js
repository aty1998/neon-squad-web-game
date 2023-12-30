import Cookies from "universal-cookie";
import { handleFetchStatus } from "./common";

const userCookieName = "neonSquadUserId";
const userCookieMaxAge = 30 * 86400;
const cookies = new Cookies();

async function createUserAsync() {
  return fetch("/user/new")
    .then(handleFetchStatus)
    .then(res => res.json())
    .then(res => {
      cookies.set(userCookieName, res.id, { sameSite: "lax", maxAge: userCookieMaxAge });
      return res;
    });    
}

async function getUserAsync(userId) {
  return fetch(`/user/get?${new URLSearchParams({ id: userId })}`)
    .then(handleFetchStatus)
    .then(res => res.json());
}

async function fetchUserAsync() {
  const storedUserId = cookies.get(userCookieName);
  if (storedUserId) {
    return getUserAsync(storedUserId)
      .catch(err => {
        console.error(err)
        console.warn(`Unable to retrieve user with stored id ${storedUserId}. Creating a new user.`);
        return createUserAsync(cookies);
      });
  } else {
    return createUserAsync(cookies);
  }
}

async function setUserSettingsAsync(userId, settings) {
  const params = new URLSearchParams({ id: userId, ...settings });
  return fetch(`/user/settings?${params}`, { method: "PUT" })
    .then(handleFetchStatus)
    .then(res => res.json());
}

export { createUserAsync, fetchUserAsync, setUserSettingsAsync };
