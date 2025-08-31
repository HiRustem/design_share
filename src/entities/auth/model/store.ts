import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import Cookies from 'js-cookie';

type IUser = {
  id: number;
  email: string;
  name?: string;
};

type IAuthState = {
  token: string | null;
  user: IUser | null;
};

type IAuthActions = {
  setAuth: (token: string, user?: IUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

const defaultAuthState: IAuthState = {
  token: Cookies.get('authToken') || null,
  user: null,
};

const useAuthStore = create<IAuthState & IAuthActions>()(
  immer((set, get) => ({
    ...defaultAuthState,
    setAuth: (token, user) => {
      Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'Strict' });
      set((state) => {
        state.token = token;
        state.user = user || null;
      });
    },
    logout: () => {
      Cookies.remove('authToken');
      set((state) => {
        state.token = null;
        state.user = null;
      });
    },
    isAuthenticated: () => !!get().token,
  })),
);

export default useAuthStore;
