// @mui
import Stack, { StackProps } from '@mui/material/Stack';

// @project
import SvgIcon from './SvgIcon';
import { IconType } from '@/enum';

interface Props extends StackProps {
  count?: number;
  rate?: number;
  starSize?: number;
}

/***************************  RATING  ***************************/

export default function Rating({ count = 5, rate, starSize = 20, ...rest }: Props) {
  return (
    <Stack direction="row" {...rest} sx={{ gap: 0.75, ...(rest.sx && { ...rest.sx }) }}>
      {Array.from({ length: count }, (_, index) => {
        const color = rate && index > rate - 1 ? 'primary.lighter' : 'primary.main';
        return <SvgIcon name="tabler-filled-star" size={starSize} key={index} type={IconType.FILL} color={color} />;
      })}
    </Stack>
  );
}
