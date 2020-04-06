import { backendToStore } from '~/mappers/toStore';
import { nextStep } from '~/utils/application';
import { queryApiOrRedirect } from '~/utils/api';

export const state = () => ({});

export const getters = {
  nextApplicationStep: (state, getters) => {
    return (application => {
      if (!getters['identity/isFilled']) return 'identity';
      return nextStep(application);
    })
  }
};

export const mutations = {};

export const actions = {
  async nuxtServerInit({ commit }, context) {
    return await Promise.all(['identity', 'applications'].map(async storeName => {
      try {
        const jsonData = await queryApiOrRedirect(storeName, context);
        console.log('nuxtServerInit jsonData', jsonData)
        commit(`${storeName}/updateState`, (jsonData));
      } catch(jsonErr) {
        console.error('Loading data failed')
        console.error(jsonErr)
      }
    }))
  },
};
