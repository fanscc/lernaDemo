import Cookies from "js-cookie";
import Config from "@/config";

const TokenKey = Config.TokenKey;

export function getToken(str) {
  const TokenKeyStr = str || TokenKey;
  return Cookies.get(TokenKeyStr);
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires });
  } else return Cookies.set(TokenKey, token);
}

export function setVideToken(TokenKeyStr, token, expiresData) {
  return Cookies.set(TokenKeyStr, token, { expires: expiresData });
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
