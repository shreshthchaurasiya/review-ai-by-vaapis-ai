import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { LayoutDashboard, CreditCard, Users, Edit, Trash2, Plus, Save, X, Tag, Download, TrendingUp, Zap, Calendar } from 'lucide-react';

interface SubscriptionPlan {
  id: string; // Document ID (e.g. basic, pro, free)
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavingsText?: string;
  features: string[];
  isActive: boolean;
  trialDays: number;
  aiRequestLimit: number;
  limitType: 'daily' | 'monthly';
}

interface Coupon {
  id: string; // The coupon code
  discountPercentage: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}
interface BusinessAuditData {
  id: string;
  name: string;
  plan: string;
  planStartDate: string;
  aiCount: number;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBusinesses: 0, proUsers: 0, recentSignups: 0, totalAiReviews: 0 });
  const [businessesLog, setBusinessesLog] = useState<BusinessAuditData[]>([]);
  
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    // Real-time listener for plans
    const unsubPlans = onSnapshot(collection(db, 'subscription_plans'), (snapshot) => {
      const fetchedPlans = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SubscriptionPlan[];
      setPlans(fetchedPlans);
    }, (error) => {
      console.error("Error listening to plans:", error);
    });

    // Real-time listener for coupons
    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      const fetchedCoupons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      setCoupons(fetchedCoupons);
    }, (error) => {
      console.error("Error listening to coupons:", error);
    });

    fetchStats();

    return () => {
      unsubPlans();
      unsubCoupons();
    };
  }, []);

  const fetchStats = async () => {
    try {
      const { getDocs } = await import('firebase/firestore'); 
      const bSnap = await getDocs(collection(db, 'businesses'));
      const fSnap = await getDocs(collection(db, 'feedbacks'));
      
      let proCount = 0;
      let recentCount = 0;
      const logs: BusinessAuditData[] = [];
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      bSnap.forEach(doc => {
        const data = doc.data();
        if (data.plan === 'pro') proCount++;
        
        const joinDate = data.planStartDate ? new Date(data.planStartDate) : new Date(0);
        if (joinDate >= sevenDaysAgo) recentCount++;
        
        logs.push({
          id: doc.id,
          name: data.name || 'Unnamed',
          plan: data.plan || 'free',
          planStartDate: data.planStartDate || new Date().toISOString(),
          aiCount: (data.dailyAiCount || 0) + (data.monthlyAiCount || 0)
        });
      });

      logs.sort((a, b) => new Date(b.planStartDate).getTime() - new Date(a.planStartDate).getTime());
      
      setStats({ 
        totalUsers: bSnap.size, 
        totalBusinesses: bSnap.size,
        proUsers: proCount,
        recentSignups: recentCount,
        totalAiReviews: fSnap.size
      });
      setBusinessesLog(logs);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleExportCSV = () => {
    if (businessesLog.length === 0) return;
    const headers = ['Business ID', 'Business Name', 'Plan', 'Join Date', 'Total AI Usage'];
    const rows = businessesLog.map(b => [
      b.id,
      `"${b.name}"`,
      b.plan,
      new Date(b.planStartDate).toLocaleDateString(),
      b.aiCount.toString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reviewai_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSavePlan = async () => {
    if (!editingPlan || !editingPlan.id) return;
    try {
      await setDoc(doc(db, 'subscription_plans', editingPlan.id), {
        name: editingPlan.name,
        description: editingPlan.description,
        monthlyPrice: Number(editingPlan.monthlyPrice),
        yearlyPrice: Number(editingPlan.yearlyPrice),
        yearlySavingsText: editingPlan.yearlySavingsText || '',
        features: editingPlan.features,
        isActive: editingPlan.isActive,
        trialDays: Number(editingPlan.trialDays) || 0,
        aiRequestLimit: Number(editingPlan.aiRequestLimit) || 10,
        limitType: editingPlan.limitType || 'daily'
      });
      setEditingPlan(null);
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deleteDoc(doc(db, 'subscription_plans', id));
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  const handleSaveCoupon = async () => {
    if (!editingCoupon || !editingCoupon.id) return;
    const code = editingCoupon.id.trim().toUpperCase();
    if (!code) return;
    
    try {
      await setDoc(doc(db, 'coupons', code), {
        discountPercentage: Number(editingCoupon.discountPercentage),
        usageLimit: Number(editingCoupon.usageLimit),
        usedCount: Number(editingCoupon.usedCount),
        isActive: editingCoupon.isActive
      });
      setEditingCoupon(null);
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col gap-2">
        <div className="text-xl font-black text-[#6D28D9] mb-8">ReviewAI Admin</div>
        
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-[#F5F3FF] text-[#6D28D9]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('subscriptions')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'subscriptions' ? 'bg-[#F5F3FF] text-[#6D28D9]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <CreditCard size={20} /> Subscriptions
        </button>
        <button 
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'coupons' ? 'bg-[#F5F3FF] text-[#6D28D9]' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Tag size={20} /> Coupons
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'dashboard' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors shadow-sm">
                <Download size={16} /> Export Audit CSV
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Users size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Total Businesses</div>
                  <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><Zap size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Pro Subscriptions</div>
                  <div className="text-2xl font-bold">{stats.proUsers}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-600"><TrendingUp size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">New (Last 7 Days)</div>
                  <div className="text-2xl font-bold">{stats.recentSignups}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-lg text-amber-600"><LayoutDashboard size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Total AI Reviews</div>
                  <div className="text-2xl font-bold">{stats.totalAiReviews}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-gray-500" /> Recent Activity / Audit Log</h2>
                <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-200 rounded-full">{businessesLog.length} Records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500">
                      <th className="px-6 py-3 font-semibold">Business Name</th>
                      <th className="px-6 py-3 font-semibold">Plan</th>
                      <th className="px-6 py-3 font-semibold">Join Date</th>
                      <th className="px-6 py-3 font-semibold">Total AI Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessesLog.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">No data found</td></tr>
                    ) : (
                      businessesLog.slice(0, 10).map((b, i) => (
                        <tr key={b.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${b.plan === 'pro' ? 'bg-[#F5F3FF] text-[#6D28D9]' : 'bg-gray-100 text-gray-600'}`}>
                              {b.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(b.planStartDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{b.aiCount} requests</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {businessesLog.length > 10 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                  Showing latest 10 records. Use CSV export for full audit.
                </div>
              )}
            </div>
          </div>
        ) : activeTab === 'subscriptions' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
              <button 
                onClick={() => setEditingPlan({ id: 'new-plan', name: '', description: '', monthlyPrice: 0, yearlyPrice: 0, yearlySavingsText: '', features: [], isActive: true, trialDays: 0, aiRequestLimit: 10, limitType: 'daily' })}
                className="bg-[#6D28D9] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#5b21b6]"
              >
                <Plus size={18} /> Add Plan
              </button>
            </div>

            <div className="grid gap-4 max-w-4xl">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {plan.name} {plan.isActive ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactive</span>}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    <div className="mt-2 text-sm font-medium">₹{plan.monthlyPrice}/mo | ₹{plan.yearlyPrice}/yr</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPlan(plan)} className="p-2 text-gray-500 hover:text-[#6D28D9] bg-gray-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'coupons' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Promo Coupons</h1>
              <button 
                onClick={() => setEditingCoupon({ id: '', discountPercentage: 10, usageLimit: 0, usedCount: 0, isActive: true })}
                className="bg-[#6D28D9] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#5b21b6]"
              >
                <Plus size={18} /> Add Coupon
              </button>
            </div>

            <div className="grid gap-4 max-w-4xl">
              {coupons.map(coupon => (
                <div key={coupon.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {coupon.id} {coupon.isActive ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span> : <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Inactive</span>}
                    </h3>
                    <div className="mt-2 text-sm text-gray-600 flex gap-4">
                      <span>Discount: <strong className="text-gray-900">{coupon.discountPercentage}%</strong></span>
                      <span>Usage: <strong className="text-gray-900">{coupon.usedCount} / {coupon.usageLimit === 0 ? 'Unlimited' : coupon.usageLimit}</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCoupon(coupon)} className="p-2 text-gray-500 hover:text-[#6D28D9] bg-gray-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingPlan.id === 'new-plan' ? 'Create New Plan' : 'Edit Plan'}</h2>
              <button onClick={() => setEditingPlan(null)}><X className="text-gray-500" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan ID (Unique)</label>
                <input type="text" disabled={editingPlan.id !== 'new-plan'} value={editingPlan.id} onChange={e => setEditingPlan({...editingPlan, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full border rounded-lg p-2" placeholder="e.g. basic, pro, ultimate" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Price (₹)</label>
                  <input type="number" value={editingPlan.monthlyPrice} onChange={e => setEditingPlan({...editingPlan, monthlyPrice: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Yearly Price (₹)</label>
                  <input type="number" value={editingPlan.yearlyPrice} onChange={e => setEditingPlan({...editingPlan, yearlyPrice: Number(e.target.value)})} className="w-full border rounded-lg p-2 mb-2" />
                  <label className="block text-sm font-medium mb-1 text-gray-700">Yearly Savings Text (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Users save ₹289 on yearly plan" 
                    value={editingPlan.yearlySavingsText || ''} 
                    onChange={e => setEditingPlan({...editingPlan, yearlySavingsText: e.target.value})} 
                    className="w-full border rounded-lg p-2 text-sm" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">AI Request Limit</label>
                  <input type="number" value={editingPlan.aiRequestLimit || 0} onChange={e => setEditingPlan({...editingPlan, aiRequestLimit: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Limit Type</label>
                  <select value={editingPlan.limitType || 'daily'} onChange={e => setEditingPlan({...editingPlan, limitType: e.target.value as 'daily' | 'monthly'})} className="w-full border rounded-lg p-2 bg-white">
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Trial Days (0 if none)</label>
                <input type="number" value={editingPlan.trialDays} onChange={e => setEditingPlan({...editingPlan, trialDays: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (one per line)</label>
                <textarea 
                  rows={5} 
                  value={editingPlan.features.join('\n')} 
                  onChange={e => setEditingPlan({...editingPlan, features: e.target.value.split('\n').filter(f => f.trim() !== '')})}
                  className="w-full border rounded-lg p-2" 
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="isActive" checked={editingPlan.isActive} onChange={e => setEditingPlan({...editingPlan, isActive: e.target.checked})} />
                <label htmlFor="isActive" className="text-sm font-medium">Plan is Active (visible to users)</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditingPlan(null)} className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSavePlan} className="px-4 py-2 font-medium text-white bg-[#6D28D9] rounded-lg flex items-center gap-2"><Save size={18}/> Save Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Coupon</h2>
              <button onClick={() => setEditingCoupon(null)}><X className="text-gray-500" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input type="text" value={editingCoupon.id} onChange={e => setEditingCoupon({...editingCoupon, id: e.target.value.toUpperCase().replace(/\s+/g, '')})} className="w-full border rounded-lg p-2 uppercase" placeholder="e.g. DIWALI50" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Percentage (%)</label>
                <input type="number" min="1" max="100" value={editingCoupon.discountPercentage} onChange={e => setEditingCoupon({...editingCoupon, discountPercentage: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Usage Limit (0 for unlimited)</label>
                <input type="number" min="0" value={editingCoupon.usageLimit} onChange={e => setEditingCoupon({...editingCoupon, usageLimit: Number(e.target.value)})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-600">
                Current Uses: <strong className="text-gray-900">{editingCoupon.usedCount}</strong> times
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" id="isActiveCoupon" checked={editingCoupon.isActive} onChange={e => setEditingCoupon({...editingCoupon, isActive: e.target.checked})} />
                <label htmlFor="isActiveCoupon" className="text-sm font-medium">Coupon is Active</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditingCoupon(null)} className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveCoupon} className="px-4 py-2 font-medium text-white bg-[#6D28D9] rounded-lg flex items-center gap-2"><Save size={18}/> Save Coupon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
