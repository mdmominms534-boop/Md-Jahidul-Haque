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
  Map,
  Tag,
  Package,
  CheckCircle,
  Clock,
  Copy,
  Link,
  Folder
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
  updateDoc
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
type NavItem = {
  name: string;
  icon: React.ElementType;
};

// --- Constants ---
const NAVIGATION: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Calendar', icon: Calendar },
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
                      ? 'bg-red-600 text-white font-medium' 
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
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

const Topbar = ({ toggleSidebar, onLogout }: { toggleSidebar: () => void, onLogout: () => void }) => {
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
        
        <button onClick={onLogout} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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

const BookingsContent = () => {
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

  const total = parseFloat(formData.totalAmount) || 0;
  const advance = parseFloat(formData.advancePaid) || 0;
  const dueAmount = Math.max(0, total - advance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    try {
      const newBooking = {
        ...formData,
        dueAmount,
        status: dueAmount <= 0 ? 'Delivered' : 'Pending',
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), newBooking);
      
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
      
      // Refresh list
      fetchBookings();
      alert('Booking saved successfully!');
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
              New Booking Form
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
                        <Map className="h-4 w-4 text-gray-400" />
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

            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Booking'}
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
  const [selectedClient, setSelectedClient] = useState('');
  const [folderLink, setFolderLink] = useState('');

  const [galleries, setGalleries] = useState<any[]>([]);
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

  useEffect(() => {
    fetchGalleries();
  }, []);

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !folderLink || !auth.currentUser) return;
    
    setSaving(true);
    try {
      const newGallery = {
        clientName: selectedClient,
        folderLink: folderLink,
        dateCreated: new Date().toISOString().split('T')[0],
        status: 'Pending Selection',
        selectedCount: 0,
        totalCount: 500, // Dummy total count
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, 'galleries'), newGallery);
      
      setSelectedClient('');
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

  const handleCopyIds = (clientName: string) => {
    // Dummy copy action
    alert(`Copied selected photo IDs for ${clientName}`);
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
                    value={selectedClient} 
                    onChange={(e) => setSelectedClient(e.target.value)} 
                    required 
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all outline-none text-black text-sm appearance-none bg-white"
                  >
                    <option value="" disabled>Select a client booking...</option>
                    <option value="Rahim & Masuma Wedding">Rahim & Masuma Wedding</option>
                    <option value="Aisha & Fahim Holud">Aisha & Fahim Holud</option>
                    <option value="Nadia & Kamal Engagement">Nadia & Kamal Engagement</option>
                    <option value="Zara & Ali Akdh">Zara & Ali Akdh</option>
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
              <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70">
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
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleCopyIds(gallery.clientName)}
                          disabled={gallery.status === 'Pending Selection'}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            gallery.status === 'Pending Selection'
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
        {activeTab === 'Bookings' && <BookingsContent />}
        {activeTab === 'Magic Gallery' && <MagicGalleryContent />}
        {activeTab === 'Settings' && <SettingsContent />}
        {activeTab !== 'Dashboard' && activeTab !== 'Bookings' && activeTab !== 'Settings' && activeTab !== 'Magic Gallery' && (
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
  }, [galleryId]);

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
      <header className="bg-black text-white py-8 px-4 sm:px-6 lg:px-8 text-center sticky top-0 z-10 shadow-md">
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
                  isSelected ? 'ring-4 ring-red-600 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                } ${gallery.status === 'Selected' ? 'cursor-default opacity-80' : ''}`}
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
                        ? 'bg-red-600 border-red-600 text-white' 
                        : 'bg-black/40 border-white text-transparent'
                    }`}>
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
              <div className="bg-red-50 text-red-600 font-bold px-4 py-2 rounded-xl">
                {selectedIds.size}
              </div>
              <span className="text-gray-600 font-medium hidden sm:inline">Photos Selected</span>
            </div>
            
            <button 
              onClick={handleSubmitSelection}
              disabled={selectedIds.size === 0 || submitting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/gallery/:galleryId" element={<PublicGallery />} />
      </Routes>
    </BrowserRouter>
  );
}
