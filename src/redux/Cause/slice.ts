import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cause, InCreationCause } from './types';

export type CauseState = Readonly<{
  causes: { [id: string]: Cause };
  ids: string[];
  numberOfCauses: number | null;
  inCreationCause?: InCreationCause;
}>;

const initialState: CauseState = {
  causes: {},
  ids: [],
  numberOfCauses: null,
  inCreationCause: undefined,
};

const causeSlice = createSlice({
  name: 'Cause',
  initialState,
  reducers: {
    resetCauses: state => {
      state.ids = [];
    },
    updateCauses: (state, action: PayloadAction<{ causes: Cause[]; numberOfCauses: number }>) => {
      state.causes = action.payload.causes.reduce(
        (accumulator, cause) => ({
          ...accumulator,
          [cause.uuid]: cause,
        }),
        state.causes,
      );
      state.ids = [...new Set([...state.ids, ...action.payload.causes.map(cause => cause.uuid)])];
      state.numberOfCauses = action.payload.numberOfCauses;
    },
    updateOneCause: (state, action: PayloadAction<Cause>) => {
      state.causes[action.payload.uuid] = {
        ...action.payload,
        followers_count:
          state.causes[action.payload.uuid]?.followers_count !== undefined
            ? Math.max(
                state.causes[action.payload.uuid].followers_count,
                action.payload.followers_count,
              )
            : action.payload.followers_count,
      };
      if (!state.ids.includes(action.payload.uuid)) {
        state.ids = [...state.ids, action.payload.uuid];
      }
    },
    optimisticallyMarkCauseAsSupported: (state, action: PayloadAction<string>) => {
      state.causes[action.payload].supported = true;
      state.causes[action.payload].followers_count =
        state.causes[action.payload].followers_count + 1;
    },
    optimisticallyIncrementCauseFollower: (state, action: PayloadAction<string>) => {
      state.causes[action.payload].followers_count =
        state.causes[action.payload].followers_count + 1;
    },
    optimisticallyRemoveSupport: (state, action: PayloadAction<string>) => {
      state.causes[action.payload].supported = false;
      state.causes[action.payload].followers_count = Math.max(
        state.causes[action.payload].followers_count - 1,
        0,
      );
    },
    markCausesAsSupported: (state, action: PayloadAction<string[]>) => {
      state.causes = action.payload.reduce(
        (causes, supportedCauseId) => {
          causes[supportedCauseId].supported = true;
          return causes;
        },
        { ...state.causes },
      );
    },
    updateInCreationCause: (state, action: PayloadAction<InCreationCause>) => {
      state.inCreationCause = action.payload;
    },
    cleanInCreationCause: state => {
      state.inCreationCause = initialState.inCreationCause;
    },
  },
});

export const {
  resetCauses,
  updateCauses,
  updateOneCause,
  markCausesAsSupported,
  optimisticallyMarkCauseAsSupported,
  optimisticallyIncrementCauseFollower,
  optimisticallyRemoveSupport,
  updateInCreationCause,
  cleanInCreationCause,
} = causeSlice.actions;
export default causeSlice.reducer;
