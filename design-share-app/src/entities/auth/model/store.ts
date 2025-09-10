import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import Cookies from 'js-cookie';
import { IAuthState, IAuthActions, IUser } from './types';

const defaultAuthState: IAuthState = {
  token: Cookies.get('authToken') || null,
  user: null,
  isAuthenticated: false,
};

const useAuthStore = create<IAuthState & IAuthActions>()(
  immer((set, get) => ({
    ...defaultAuthState,
    setAuth: (token: string, user: IUser) => {
      Cookies.set('authToken', token, { 
        expires: 7, // 7 дней
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict' 
      });

      set({ 
        token, 
        user, 
        isAuthenticated: true 
      });
    },
    logout: () => {
      Cookies.remove('authToken');
      set({ 
        token: null, 
        user: null, 
        isAuthenticated: false 
      });
    },
    updateUser: (userData: Partial<IUser>) => {
      const currentUser = get().user;
      if (currentUser) {
        set({ 
          user: { ...currentUser, ...userData } 
        });
      }
    },
  })),
);

export default useAuthStore;