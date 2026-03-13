import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
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
  Camera,
  DollarSign,
  Mail,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  Trash2,
  Plus,
  Save,
  Phone,
  MapPin,
  Map as MapIcon,
  Tag,
  Package,
  CheckCircle,
  Clock,
  Copy,
  Link,
  Folder,
  CreditCard,
  Printer,
  LogOut,
  Filter,
  Pencil
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit
} from 'firebase/firestore';

// --- Firebase Setup ---
const firebaseConfig = {
  apiKey: "AIzaSyBHMXTI3VAMbFXZq2TWNFeX0lXleNXAhA4",
  authDomain: "lenscrm1122.firebaseapp.com",
  projectId: "lenscrm1122",
  storageBucket: "lenscrm1122.firebasestorage.app",
  messagingSenderId: "339621927858",
  appId: "1:339621927858:web:a32cd05e1a42cb379f22ab",
  measurementId: "G-9P3421966P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Types ---
interface BrandSettings {
  brandColor: string;
  logoUrl: string;
  agencyName: string;
}

const defaultBrandSettings: BrandSettings = {
  brandColor: '#dc2626', // default red-600
  logoUrl: '',
  agencyName: 'LensCRM'
};

interface BrandContextType {
  settings: BrandSettings;
  setSettings: React.Dispatch<React.SetStateAction<BrandSettings>>;
}

export const BrandContext = React.createContext<BrandContextType>({
  settings: defaultBrandSettings,
  setSettings: () => {}
});

type NavItem = {
  name: string;
  icon: React.ElementType;
};

// --- Constants ---
const NAVIGATION: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Calendar', icon: Calendar },
  { name: 'Leads', icon: Filter },
  { name: 'Bookings', icon: BookOpen },
  { name: 'Clients', icon: Users },
  { name: 'Invoices', icon: FileText },
  { name: 'Magic Gallery', icon: ImageIcon },
  { name: 'Settings', icon: Settings },
];

// --- Auth Component ---

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    agencyName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        // Here you would typically also save the fullName and agencyName to Firestore
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left Side - Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://picsum.photos/seed/wedding-cinematography/1920/1080?grayscale" 
          alt="Wedding Cinematography" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-20 flex flex-col justify-between p-12 h-full text-white">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span>Lens<span className="text-red-500">CRM</span></span>
          </div>
          
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Capture moments. <br/>
              <span className="text-red-500">We'll handle the business.</span>
            </h2>
            <p className="text-gray-300 text-lg">
              The all-in-one platform designed exclusively for premium wedding photographers and cinematographers.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2 font-bold text-2xl tracking-tight mb-12">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span>Lens<span className="text-red-500">CRM</span></span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-black mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-500">
              {isLogin 
                ? 'Enter your details to access your studio dashboard.' 
                : 'Start managing your wedding business like a pro.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                      placeholder="John Doe"
                      required={!isLogin}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Photography Agency Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                      placeholder="Lumiere Studios"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                  placeholder="you@studio.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Password</label>
                {isLogin && (
                  <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors mt-6 disabled:opacity-70"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Components ---

const Sidebar = ({ 
  isOpen, 
  toggleSidebar,
  activeTab,
  setActiveTab
}: { 
  isOpen: boolean; 
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const { settings } = React.useContext(BrandContext);

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
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.agencyName} className="h-8 max-w-[150px] object-contain" />
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: settings.brandColor }}>
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <span>{settings.agencyName === 'LensCRM' ? <>Lens<span style={{ color: settings.brandColor }}>CRM</span></> : settings.agencyName}</span>
                </>
              )}
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {NAVIGATION.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive 
                      ? 'text-white font-medium' 
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                  style={isActive ? { backgroundColor: settings.brandColor } : {}}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* Bottom Area (e.g., Logout or Help) */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Storage Used</p>
              <div className="w-full bg-black rounded-full h-1.5 mb-1">
                <div className="h-1.5 rounded-full" style={{ width: '65%', backgroundColor: settings.brandColor }}></div>
              </div>
              <p className="text-xs text-gray-300 font-medium text-right">65% / 1TB</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const Topbar = ({ toggleSidebar, onLogout }: { toggleSidebar: () => void, onLogout: () => void }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-none">{auth.currentUser?.displayName || 'Alex Studio'}</p>
              <p className="text-xs text-gray-500 mt-1">Pro Plan</p>
            </div>
            <img 
              src="https://picsum.photos/seed/photographer/100/100" 
              alt="User Avatar" 
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <button 
                onClick={onLogout} 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
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
  const [revenue, setRevenue] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [upcomingShoots, setUpcomingShoots] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const timeAgo = (dateValue: any) => {
    if (!dateValue) return 'Unknown';
    // Handle Firestore Timestamp or ISO string
    const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return 'Just now';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth.currentUser) return;
      setLoading(true);
      try {
        const uid = auth.currentUser.uid;
        
        // Fetch Bookings
        const bookingsQ = query(collection(db, 'bookings'), where('userId', '==', uid));
        const bookingsSnap = await getDocs(bookingsQ);
        
        let totalRev = 0;
        const uniqueClients = new Set();
        const allBookings: any[] = [];
        
        bookingsSnap.forEach(doc => {
          const data = doc.data();
          allBookings.push({ id: doc.id, ...data });
          
          totalRev += parseFloat(data.totalAmount) || 0;
          if (data.phone || data.fullName) {
            uniqueClients.add(data.phone || data.fullName);
          }
        });
        
        setRevenue(totalRev);
        
        // Fetch Clients
        const clientsQ = query(collection(db, 'clients'), where('userId', '==', uid));
        const clientsSnap = await getDocs(clientsQ);
        clientsSnap.forEach(doc => {
          const data = doc.data();
          if (data.phone || data.fullName) {
            uniqueClients.add(data.phone || data.fullName);
          }
        });
        
        setTotalClients(uniqueClients.size);
        
        // Upcoming Shoots
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const upcoming = allBookings
          .filter(b => b.eventDate && new Date(b.eventDate) >= today)
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
          .slice(0, 3);
          
        setUpcomingShoots(upcoming);
        
        // Recent Activity
        try {
          const recentQ = query(
            collection(db, 'bookings'),
            where('userId', '==', uid),
            orderBy('createdAt', 'desc'),
            limit(3)
          );
          const recentSnap = await getDocs(recentQ);
          const recentData: any[] = [];
          recentSnap.forEach(doc => recentData.push({ id: doc.id, ...doc.data() }));
          setRecentActivity(recentData);
        } catch (indexError) {
          console.warn("Falling back to in-memory sort for recent activity due to missing index.", indexError);
          const sorted = [...allBookings]
            .filter(b => b.createdAt)
            .sort((a, b) => {
              const timeA = a.createdAt.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
              const timeB = b.createdAt.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
              return timeB - timeA;
            })
            .slice(0, 3);
          setRecentActivity(sorted);
        }
        
        // Pending Deliveries
        const galleriesQ = query(collection(db, 'galleries'), where('userId', '==', uid));
        const galleriesSnap = await getDocs(galleriesQ);
        let pendingCount = 0;
        galleriesSnap.forEach(doc => {
          const status = doc.data().status;
          if (status === 'Pending Selection' || status === 'Processing') {
            pendingCount++;
          }
        });
        setPendingDeliveries(pendingCount);
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
          <div className="bg-gray-200 rounded-3xl h-64 w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 h-32"></div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 h-32"></div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 h-32"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 h-96"></div>
            <div className="bg-white rounded-2xl border border-gray-100 h-96"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="bg-black rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Welcome back, {auth.currentUser?.displayName || 'Alex'}.
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              You have {upcomingShoots.length} upcoming shoots and {pendingDeliveries} pending gallery deliveries. Let's make some magic happen.
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
            value={totalClients.toLocaleString()} 
            trend="12.5" 
            icon={Users} 
            trendUp={true} 
          />
          <StatCard 
            title="Pending Deliveries" 
            value={pendingDeliveries.toString()} 
            trend="4.2" 
            icon={ImageIcon} 
            trendUp={false} 
          />
          <StatCard 
            title="Revenue" 
            value={`৳${revenue.toLocaleString()}`} 
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
            {upcomingShoots.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <Calendar className="w-8 h-8 mb-3 text-gray-300" />
                <p>No upcoming shoots scheduled.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingShoots.map(shoot => (
                  <div key={shoot.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0 text-red-600 font-bold">
                        {new Date(shoot.eventDate).getDate()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{shoot.fullName}</p>
                        <p className="text-sm text-gray-500">{shoot.eventType} • {shoot.venue || 'TBD'}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{new Date(shoot.eventDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">Upcoming</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            </div>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>No recent activity.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">New Booking Added</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.fullName} • {activity.eventType}</p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

const SettingsContent = () => {
  const [activeSettingTab, setActiveSettingTab] = useState('Event Types');

  const [eventTypes, setEventTypes] = useState([
    { id: '1', name: 'Holud' },
    { id: '2', name: 'Reception' },
    { id: '3', name: 'Engagement' },
    { id: '4', name: 'Post-Wedding' },
  ]);

  const [services, setServices] = useState([
    { id: '1', name: 'Drone Coverage', price: '15000' },
    { id: '2', name: 'Top Angle Video', price: '10000' },
    { id: '3', name: 'Premium Album Print', price: '25000' },
  ]);

  const [brand, setBrand] = useState({
    agencyName: 'Alex Studio',
    logoUrl: 'https://example.com/logo.png',
    brandColor: '#E53E3E',
  });

  const handleAddEventType = () => {
    setEventTypes([...eventTypes, { id: Date.now().toString(), name: '' }]);
  };

  const handleRemoveEventType = (id: string) => {
    setEventTypes(eventTypes.filter(et => et.id !== id));
  };

  const handleEventTypeChange = (id: string, value: string) => {
    setEventTypes(eventTypes.map(et => et.id === id ? { ...et, name: value } : et));
  };

  const handleAddService = () => {
    setServices([...services, { id: Date.now().toString(), name: '', price: '' }]);
  };

  const handleRemoveService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const handleServiceChange = (id: string, field: 'name' | 'price', value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleBrandChange = (field: string, value: string) => {
    setBrand({ ...brand, [field]: value });
  };

  const handleSaveChanges = () => {
    // Simulate save
    alert('Settings saved successfully!');
  };

  const tabs = ['Event Types', 'Services & Pricing', 'Brand Whitelabeling'];

  return (
    <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings & Customization</h1>
            <p className="text-gray-500 mt-1">Manage your studio preferences, services, and branding.</p>
          </div>
          <button 
            onClick={handleSaveChanges}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSettingTab(tab)}
                className={`flex-shrink-0 text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeSettingTab === tab 
                    ? 'bg-white text-red-600 shadow-sm border border-gray-200/60' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 p-6 md:p-8">
            
            {/* Event Types */}
            {activeSettingTab === 'Event Types' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Event Types</h2>
                  <p className="text-sm text-gray-500 mt-1">Define the types of events you cover. These will be available when creating new bookings.</p>
                </div>
                
                <div className="space-y-3">
                  {eventTypes.map((et) => (
                    <div key={et.id} className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={et.name}
                          onChange={(e) => handleEventTypeChange(et.id, e.target.value)}
                          placeholder="e.g., Holud, Reception"
                          className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveEventType(et.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddEventType}
                  className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Event Type
                </button>
              </div>
            )}

            {/* Services & Pricing */}
            {activeSettingTab === 'Services & Pricing' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Services & Pricing</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure your base packages and extra services with pricing in BDT.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3 px-1">
                    <div className="flex-[2] text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Name</div>
                    <div className="flex-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (BDT)</div>
                    <div className="w-10"></div>
                  </div>
                  
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-3">
                      <div className="flex-[2] relative">
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                          placeholder="e.g., Drone Coverage"
                          className="w-full pl-4 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium">৳</span>
                        </div>
                        <input
                          type="number"
                          value={service.price}
                          onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                          placeholder="0"
                          className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                        />
                      </div>
                      <button 
                        onClick={() => handleRemoveService(service.id)}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleAddService}
                  className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors py-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Extra Service
                </button>
              </div>
            )}

            {/* Brand Whitelabeling */}
            {activeSettingTab === 'Brand Whitelabeling' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Brand Whitelabeling</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize the CRM to match your studio's brand identity.</p>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Agency Name</label>
                    <input
                      type="text"
                      value={brand.agencyName}
                      onChange={(e) => handleBrandChange('agencyName', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                      placeholder="Your Studio Name"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Logo URL</label>
                    <input
                      type="url"
                      value={brand.logoUrl}
                      onChange={(e) => handleBrandChange('logoUrl', e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500">Provide a direct link to your logo image (PNG or SVG recommended).</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Brand Color</label>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-300 shrink-0">
                        <input
                          type="color"
                          value={brand.brandColor}
                          onChange={(e) => handleBrandChange('brandColor', e.target.value)}
                          className="absolute -inset-2 w-16 h-16 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={brand.brandColor}
                        onChange={(e) => handleBrandChange('brandColor', e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 uppercase font-mono"
                        placeholder="#000000"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
};

const LeadsContent = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    desiredEvent: '',
    estimatedBudget: ''
  });

  const COLUMNS = ['New Inquiry', 'Following Up', 'Negotiating', 'Lost'];

  const fetchLeads = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'leads'), where('userId', '==', auth.currentUser.uid));
      const snap = await getDocs(q);
      const leadsData: any[] = [];
      snap.forEach(doc => leadsData.push({ id: doc.id, ...doc.data() }));
      
      // Sort in memory to avoid index requirement
      leadsData.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
        return timeB - timeA; // desc
      });
      
      setLeads(leadsData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      // Optimistic update
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      await updateDoc(doc(db, 'leads', leadId), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error
      fetchLeads();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      const newLead = {
        ...formData,
        status: 'New Inquiry',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'leads'), newLead);
      setFormData({ clientName: '', phone: '', desiredEvent: '', estimatedBudget: '' });
      setIsModalOpen(false);
      fetchLeads();
    } catch (error) {
      console.error("Error adding lead:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleConvertToBooking = async (lead: any) => {
    if (!auth.currentUser) return;
    try {
      // Step A: Create client
      const newClient = {
        fullName: lead.clientName || '',
        phone: lead.phone || '',
        email: '',
        address: '',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'clients'), newClient);

      // Step B: Create booking
      const newBooking = {
        fullName: lead.clientName || '',
        phone: lead.phone || '',
        eventType: lead.desiredEvent || '',
        totalAmount: lead.estimatedBudget || 0,
        advancePaid: 0,
        dueAmount: lead.estimatedBudget || 0,
        status: 'Pending',
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, 'bookings'), newBooking);

      // Step C: Delete lead
      await deleteDoc(doc(db, 'leads', lead.id));

      // Update local state
      setLeads(leads.filter(l => l.id !== lead.id));

      alert('Successfully converted to Client and Booking!');
    } catch (error) {
      console.error("Error converting lead to booking:", error);
      alert('Failed to convert lead. Please try again.');
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads & Pipeline</h1>
            <p className="text-gray-500 mt-1">Track and manage your incoming inquiries.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Lead
          </button>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-6 h-full min-h-[500px]">
              {COLUMNS.map(column => {
                const columnLeads = leads.filter(l => l.status === column);
                return (
                  <div key={column} className="min-w-[320px] w-[320px] shrink-0 bg-gray-100/50 rounded-2xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{column}</h3>
                      <span className="bg-white text-gray-500 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        {columnLeads.length}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                      {columnLeads.map(lead => (
                        <div key={lead.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-gray-900">{lead.clientName}</h4>
                          <p className="text-sm text-gray-500 mt-1">{lead.phone}</p>
                          
                          <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-md">{lead.desiredEvent}</span>
                            {lead.estimatedBudget && (
                              <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md">৳{lead.estimatedBudget}</span>
                            )}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                            <select 
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className="w-full text-sm border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500 bg-gray-50"
                            >
                              {COLUMNS.map(col => (
                                <option key={col} value={col}>{col}</option>
                              ))}
                            </select>
                            
                            <button 
                              onClick={() => handleConvertToBooking(lead)}
                              className="w-full bg-black hover:bg-gray-800 text-white text-sm py-2 rounded-lg font-medium transition-colors"
                            >
                              Convert to Booking
                            </button>
                          </div>
                        </div>
                      ))}
                      {columnLeads.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                          No leads
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                  className="w-full border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500"
                  placeholder="+880 1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desired Event</label>
                <input 
                  type="text" 
                  required
                  value={formData.desiredEvent}
                  onChange={(e) => setFormData({...formData, desiredEvent: e.target.value})}
                  className="w-full border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Holud, Wedding"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget (BDT)</label>
                <input 
                  type="number" 
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({...formData, estimatedBudget: e.target.value})}
                  className="w-full border-gray-300 rounded-xl focus:ring-red-500 focus:border-red-500"
                  placeholder="50000"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

const BookingsContent = () => {
  const { settings } = React.useContext(BrandContext);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    eventDate: '',
    venue: '',
    eventType: 'Holud',
    package: 'Combo',
    totalAmount: '',
    advancePaid: ''
  });

  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by eventDate descending
      bookingsData.sort((a: any, b: any) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
      setRecentBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (booking: any) => {
    setFormData({
      fullName: booking.fullName || '',
      phone: booking.phone || '',
      email: booking.email || '',
      address: booking.address || '',
      eventDate: booking.eventDate || '',
      venue: booking.venue || '',
      eventType: booking.eventType || 'Holud',
      package: booking.package || 'Combo',
      totalAmount: booking.totalAmount || '',
      advancePaid: booking.advancePaid || ''
    });
    setEditingBookingId(booking.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        setRecentBookings(recentBookings.filter(b => b.id !== bookingId));
      } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking.");
      }
    }
  };

  const total = parseFloat(formData.totalAmount) || 0;
  const advance = parseFloat(formData.advancePaid) || 0;
  const dueAmount = Math.max(0, total - advance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      if (editingBookingId) {
        const updatedBooking = {
          ...formData,
          dueAmount,
          status: dueAmount <= 0 ? 'Delivered' : 'Pending',
        };
        await updateDoc(doc(db, 'bookings', editingBookingId), updatedBooking);
      } else {
        const newBooking = {
          ...formData,
          dueAmount,
          status: dueAmount <= 0 ? 'Delivered' : 'Pending',
          userId: auth.currentUser.uid,
          createdAt: new Date().toISOString()
        };
        await addDoc(collection(db, 'bookings'), newBooking);
      }
      
      // Reset form
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        eventDate: '',
        venue: '',
        eventType: 'Holud',
        package: 'Combo',
        totalAmount: '',
        advancePaid: ''
      });
      setEditingBookingId(null);
      
      // Refresh list
      fetchBookings();
      alert(editingBookingId ? 'Booking updated successfully!' : 'Booking saved successfully!');
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert('Failed to save booking. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings & Events</h1>
          <p className="text-gray-500 mt-1">Manage new client bookings and track upcoming events.</p>
        </div>

        {/* New Booking Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" />
              {editingBookingId ? 'Edit Booking' : 'New Booking Form'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Client Info */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Client Information</h3>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Client Name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="+880 1..." />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="email@example.com" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Full Address" />
                  </div>
                </div>
              </div>

              {/* Event Details & Financials */}
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Event & Package Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Event Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Venue Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Venue" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Event Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-4 w-4 text-gray-400" />
                      </div>
                      <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white">
                        <option value="Holud">Holud</option>
                        <option value="Reception">Reception</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Akdh">Akdh</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Selected Package</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <select name="package" value={formData.package} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white">
                        <option value="Standard Photography">Standard Photography</option>
                        <option value="Premium Cinematography">Premium Cinematography</option>
                        <option value="Combo">Combo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Total (BDT)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium text-sm">৳</span>
                      </div>
                      <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} required className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Advance (BDT)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium text-sm">৳</span>
                      </div>
                      <input type="number" name="advancePaid" value={formData.advancePaid} onChange={handleInputChange} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="0" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Due Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium text-sm">৳</span>
                      </div>
                      <input type="text" readOnly value={dueAmount} className="block w-full pl-8 pr-3 py-2 border border-gray-200 bg-gray-50 rounded-xl text-red-600 font-bold text-sm outline-none" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
              {editingBookingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      address: '',
                      eventDate: '',
                      venue: '',
                      eventType: 'Holud',
                      package: 'Combo',
                      totalAmount: '',
                      advancePaid: ''
                    });
                    setEditingBookingId(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button type="submit" disabled={saving} className="text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 hover:opacity-90" style={{ backgroundColor: settings.brandColor }}>
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Saving...' : (editingBookingId ? 'Save Changes' : 'Save Booking')}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
            <button className="text-sm text-red-600 font-medium hover:text-red-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                Loading bookings...
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No bookings found. Create your first booking above!
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Client Name</th>
                    <th className="px-6 py-4 font-semibold">Event Date</th>
                    <th className="px-6 py-4 font-semibold">Event Type</th>
                    <th className="px-6 py-4 font-semibold">Due Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{booking.fullName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {booking.eventType}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-medium text-sm ${booking.dueAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          ৳ {Number(booking.dueAmount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Delivered' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {booking.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black"
                            onClick={() => handleEdit(booking)}
                            title="Edit Booking"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDelete(booking.id)}
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

const MagicGalleryContent = () => {
  const { settings } = React.useContext(BrandContext);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [folderLink, setFolderLink] = useState('');

  const [galleries, setGalleries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchGalleries = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'galleries'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const galleriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by dateCreated descending
      galleriesData.sort((a: any, b: any) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      setGalleries(galleriesData);
    } catch (error) {
      console.error("Error fetching galleries: ", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!auth.currentUser) return;
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  useEffect(() => {
    fetchGalleries();
    fetchBookings();
  }, []);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !folderLink || !auth.currentUser) return;
    
    setSaving(true);
    try {
      const selectedBooking = bookings.find(b => b.id === selectedBookingId);
      const clientName = selectedBooking ? selectedBooking.fullName : 'Unknown Client';

      const newGallery = {
        bookingId: selectedBookingId,
        clientName: clientName,
        folderLink: folderLink,
        dateCreated: new Date().toISOString().split('T')[0],
        status: 'Pending Selection',
        selectedCount: 0,
        totalCount: 500, // Dummy total count
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'galleries'), newGallery);
      
      setSelectedBookingId('');
      setFolderLink('');
      fetchGalleries();
      alert('Client Selection Link Generated Successfully!');
    } catch (error) {
      console.error("Error saving gallery: ", error);
      alert('Failed to save gallery. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = (galleryId: string) => {
    const url = `${window.location.origin}/gallery/${galleryId}`;
    navigator.clipboard.writeText(url);
    alert('Client Link copied to clipboard!');
  };

  const handleCopyIds = (gallery: any) => {
    if (gallery.status !== 'Selected' || !gallery.selectedImageIds) return;
    const idsString = gallery.selectedImageIds.join(', ');
    navigator.clipboard.writeText(idsString);
    alert(`Copied ${gallery.selectedImageIds.length} selected photo IDs for ${gallery.clientName}`);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Magic Gallery Manager</h1>
          <p className="text-gray-500 mt-1">Generate selection links and track client photo selections.</p>
        </div>

        {/* Create Gallery Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-red-600" />
              Create New Gallery
            </h2>
          </div>
          
          <form onSubmit={handleGenerateLink} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Select Client</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <select 
                    value={selectedBookingId} 
                    onChange={(e) => setSelectedBookingId(e.target.value)} 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Select a client booking...</option>
                    {bookings.map(booking => (
                      <option key={booking.id} value={booking.id}>
                        {booking.fullName} - {booking.eventType}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Google Drive Folder Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Folder className="h-4 w-4 text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    value={folderLink} 
                    onChange={(e) => setFolderLink(e.target.value)} 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" 
                    placeholder="https://drive.google.com/drive/folders/..." 
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={saving} className="text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 hover:opacity-90" style={{ backgroundColor: settings.brandColor }}>
                <Link className="w-4 h-4" />
                {saving ? 'Generating...' : 'Generate Client Selection Link'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Client Galleries Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Active Client Galleries</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                Loading galleries...
              </div>
            ) : galleries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No active galleries found. Create one above!
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Client Name</th>
                    <th className="px-6 py-4 font-semibold">Date Created</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Client Link</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {galleries.map((gallery) => (
                    <tr key={gallery.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{gallery.clientName}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(gallery.dateCreated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          gallery.status === 'Selected' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : gallery.status === 'Processing'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {gallery.status === 'Selected' ? `Selected (${gallery.selectedCount}/${gallery.totalCount})` : gallery.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleCopyLink(gallery.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black"
                          title="Copy Client Link"
                        >
                          <Link className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy Link</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleCopyIds(gallery)}
                          disabled={gallery.status !== 'Selected'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            gallery.status !== 'Selected'
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black'
                          }`}
                          title="Copy Selected Photo IDs"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="hidden sm:inline">Copy IDs</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </main>
  );
};

const CalendarContent = () => {
  const { settings } = React.useContext(BrandContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    eventDate: '',
    venue: '',
    eventType: 'Holud',
    package: 'Combo',
    totalAmount: '',
    advancePaid: ''
  });

  const fetchBookings = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => {
      if (!b.eventDate) return false;
      const bDate = new Date(b.eventDate);
      return bDate.getFullYear() === date.getFullYear() &&
             bDate.getMonth() === date.getMonth() &&
             bDate.getDate() === date.getDate();
    });
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const total = parseFloat(formData.totalAmount) || 0;
  const advance = parseFloat(formData.advancePaid) || 0;
  const dueAmount = Math.max(0, total - advance);

  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  const handleOpenModal = () => {
    if (!selectedDate) return;
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDate = `${y}-${m}-${d}`;

    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      eventDate: formattedDate,
      venue: '',
      eventType: 'Holud',
      package: 'Combo',
      totalAmount: '',
      advancePaid: ''
    });
    setEditingBookingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (booking: any) => {
    setFormData({
      fullName: booking.fullName || '',
      phone: booking.phone || '',
      email: booking.email || '',
      address: booking.address || '',
      eventDate: booking.eventDate || '',
      venue: booking.venue || '',
      eventType: booking.eventType || 'Holud',
      package: booking.package || 'Combo',
      totalAmount: booking.totalAmount?.toString() || '',
      advancePaid: booking.advancePaid?.toString() || ''
    });
    setEditingBookingId(booking.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        setBookings(bookings.filter(b => b.id !== id));
      } catch (error) {
        console.error("Error deleting booking: ", error);
        alert("Failed to delete booking.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const bookingData = {
        ...formData,
        dueAmount,
        status: dueAmount <= 0 ? 'Delivered' : 'Pending',
        userId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };

      if (editingBookingId) {
        await updateDoc(doc(db, 'bookings', editingBookingId), bookingData);
        setBookings(bookings.map(b => b.id === editingBookingId ? { ...b, ...bookingData } : b));
      } else {
        const newBooking = {
          ...bookingData,
          createdAt: new Date().toISOString()
        };
        const bookingRef = await addDoc(collection(db, 'bookings'), newBooking);

        const newClient = {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'clients'), newClient);

        setBookings([...bookings, { id: bookingRef.id, ...newBooking }]);
      }
      setIsModalOpen(false);
      setEditingBookingId(null);
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert('Failed to save booking. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">View your upcoming bookings and events.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Grid */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-180 text-gray-600" />
                </button>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="aspect-square" />;
                
                const dayBookings = getBookingsForDate(date);
                const hasBooking = dayBookings.length > 0;
                const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all ${
                      isSelected ? 'text-white shadow-md' : 
                      isToday ? 'bg-red-50 font-bold' : 
                      'hover:bg-gray-50 text-gray-700'
                    }`}
                    style={isSelected ? { backgroundColor: settings.brandColor } : (isToday ? { color: settings.brandColor } : {})}
                  >
                    <span className="text-sm">{date.getDate()}</span>
                    {hasBooking && (
                      <div className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${isSelected ? 'bg-white/80' : ''}`} style={!isSelected ? { backgroundColor: settings.brandColor } : {}} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar / Popup */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
              </h3>
              
              {!selectedDate ? (
                <p className="text-gray-500 text-sm">Click on a date in the calendar to view bookings.</p>
              ) : (
                <>
                  {selectedDateBookings.length === 0 ? (
                    <p className="text-gray-500 text-sm mb-6">No bookings on this date.</p>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {selectedDateBookings.map(booking => (
                        <div key={booking.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50 relative group">
                          <div className="font-bold text-gray-900">{booking.fullName}</div>
                          <div className="text-sm text-red-600 font-medium mt-1">{booking.eventType}</div>
                          {booking.venue && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                              <MapPin className="w-3.5 h-3.5" />
                              {booking.venue}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(booking);
                              }}
                              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200"
                              title="Edit Booking"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(booking.id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors shadow-sm border border-transparent hover:border-gray-200"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button 
                    onClick={handleOpenModal}
                    className="w-full text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: settings.brandColor }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Booking for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                {editingBookingId ? 'Edit Booking' : 'New Booking'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Client Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Client Information</h3>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Client Name" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="+880 1..." />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="email@example.com" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Full Address" />
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Event Details</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Event Date</label>
                      <input type="date" name="eventDate" value={formData.eventDate} onChange={handleInputChange} required className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Event Type</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-4 w-4 text-gray-400" />
                        </div>
                        <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white">
                          <option value="Holud">Holud</option>
                          <option value="Reception">Reception</option>
                          <option value="Engagement">Engagement</option>
                          <option value="Akdh">Akdh</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Venue Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="Venue" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Package Selected</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <select name="package" value={formData.package} onChange={handleInputChange} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white">
                        <option value="Standard Photography">Standard Photography</option>
                        <option value="Premium Cinematography">Premium Cinematography</option>
                        <option value="Combo">Combo</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Total Amount</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-sm">৳</span>
                        </div>
                        <input type="number" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} required className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="0" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Advance Paid</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 font-medium text-sm">৳</span>
                        </div>
                        <input type="number" name="advancePaid" value={formData.advancePaid} onChange={handleInputChange} className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm" placeholder="0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 hover:opacity-90" style={{ backgroundColor: settings.brandColor }}>
                  <CheckCircle className="w-4 h-4" />
                  {saving ? 'Saving...' : (editingBookingId ? 'Update Booking' : 'Save Booking')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

const ClientsContent = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: ''
  });

  const fetchClients = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const clientsMap = new Map();

      // Fetch from bookings
      const bookingsQ = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const bookingsSnap = await getDocs(bookingsQ);
      bookingsSnap.forEach(doc => {
        const data = doc.data();
        const key = data.phone || data.fullName;
        if (key) {
          if (!clientsMap.has(key)) {
            clientsMap.set(key, {
              id: `booking-${doc.id}`,
              fullName: data.fullName,
              phone: data.phone,
              email: data.email || '',
              totalBookings: 1
            });
          } else {
            clientsMap.get(key).totalBookings += 1;
          }
        }
      });

      // Fetch from explicit clients collection
      const clientsQ = query(
        collection(db, 'clients'),
        where('userId', '==', auth.currentUser.uid)
      );
      const clientsSnap = await getDocs(clientsQ);
      clientsSnap.forEach(doc => {
        const data = doc.data();
        const key = data.phone || data.fullName;
        if (key) {
          if (!clientsMap.has(key)) {
            clientsMap.set(key, {
              id: doc.id,
              fullName: data.fullName,
              phone: data.phone,
              email: data.email || '',
              totalBookings: 0
            });
          }
        }
      });

      setClients(Array.from(clientsMap.values()));
    } catch (error) {
      console.error("Error fetching clients: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (client: any) => {
    setFormData({
      fullName: client.fullName || '',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || ''
    });
    setEditingClientId(client.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (clientId: string) => {
    if (clientId.startsWith('booking-')) {
      alert('This client is derived from a booking and cannot be deleted directly. Please delete the associated booking.');
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteDoc(doc(db, "clients", clientId));
        setClients(clients.filter(c => c.id !== clientId));
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      if (editingClientId) {
        if (editingClientId.startsWith('booking-')) {
          const newClient = {
            ...formData,
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
          };
          await addDoc(collection(db, 'clients'), newClient);
        } else {
          await updateDoc(doc(db, 'clients', editingClientId), formData);
        }
      } else {
        const newClient = {
          ...formData,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, 'clients'), newClient);
      }
      
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        address: ''
      });
      setIsModalOpen(false);
      setEditingClientId(null);
      fetchClients();
    } catch (error) {
      console.error("Error saving client: ", error);
      alert('Failed to save client. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-500 mt-1">Manage your client database and history.</p>
          </div>
          <button 
            onClick={() => {
              setFormData({ fullName: '', phone: '', email: '', address: '' });
              setEditingClientId(null);
              setIsModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Add New Client
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black placeholder-gray-400 text-sm"
                placeholder="Search clients by name or phone..."
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                Loading clients...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No clients found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Client Name</th>
                    <th className="px-6 py-4 font-semibold">Phone</th>
                    <th className="px-6 py-4 font-semibold">Total Bookings</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{client.fullName}</div>
                        {client.email && <div className="text-xs text-gray-500 mt-0.5">{client.email}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {client.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {client.totalBookings} Bookings
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-black"
                            onClick={() => handleEdit(client)}
                            title="Edit Client"
                          >
                            <Pencil className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                            onClick={() => handleDelete(client.id)}
                            title="Delete Client"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{editingClientId ? 'Edit Client' : 'Add New Client'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" placeholder="Client Name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" placeholder="+880 1..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" placeholder="email@example.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="block w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm" placeholder="Full Address" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70">
                  {saving ? 'Saving...' : (editingClientId ? 'Save Changes' : 'Save Client')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

const InvoicesContent = () => {
  const { settings } = React.useContext(BrandContext);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const fetchInvoices = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const invoicesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const total = parseFloat(data.totalAmount) || 0;
        const advance = parseFloat(data.advancePaid) || 0;
        const due = Math.max(0, total - advance);
        
        let status = 'Unpaid';
        if (total > 0 && due === 0) status = 'Paid';
        else if (advance > 0 && due > 0) status = 'Partially Paid';
        else if (total > 0 && advance === 0) status = 'Unpaid';

        return {
          id: doc.id,
          ...data,
          totalAmountNum: total,
          advancePaidNum: advance,
          dueAmountNum: due,
          paymentStatus: status
        };
      });
      
      // Sort by creation date descending
      invoicesData.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage payments, track dues, and generate invoices.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5" style={{ color: settings.brandColor }} />
              Recent Invoices
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: settings.brandColor }}></div>
                Loading invoices...
              </div>
            ) : invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No billing records found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Client Name</th>
                    <th className="px-6 py-4 font-semibold">Total Amount</th>
                    <th className="px-6 py-4 font-semibold">Advance Paid</th>
                    <th className="px-6 py-4 font-semibold">Due Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{invoice.fullName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{invoice.eventType}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        ${invoice.totalAmountNum.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        ${invoice.advancePaidNum.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-bold" style={{ color: settings.brandColor }}>
                        ${invoice.dueAmountNum.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          invoice.paymentStatus === 'Paid' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : invoice.paymentStatus === 'Partially Paid'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {invoice.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedInvoice(invoice)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: `${settings.brandColor}15`, color: settings.brandColor }}
                        >
                          <FileText className="w-4 h-4" />
                          <span className="hidden sm:inline">Generate Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-auto relative">
            {/* Modal Actions (Not printed) */}
            <div className="flex items-center justify-end gap-3 p-4 border-b border-gray-100 print:hidden bg-gray-50 rounded-t-2xl">
              <button 
                onClick={handlePrint}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <Printer className="w-4 h-4" />
                Print Invoice
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>

            {/* Printable Area */}
            <div className="p-8 sm:p-12 print:p-0 print:m-0 bg-white print:w-full print:h-full">
              <div className="flex justify-between items-start mb-12">
                <div>
                  {settings.logoUrl ? (
                    <img src={settings.logoUrl} alt={settings.agencyName} className="h-10 mb-2 object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center print:-webkit-print-color-adjust-exact" style={{ backgroundColor: settings.brandColor }}>
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <span>{settings.agencyName === 'LensCRM' ? <>Lens<span style={{ color: settings.brandColor }}>CRM</span></> : settings.agencyName}</span>
                    </div>
                  )}
                  <p className="text-gray-500 text-sm">Premium Wedding Cinematography</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">Invoice</h2>
                  <p className="text-gray-500 font-medium">INV-{selectedInvoice.id.substring(0, 6).toUpperCase()}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Billed To</h3>
                  <p className="text-lg font-bold text-gray-900">{selectedInvoice.fullName}</p>
                  <p className="text-gray-600 mt-1">{selectedInvoice.phone}</p>
                  {selectedInvoice.email && <p className="text-gray-600">{selectedInvoice.email}</p>}
                  {selectedInvoice.address && <p className="text-gray-600 mt-1">{selectedInvoice.address}</p>}
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Event Details</h3>
                  <p className="text-gray-900 font-medium">{selectedInvoice.eventType} - {selectedInvoice.package} Package</p>
                  <p className="text-gray-600 mt-1">Date: {new Date(selectedInvoice.eventDate).toLocaleDateString()}</p>
                  {selectedInvoice.venue && <p className="text-gray-600 mt-1">Venue: {selectedInvoice.venue}</p>}
                </div>
              </div>

              <table className="w-full mb-12">
                <thead>
                  <tr className="border-b-2 border-black text-left">
                    <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-sm">Description</th>
                    <th className="py-3 font-bold text-gray-900 uppercase tracking-wider text-sm text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 text-gray-900">
                      <div className="font-medium">{selectedInvoice.package} Photography & Cinematography Package</div>
                      <div className="text-sm text-gray-500 mt-1">Coverage for {selectedInvoice.eventType}</div>
                    </td>
                    <td className="py-4 text-gray-900 font-medium text-right">
                      ${selectedInvoice.totalAmountNum.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Total Amount:</span>
                    <span className="font-medium text-gray-900">${selectedInvoice.totalAmountNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Advance Paid:</span>
                    <span className="font-medium text-gray-900">${selectedInvoice.advancePaidNum.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Amount Due:</span>
                    <span style={{ color: settings.brandColor }}>${selectedInvoice.dueAmountNum.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                <p className="text-gray-500 font-medium">Thank you for your business!</p>
                <p className="text-gray-400 text-sm mt-1">If you have any questions about this invoice, please contact us.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

function MainDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLogout = () => signOut(auth);

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] font-sans overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar toggleSidebar={toggleSidebar} onLogout={handleLogout} />
        {activeTab === 'Dashboard' && <DashboardContent />}
        {activeTab === 'Calendar' && <CalendarContent />}
        {activeTab === 'Leads' && <LeadsContent />}
        {activeTab === 'Bookings' && <BookingsContent />}
        {activeTab === 'Clients' && <ClientsContent />}
        {activeTab === 'Invoices' && <InvoicesContent />}
        {activeTab === 'Magic Gallery' && <MagicGalleryContent />}
        {activeTab === 'Settings' && <SettingsContent />}
        {activeTab !== 'Dashboard' && activeTab !== 'Calendar' && activeTab !== 'Leads' && activeTab !== 'Bookings' && activeTab !== 'Clients' && activeTab !== 'Invoices' && activeTab !== 'Settings' && activeTab !== 'Magic Gallery' && (
          <main className="flex-1 overflow-y-auto bg-[#FAFAFA] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-gray-400 flex flex-col items-center">
              <p className="text-xl font-medium">{activeTab} Content</p>
              <p className="text-sm">Coming soon...</p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

const PublicGallery = () => {
  const { settings, setSettings } = React.useContext(BrandContext);
  const { galleryId } = useParams();
  const [gallery, setGallery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Dummy photos to simulate Google Drive images
  const dummyPhotos = Array.from({ length: 24 }).map((_, i) => ({
    id: `FILE_ID_${i + 1}`,
    url: `https://picsum.photos/seed/${galleryId}_${i}/800/600` // Simulating /thumbnail?id=FILE_ID
  }));

  useEffect(() => {
    const fetchGallery = async () => {
      if (!galleryId) return;
      try {
        const docRef = doc(db, 'galleries', galleryId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setGallery({ id: docSnap.id, ...data });
          if (data.selectedIds) {
            setSelectedIds(new Set(data.selectedIds));
          }
          
          if (data.userId) {
            const settingsRef = doc(db, 'settings', data.userId);
            const settingsSnap = await getDoc(settingsRef);
            if (settingsSnap.exists()) {
              const sData = settingsSnap.data();
              setSettings({
                brandColor: sData.brandColor || '#dc2626',
                logoUrl: sData.logoUrl || '',
                agencyName: sData.agencyName || 'LensCRM'
              });
            }
          }
        } else {
          setError('Gallery not found.');
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError('Failed to load gallery.');
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [galleryId, setSettings]);

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleSubmitSelection = async () => {
    if (!galleryId || selectedIds.size === 0) return;
    
    setSubmitting(true);
    try {
      const docRef = doc(db, 'galleries', galleryId);
      await updateDoc(docRef, {
        status: 'Selected',
        selectedCount: selectedIds.size,
        selectedImageIds: Array.from(selectedIds)
      });
      
      setGallery({ ...gallery, status: 'Selected', selectedCount: selectedIds.size });
    } catch (err) {
      console.error("Error submitting selection:", err);
      alert('Failed to submit selection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-500">{error || 'Gallery not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Premium Header */}
      <header className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 text-center sticky top-0 z-10 shadow-md flex flex-col items-center">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.agencyName} className="h-12 mb-4 object-contain" />
        ) : (
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: settings.brandColor }}>
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span>{settings.agencyName === 'LensCRM' ? <>Lens<span style={{ color: settings.brandColor }}>CRM</span></> : settings.agencyName}</span>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome, {gallery.clientName}!</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Please select your favorites.</p>
        {gallery.status === 'Selected' && (
          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
            Selection Submitted
          </div>
        )}
      </header>

      {/* Photo Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {gallery.status === 'Selected' && (
          <div className="mb-8 p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600">Your selection of {gallery.selectedCount || selectedIds.size} photos has been successfully submitted.</p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {dummyPhotos.map((photo) => {
            const isSelected = selectedIds.has(photo.id);
            return (
              <div 
                key={photo.id} 
                onClick={() => gallery.status !== 'Selected' && toggleSelection(photo.id)}
                className={`relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 ${
                  isSelected ? 'ring-4 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                } ${gallery.status === 'Selected' ? 'cursor-default opacity-80' : ''}`}
                style={isSelected ? { '--tw-ring-color': settings.brandColor } as React.CSSProperties : {}}
              >
                <img 
                  src={photo.url} 
                  alt="Gallery item" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Selection Overlay */}
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div className="absolute top-3 right-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected 
                        ? 'border-transparent text-white' 
                        : 'bg-black/40 border-white text-transparent'
                    }`} style={isSelected ? { backgroundColor: settings.brandColor } : {}}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Floating Action Bar */}
      {gallery.status !== 'Selected' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-bold px-4 py-2 rounded-xl" style={{ backgroundColor: `${settings.brandColor}15`, color: settings.brandColor }}>
                {selectedIds.size}
              </div>
              <span className="text-gray-600 font-medium hidden sm:inline">Photos Selected</span>
            </div>
            
            <button 
              onClick={handleSubmitSelection}
              disabled={selectedIds.size === 0 || submitting}
              className="text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: settings.brandColor }}
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              Submit Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [settings, setSettings] = useState<BrandSettings>(defaultBrandSettings);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'settings', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSettings({
              brandColor: data.brandColor || '#dc2626',
              logoUrl: data.logoUrl || '',
              agencyName: data.agencyName || 'LensCRM'
            });
          } else {
            setSettings(defaultBrandSettings);
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      } else {
        setSettings(defaultBrandSettings);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <BrandContext.Provider value={{ settings, setSettings }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/gallery/:galleryId" element={<PublicGallery />} />
        </Routes>
      </BrowserRouter>
    </BrandContext.Provider>
  );
}
