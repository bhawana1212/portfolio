import { createDarkTheme, type BrandVariants } from '@fluentui/react-components';

const brand: BrandVariants = {
  10: '#161204', 20: '#29210a', 30: '#3e310e', 40: '#514013',
  50: '#655017', 60: '#7b611e', 70: '#927425', 80: '#aa8830',
  90: '#c39d3c', 100: '#d5b151', 110: '#e8c66a', 120: '#edd184',
  130: '#f1dc9f', 140: '#f6e7bc', 150: '#faf1d9', 160: '#fdf9ed',
};
export const theme = {
  ...createDarkTheme(brand),
  colorNeutralBackground1: '#141618',
  colorNeutralForeground1: '#f3f4f2',
  colorNeutralForeground2: '#b7bdba',
  colorNeutralStroke1: '#3c4241',
  colorBrandBackground: '#e8c66a',
  colorNeutralForegroundOnBrand: '#141618',
  colorCompoundBrandBackground: '#e8c66a',
  colorCompoundBrandBackgroundHover: '#edd184',
  fontFamilyBase: '"Source Sans 3 Variable", "Segoe UI", sans-serif',
};