import { TableFilters } from "@/components/Misc/AccessFilter";
import { CountryOption } from "@/types/country-option.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchState {
  countries: CountryOption[];
  filters: TableFilters;
}

const initialState: SearchState = {
  countries: [],
  filters: { countries: [], accessFilters: {} }
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSelectedCountries: (state, action: PayloadAction<CountryOption[]>) => {
      state.countries = action.payload;
      if (action.payload.length === 0) {
        state.filters = { countries: [], accessFilters: {} };
      }
    },
    setTableFilters: (state, action: PayloadAction<TableFilters>) => {
      state.filters = action.payload;
    }
  }
});

export const { setSelectedCountries, setTableFilters } = searchSlice.actions;

export default searchSlice.reducer;