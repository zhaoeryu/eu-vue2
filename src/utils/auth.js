import Cookies from 'js-cookie'
import { STORAGE_KEY_TOKEN } from './constants'

export function getToken() {
  return Cookies.get(STORAGE_KEY_TOKEN)
}

export function setToken(token) {
  return Cookies.set(STORAGE_KEY_TOKEN, token, { expires: 180 })
}

export function removeToken() {
  return Cookies.remove(STORAGE_KEY_TOKEN)
}
