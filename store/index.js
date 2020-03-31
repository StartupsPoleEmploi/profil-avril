import { backendToStore } from '~/mappers/toStore';
import { hasDelegate, hasBooklet } from '~/utils/application';
import { apiPath, fetchOrRedirectToSignIn } from '~/utils/api';

export const state = () => ({});

export const getters = {
  nextApplicationStep: (state, getters) => {
    return (application => {
      if (!getters['profile/isFilled']) return 'profile';
      if (!hasDelegate(application)) return 'delegate';
      if (!hasBooklet(application)) return 'booklet';
      return 'uploads';
    })
  }
};

export const mutations = {};

export const actions = {
  async nuxtServerInit({ commit, dispatch }, context) {
    await Promise.all(['profile', 'applications'].map(async storeName => {
      const jsonData = await fetchOrRedirectToSignIn(storeName, context)
      if (jsonData) {
        commit(`${storeName}/updateState`, backendToStore[storeName](jsonData));
      } else {
        console.error('Loading data failed')
        console.error(jsonData)
      }
    }))
  },
};
