import Link from "next/link";

export default function MainHeader() {
    return (
        <header className="flex items-center justify-between px-6 md:px-10 py-5">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-lg font-bold tracking-wide text-[#3a352c]">
                    Bolzano Crafts
                </Link>
                <nav className="hidden md:flex gap-6 text-sm text-[#3a352c]/80">
                    <Link href="/" className="hover:text-[#3a352c] transition-colors">
                        Home
                    </Link>
                    <Link href="#" className="hover:text-[#3a352c] transition-colors">
                        Updates
                    </Link>
                </nav>
            </div>

            <nav className="flex gap-6 text-sm text-[#3a352c]/80">
                <Link href="#" className="hover:text-[#3a352c] transition-colors">
                    About
                </Link>
                <Link href="#" className="hover:text-[#3a352c] transition-colors">
                    Contact
                </Link>
                <Link href="#" className="hover:text-[#3a352c] transition-colors">
                    Help
                </Link>
            </nav>
        </header>
    );
}