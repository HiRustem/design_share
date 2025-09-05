import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IUser } from './types';

interface IUserState {
  user: null | IUser;
}

interface IUserActions {}

const defaultUserStore: IUserState = { user: null };

const useUserStore = () =>
  create<IUserState & IUserActions>()(
    immer((set, get) => ({
      ...defaultUserStore,
    })),
  );

export default useUserStore;
