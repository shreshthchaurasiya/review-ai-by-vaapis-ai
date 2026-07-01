import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Copy, ExternalLink, QrCode, Check } from "lucide-react";
import MerchantLayout from "@/components/MerchantLayout";
import type { Business } from "@shared/schema";

const CATEGORIES = [
  "Cafe / Coffee Shop", "Restaurant", "Bar / Pub", "Retail Store",
  "Salon / Beauty", "Spa / Wellness", "Health Clinic", "Gym / Fitness",
  "Hotel / Lodging", "Bakery", "Other",
];

export default function BusinessPage() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: business, isLoading } = useQuery<Business>({ queryKey: ["/api/business"] });
  const { data: qrData } = useQuery<{ qr: string; url: string }>({ queryKey: ["/api/business/qr"] });

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (business) {
      setName(business.name);
      setCategory(business.category);
      setGoogleReviewUrl(business.googleReviewUrl);
    }
  }, [business]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Business>) => apiRequest("PUT", "/api/business", data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["/api/business"] });
      await qc.invalidateQueries({ queryKey: ["/api/business/qr"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast({ title: "Saved!", description: "Business profile updated." });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast({ title: "Business name is required", variant: "destructive" }); return; }
    updateMutation.mutate({ name, category, googleReviewUrl });
  };

  const copyLink = () => {
    if (qrData?.url) {
      navigator.clipboard.writeText(qrData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQR = () => {
    if (!qrData?.qr) return;
    const a = document.createElement("a");
    a.href = qrData.qr;
    a.download = `${name || "reviewai"}-qr.png`;
    a.click();
  };

  return (
    <MerchantLayout>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-[#ECECF2] px-8 h-16 flex items-center">
        <h1 className="text-sm font-semibold text-[#111827]">Business Profile</h1>
      </div>

      <main className="flex-1 px-8 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Form */}
          <form onSubmit={handleSave} className="lg:col-span-3 bg-white rounded-2xl border border-[#ECECF2] shadow-sm">
            <div className="px-6 py-5 border-b border-[#ECECF2]">
              <h2 className="text-base font-semibold text-[#111827]">Business Details</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">This information appears on your customer review page.</p>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Business Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Artisan Cafe"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                  data-testid="input-business-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Business Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors cursor-pointer"
                  data-testid="select-category"
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Google Review URL</label>
                <input
                  type="url"
                  value={googleReviewUrl}
                  onChange={e => setGoogleReviewUrl(e.target.value)}
                  placeholder="https://g.page/r/your-business/review"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ECECF2] bg-[#FAFAFC] text-[#111827] text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-colors"
                  data-testid="input-google-url"
                />
                <p className="text-xs text-[#9CA3AF] mt-1.5">Customers who rate 4–5 stars will be sent here to post their review.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#ECECF2] flex items-center justify-between">
              {saved && (
                <div className="flex items-center gap-1.5 text-[#16A34A] text-sm font-medium">
                  <Check size={15} />
                  Changes saved
                </div>
              )}
              <div className="ml-auto">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-6 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-60"
                  data-testid="button-save"
                >
                  {updateMutation.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>

          {/* QR Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-[#ECECF2] shadow-sm">
              <div className="px-6 py-5 border-b border-[#ECECF2]">
                <h2 className="text-base font-semibold text-[#111827]">Your QR Code</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">Print and display at your business</p>
              </div>
              <div className="px-6 py-6 flex flex-col items-center gap-5">
                {qrData?.qr ? (
                  <img src={qrData.qr} alt="QR Code" className="w-44 h-44 rounded-xl" />
                ) : (
                  <div className="w-44 h-44 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                    <QrCode size={48} className="text-[#A855F7] opacity-40" />
                  </div>
                )}

                {qrData?.url && (
                  <div className="w-full bg-[#FAFAFC] rounded-xl border border-[#ECECF2] px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-[#6B7280] truncate flex-1">{qrData.url}</span>
                  </div>
                )}

                <div className="flex w-full gap-2">
                  <button
                    onClick={downloadQR}
                    disabled={!qrData?.qr}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ECECF2] text-sm font-medium text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors disabled:opacity-40"
                  >
                    <Download size={15} /> Download
                  </button>
                  <button
                    onClick={copyLink}
                    disabled={!qrData?.url}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#ECECF2] text-sm font-medium text-[#6D28D9] hover:bg-[#F5F3FF] transition-colors disabled:opacity-40"
                  >
                    {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}
                  </button>
                </div>

                {qrData?.url && (
                  <a
                    href={qrData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#6D28D9] transition-colors"
                  >
                    <ExternalLink size={13} /> Preview customer page
                  </a>
                )}
              </div>
            </div>

            {!business?.name && (
              <div className="bg-[#FFFBEB] border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                <strong>Tip:</strong> Fill in your business name and Google Review URL first, then share your QR code with customers.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="px-8 py-4 border-t border-[#ECECF2]">
        <p className="text-center text-xs text-[#9CA3AF] tracking-wide uppercase">Powered by Adshree Inc.</p>
      </footer>
    </MerchantLayout>
  );
}
