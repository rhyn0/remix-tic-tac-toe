import React from "react";
import { cn } from "~/lib/utils";
import { TicTacToeValue } from "~/types";
import { X, Circle } from "lucide-react";

export interface SquareProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: TicTacToeValue;
}

const Square = React.forwardRef<HTMLButtonElement, SquareProps>(
    ({ value, className, ...rest }, ref) => {
        const internalValue = !value ? "" : value === "o" ? <Circle /> : <X />;
        return (
            <button
                ref={ref}
                className={cn(
                    "border border-solid border-black size-10 p-0 px-2 leading-8 font-bold text-lg float-left text-center",
                    className,
                )}
                {...rest}
            >
                {internalValue}
            </button>
        );
    },
);

Square.displayName = "Square";

export default Square;
