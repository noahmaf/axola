const USER_STORAGE_KEY = "user_id";

export const localStorageService = {
  setUserId: (userId: string) => localStorage.setItem(USER_STORAGE_KEY, userId),
  getUserId: (): string | null => localStorage.getItem(USER_STORAGE_KEY),
  clearUserId: () => localStorage.removeItem(USER_STORAGE_KEY),
};
