import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { LayoutDashboard, CreditCard, Users, Edit, Trash2, Plus, Save, X, Tag } from 'lucide-react';

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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({ users: 0, businesses: 0 });
  
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
      const { getDocs } = await import('firebase/firestore'); // Import dynamically just for stats if needed, or import at top
      const bSnap = await getDocs(collection(db, 'businesses'));
      setStats({ users: bSnap.size, businesses: bSnap.size }); // Assuming 1:1 for now
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><Users size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Total Users</div>
                  <div className="text-2xl font-bold">{stats.users}</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><LayoutDashboard size={24} /></div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Total Businesses</div>
                  <div className="text-2xl font-bold">{stats.businesses}</div>
                </div>
              </div>
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
