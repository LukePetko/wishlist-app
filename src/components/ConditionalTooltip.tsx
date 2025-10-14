import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type ConditionalTooltipProps = {
  content?: ReactNode;
  triggerClassName?: string;
};

const ConditionalTooltip: FC<PropsWithChildren<ConditionalTooltipProps>> = ({
  content,
  triggerClassName,
  children,
}) => {
  if (!content) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger className={triggerClassName}>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};

export default ConditionalTooltip;
