import Link from "next/link";
import {HousePlug} from "lucide-react";


export function LogoFullLink() {
    return (
        <Link href="/" className="flex items-center  font-semibold">
            <HousePlug className="h-6 w-6" />
            <span className="">DormNet</span>
        </Link>
    )
}