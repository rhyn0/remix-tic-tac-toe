import { Link } from "@remix-run/react";
import { Hash } from "lucide-react";
import { cn } from "~/lib/utils";
import siteConfig from "~/config";
import { buttonVariants } from "./ui/button";
import { Icons } from "~/icons";
import { ThemePicker } from "./theme-picker";

export interface HeaderProps {
    className?: string;
}
export default function Header({ className }: HeaderProps) {
    return (
        <header className={cn("bg-secondary align-middle", className)}>
            <div className="container flex">
                <div className="flex space-x-8 md:justify-start">
                    <div>
                        <Link
                            to="/"
                            preventScrollReset={false}
                            className="flex items-center space-x-2"
                        >
                            <Hash />
                            Tic-Tac-Toe
                        </Link>
                    </div>
                    {/* <NavigationBar /> */}
                </div>
                <div className="flex flex-1 md:justify-end">
                    <nav className="flex items-center space-x-2">
                        <Link to={siteConfig.links.github}>
                            <div
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    "mb-1 w-9 px-0 align-middle",
                                )}
                            >
                                <Icons.github className="size-5" />
                                <span className="sr-only">GitHub</span>
                            </div>
                        </Link>
                        <ThemePicker />
                    </nav>
                </div>
            </div>
        </header>
    );
}
