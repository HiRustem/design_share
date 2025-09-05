import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import Cookies from 'js-cookie';

interface IAuthState {
  token: string | null;
}

interface IAuthActions {
  setAuth: (token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const defaultAuthState: IAuthState = {
  token: Cookies.get('authToken') || null,
};

const useAuthStore = create<IAuthState & IAuthActions>()(
  immer((set, get) => ({
    ...defaultAuthState,
    setAuth: (token) => {
      Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });

      set({ token });
    },
    logout: () => {
      Cookies.remove('authToken');

      set({ token: null });
    },
    isAuthenticated: () => !!get().token,
  })),
);

export default useAuthStore;
