import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,  
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface props {
    children: React.ReactNode;
    content: string;
    classNames?: string;
    expanded?: boolean ;
}

const ToolTip : React.FC<props> = ({ children, content, classNames, expanded }) => {
  return <>
    {expanded === false ? (
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {children}
              </TooltipTrigger>
              <TooltipContent className={classNames}>
                <p>{content}</p>
              </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <div>
             {children}
        </div>
    )}
    </>
}

export default ToolTip
