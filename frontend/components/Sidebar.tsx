'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    LayoutDashboard, 
    Package, 
    FileText, 
    FileOutput, 
    BarChart3,
    Building
} from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Materials', href: '/materials', icon: Package },
    { name: 'GRN', href: '/grn', icon: FileText },
    { name: 'Issues', href: '/issues', icon: FileOutput },
    { name: 'Reports', href: '/reports', icon: BarChart3 }
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div
            className="
                fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex flex-row 
                md:top-0 md:left-0 md:w-64 md:h-screen md:flex-col md:border-t-0 md:border-r
                shadow-lg z-30
            "
        >
            <div className="hidden md:flex items-center p-6 border-b border-gray-200">
                <Building className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900 ml-2">StockWise</span>
            </div>
            <nav
                className="
                    flex flex-1 flex-row justify-around items-center
                    md:flex-col md:items-stretch md:justify-start md:mt-6 md:px-3 
                "
            >
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex flex-col items-center justify-center px-2 py-2 rounded-lg text-xs font-medium transition-colors
                                ${isActive 
                                    ? 'bg-primary-50 text-primary-700 md:border-r-2 md:border-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
                                md:flex-row md:justify-start md:items-center md:px-3 md:py-2 md:mb-1 md:text-sm
                            `}
                        >
                            <item.icon className="h-5 w-5 mb-1 md:mb-0 md:mr-3" />
                            <span className=" md:inline hidden ">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
