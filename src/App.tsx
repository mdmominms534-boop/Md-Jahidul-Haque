import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  Users,
  FileText,
  Image as ImageIcon,
  Settings,
  Bell,
  Menu,
  X,
  Search,
  ChevronRight,
  TrendingUp,
  Camera,
  DollarSign
} from 'lucide-react';

// --- Types ---
type NavItem = {
  name: string;
  icon: React.ElementType;
  isActive?: boolean;
};

// --- Constants ---
const NAVIGATION: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, isActive: true },
  { name: 'Calendar', icon: Calendar },
  { name: 'Bookings', icon: BookOpen },
  { name: 'Clients', icon: Users },
  { name: 'Invoices', icon: FileText },
  { name: 'Magic Gallery', icon: ImageIcon },
  { name: 'Settings', icon: Settings },
];

// --- Components ---

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-black text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span>Lens<span className="text-red-500">CRM</span></span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href="#"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                  item.isActive 
                    ? 'bg-red-600 text-white font-medium' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Bottom Area (e.g., Logout or Help) */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Storage Used</p>
              <div className="w-full bg-black rounded-full h-1.5 mb-1">
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-300 font-medium text-right">65% / 1TB</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search Bar */}
        <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-red-500 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search clients, bookings..." 
            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button className="relative p-2 text-gray-400 hover:text-black transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-none">Alex Studio</p>
            <p className="text-xs text-gray-500 mt-1">Pro Plan</p>
          </div>
          <img 
            src="https://picsum.photos/seed/photographer/100/100" 
            alt="User Avatar" 
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
        </button>
      </div>
    </header>
  );
};

const StatCard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className="p-3 bg-gray-50 rounded-xl">
        <Icon className="w-6 h-6 text-black" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`font-medium flex items-center ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
        {trendUp ? '+' : '-'}{trend}%
      </span>
      <span className="text-gray-400 ml-2">vs last month</span>
    </div>
  </div>
);

const DashboardContent = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="bg-black rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Welcome back, Alex.
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              You have 3 upcoming shoots this weekend and 2 pending gallery deliveries. Let's make some magic happen.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                New Booking <ChevronRight className="w-4 h-4" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-white/10">
                View Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Clients" 
            value="1,248" 
            trend="12.5" 
            icon={Users} 
            trendUp={true} 
          />
          <StatCard 
            title="Pending Deliveries" 
            value="14" 
            trend="4.2" 
            icon={ImageIcon} 
            trendUp={false} 
          />
          <StatCard 
            title="Monthly Revenue" 
            value="$24,500" 
            trend="8.1" 
            icon={DollarSign} 
            trendUp={true} 
          />
        </div>

        {/* Placeholder for future content (e.g., Recent Activity, Upcoming Shoots) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Upcoming Shoots</h2>
              <button className="text-sm text-red-600 font-medium hover:text-red-700">View All</button>
            </div>
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              <Calendar className="w-8 h-8 mb-3 text-gray-300" />
              <p>No upcoming shoots this week.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contract Signed</p>
                    <p className="text-sm text-gray-500 mt-0.5">Sarah & John Wedding</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar toggleSidebar={toggleSidebar} />
        <DashboardContent />
      </div>
    </div>
  );
}
