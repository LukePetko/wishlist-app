import type { FC, ReactNode } from 'react';
import { useMd } from '@/hooks/useMd';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

type ResponsiveTooltipProps = {
  content: ReactNode;
  trigger: ReactNode;
  mobileContentClassName?: string;
};

const ResponsiveTooltip: FC<ResponsiveTooltipProps> = ({
  content,
  trigger,
  mobileContentClassName,
}) => {
  const isMd = useMd();

  if (!isMd) {
    return (
      <Popover>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent
          className={cn('w-[calc(100vw-8px)] m-1', mobileContentClassName)}
        >
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default ResponsiveTooltip;
