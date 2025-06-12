'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
    LayoutDashboard, 
    Package, 
    FileText, 
    FileOutput, 
    BarChart3,
    Settings,
    Building
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Materials', href: '/materials', icon: Package },
    { name: 'GRN', href: '/grn', icon: FileText },
    { name: 'Issues', href: '/issues', icon: FileOutput },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 bg-white shadow-lg border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <Building className="h-8 w-8 text-primary-600" />
                        <span className="text-xl font-bold text-gray-900">StockWise</span>
                    </div>
                </div>
                <nav className="mt-6 px-3">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors
                                    ${isActive 
                                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                                `}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Mobile/Tablet Bottom Navbar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow md:hidden">
                <nav className="flex justify-between px-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors
                                    ${isActive 
                                        ? 'text-primary-700' 
                                        : 'text-gray-600 hover:text-gray-900'
                                    }
                                `}
                            >
                                <item.icon className="h-5 w-5 mb-0.5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    )
}