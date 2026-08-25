import { Dispatch, SetStateAction } from 'react';

// @project
import { ThemeDirection, Themes } from '@/config';

export interface ConfigStates {
  currentTheme: Themes;
  themeDirection: ThemeDirection;
}

export type ConfigContextValue = {
  state: ConfigStates;
  setState: Dispatch<SetStateAction<ConfigStates>>;
  setField: (name: keyof ConfigStates, updateValue: ConfigStates[keyof ConfigStates]) => void;
  resetState: () => void;
};
