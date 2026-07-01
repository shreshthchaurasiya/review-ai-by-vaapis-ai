import { useState } from "react";

const imgProfilePic = "https://www.figma.com/api/mcp/asset/cd534c41-351a-401d-9a84-8b3a1219f2c8";
const imgQrCode = "https://www.figma.com/api/mcp/asset/182a9ee2-b512-4488-8ebf-2d76355a035c";
const imgNavDashboard = "https://www.figma.com/api/mcp/asset/521118ab-9866-447b-b544-188fdec0fde4";
const imgNavBusiness = "https://www.figma.com/api/mcp/asset/a6db904d-4701-48d1-b407-176b73f6aedc";
const imgNavQr = "https://www.figma.com/api/mcp/asset/31336eb4-3111-4487-9717-b13f4979e0e6";
const imgNavFeedback = "https://www.figma.com/api/mcp/asset/ffb38b39-182e-4678-993a-6560e14f563a";
const imgNavSettings = "https://www.figma.com/api/mcp/asset/cc064003-9ee4-45e5-899a-ce4a1fde38f2";
const imgNavLogout = "https://www.figma.com/api/mcp/asset/7a4a053b-9879-480c-9df6-1c08ece193d4";
const imgBell = "https://www.figma.com/api/mcp/asset/34e8a47b-3cea-4477-8440-fae97422d64d";
const imgUpload = "https://www.figma.com/api/mcp/asset/57b460e9-544b-4c59-8960-766006464408";
const imgBusinessPhoto = "https://www.figma.com/api/mcp/asset/c9010cff-0144-426a-99ba-e5126d620cc2";
const imgEditIcon = "https://www.figma.com/api/mcp/asset/4c1f8edf-ada8-4f09-a5f8-2ae93a2656ef";
const imgGoogleIcon = "https://www.figma.com/api/mcp/asset/a9f9a532-6758-4d04-8b08-2b90c1482958";
const imgDownload = "https://www.figma.com/api/mcp/asset/6a9a6790-f343-49a3-8fd1-5172803ecaa4";
const imgShare = "https://www.figma.com/api/mcp/asset/e6782edd-44fe-40eb-a9a9-f14797898344";
const imgPrint = "https://www.figma.com/api/mcp/asset/3625cea9-8e90-4e06-874a-fa9f3c30b1ce";
const imgCheck = "https://www.figma.com/api/mcp/asset/61a446c5-16e0-4557-8cef-d70df0cb6722";
const imgLink = "https://www.figma.com/api/mcp/asset/862ee901-00a2-4b25-a3ff-96d3bf5babb2";

export default function BusinessSettingsQr() {
  const [businessName, setBusinessName] = useState("Artisan Cafe");
  const [googleUrl, setGoogleUrl] = useState("https://g.page/r/artisan-cafe-review");
  const [category, setCategory] = useState("Cafe / Coffee Shop");
  const [address, setAddress] = useState("42 Brew Street, Portland, OR 97201");
  const [phone, setPhone] = useState("+1 (503) 555-0192");
  const [website, setWebsite] = useState("https://artisancafe.com");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="content-stretch flex flex-col gap-[40px] items-center pl-[256px] relative size-full min-h-screen" data-node-id="1:529" style={{ backgroundImage: "linear-gradient(90deg, rgb(249, 249, 255) 0%, rgb(249, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Business Settings & QR">

      {/* Sidebar */}
      <div className="absolute bg-[#f1f3ff] border-[#ccc3d8] border-r border-solid content-stretch flex flex-col gap-[8px] min-h-full items-start left-0 pl-[24px] pr-[25px] py-[24px] top-0 w-[256px]" data-node-id="1:530" data-name="Aside - Sidebar Navigation">
        <div className="relative shrink-0 w-full" data-node-id="1:531">
          <div className="content-stretch flex flex-col items-start pb-[32px] relative size-full">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[24px] w-full">
                <p className="leading-[33.6px]">ReviewAI</p>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[14px] w-full">
                <p className="leading-[20px]">by Adshree</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative shrink-0 w-full" data-node-id="1:537">
          <div className="content-stretch flex flex-col gap-[8px] items-start relative size-full">
            <div className="content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(99,14,212,0.06)]">
              <div className="relative shrink-0 size-[18px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavDashboard} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">Dashboard</p>
              </div>
            </div>
            <div className="bg-[#7c3aed] content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full cursor-pointer">
              <div className="h-[18px] relative shrink-0 w-[20.094px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavBusiness} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#ede0ff] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">Business</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(99,14,212,0.06)]">
              <div className="relative shrink-0 size-[18px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavQr} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">QR</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(99,14,212,0.06)]">
              <div className="relative shrink-0 size-[20px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavFeedback} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">Feedback</p>
              </div>
            </div>
            <div className="content-stretch flex gap-[12px] items-center p-[12px] relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(99,14,212,0.06)]">
              <div className="h-[20px] relative shrink-0 w-[20.1px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavSettings} />
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] whitespace-nowrap">
                <p className="leading-[24px]">Settings</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-[1_0_0] min-h-[153px] relative w-full">
          <div className="content-stretch flex flex-col items-start justify-end min-h-[inherit] relative size-full">
            <div className="border-[#ccc3d8] border-solid border-t content-stretch flex flex-col gap-[24px] items-start pt-[25px] relative shrink-0 w-full">
              <div className="relative shrink-0 w-full">
                <div className="content-stretch flex gap-[12px] items-center p-[8px] relative size-full">
                  <div className="border-2 border-[#7c3aed] border-solid relative rounded-[9999px] shrink-0 size-[40px] overflow-hidden">
                    <img alt="" className="absolute left-0 max-w-none size-full top-0 object-cover" src={imgProfilePic} />
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0">
                    <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[16px] whitespace-nowrap">
                      <p className="leading-[24px]">Artisan Cafe</p>
                    </div>
                    <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[12px] whitespace-nowrap">
                      <p className="leading-[16px]">Merchant Admin</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-[rgba(186,26,26,0.06)]">
                <div className="content-stretch flex gap-[12px] items-center p-[12px] relative size-full">
                  <div className="relative shrink-0 size-[18px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgNavLogout} />
                  </div>
                  <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#ba1a1a] text-[16px] whitespace-nowrap">
                    <p className="leading-[24px]">Logout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top App Bar */}
      <div className="backdrop-blur-[6px] bg-[rgba(249,249,255,0.8)] border-[#ccc3d8] border-b border-solid content-stretch flex h-[64px] items-center justify-between pb-px px-[24px] relative shrink-0 w-full" data-node-id="1:578">
        <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Business Profile</p>
        </div>
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
          <div className="bg-[rgba(99,14,212,0.08)] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[36px] cursor-pointer">
            <div className="relative shrink-0 size-[18px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBell} />
            </div>
          </div>
          <div className="border-2 border-[#7c3aed] border-solid relative rounded-[9999px] shrink-0 size-[36px] overflow-hidden cursor-pointer">
            <img alt="" className="absolute left-0 max-w-none size-full top-0 object-cover" src={imgProfilePic} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-stretch flex flex-col gap-[32px] items-start left-0 max-w-[1280px] p-[32px] relative w-full">
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0 w-full">

          {/* Business Profile Form */}
          <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] border border-[#ececf2] border-solid content-stretch flex flex-col gap-[24px] items-start p-[32px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex-[1_0_0]">
            {/* Business Cover / Logo */}
            <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[18px]">
                <p className="leading-[28px]">Business Profile</p>
              </div>
              <div className="relative rounded-[12px] shrink-0 w-full h-[140px] overflow-hidden">
                <img alt="Business cover" className="absolute inset-0 size-full object-cover" src={imgBusinessPhoto} />
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-[12px]">
                  <div className="content-stretch flex gap-[8px] items-center bg-white px-[16px] py-[8px] rounded-[8px]">
                    <img alt="" className="size-[16px]" src={imgUpload} />
                    <span className="font-['Poppins'] font-semibold text-[14px] text-[#141b2b]">Change Photo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              {/* Business Name */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                  <p className="leading-[20px]">Business Name</p>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full font-['Poppins'] text-[16px] text-[#141b2b] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[rgba(124,58,237,0.1)]"
                />
              </div>

              {/* Google Review URL */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                  <p className="leading-[20px]">Google Review URL</p>
                </label>
                <div className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center gap-[8px] px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[rgba(124,58,237,0.1)]">
                  <img alt="" className="shrink-0 size-[18px]" src={imgGoogleIcon} />
                  <input
                    type="url"
                    value={googleUrl}
                    onChange={(e) => setGoogleUrl(e.target.value)}
                    className="flex-[1_0_0] font-['Poppins'] text-[16px] text-[#141b2b] bg-transparent outline-none"
                  />
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[12px]">
                  <p className="leading-[16px]">Customers who leave 4–5 stars will be directed here.</p>
                </div>
              </div>

              {/* Category */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                  <p className="leading-[20px]">Business Category</p>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full font-['Poppins'] text-[16px] text-[#141b2b] outline-none focus:border-[#7c3aed] appearance-none cursor-pointer"
                >
                  <option>Cafe / Coffee Shop</option>
                  <option>Restaurant</option>
                  <option>Retail Store</option>
                  <option>Salon / Beauty</option>
                  <option>Health & Wellness</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Address */}
              <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                  <p className="leading-[20px]">Address</p>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full font-['Poppins'] text-[16px] text-[#141b2b] outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[rgba(124,58,237,0.1)]"
                />
              </div>

              {/* Phone & Website row */}
              <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 flex-[1_0_0]">
                  <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                    <p className="leading-[20px]">Phone</p>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full font-['Poppins'] text-[16px] text-[#141b2b] outline-none focus:border-[#7c3aed]"
                  />
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 flex-[1_0_0]">
                  <label className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px]">
                    <p className="leading-[20px]">Website</p>
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center px-[16px] py-[12px] relative rounded-[8px] shrink-0 w-full font-['Poppins'] text-[16px] text-[#141b2b] outline-none focus:border-[#7c3aed]"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0 w-full pt-[8px] border-t border-[#ececf2] border-solid">
              <button
                onClick={handleSave}
                className={`content-stretch flex items-center gap-[8px] px-[24px] py-[12px] relative rounded-[8px] shrink-0 cursor-pointer transition-all ${saved ? 'bg-[#16a34a]' : 'bg-[#630ed4] hover:bg-[#7c3aed]'}`}
              >
                {saved && (
                  <img alt="" className="shrink-0 size-[16px]" src={imgCheck} />
                )}
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-white text-[14px]">
                  <p className="leading-[20px]">{saved ? 'Saved!' : 'Save Changes'}</p>
                </div>
              </button>
            </div>
          </div>

          {/* QR Code Panel */}
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[340px]">
            <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] border border-[#ececf2] border-solid content-stretch flex flex-col gap-[24px] items-center p-[32px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[18px]">
                  <p className="leading-[28px]">Your QR Code</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[14px]">
                  <p className="leading-[20px]">Scan to collect reviews</p>
                </div>
              </div>

              {/* QR Code Display */}
              <div className="bg-white border border-[#ececf2] border-solid content-stretch flex flex-col gap-[16px] items-center p-[24px] relative rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0 w-full">
                <div className="relative shrink-0 size-[200px] overflow-hidden rounded-[8px]">
                  <img alt="QR Code for Artisan Cafe" className="absolute inset-0 size-full object-contain" src={imgQrCode} />
                </div>
                <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full">
                  <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[14px] text-center">
                    <p className="leading-[20px]">Artisan Cafe</p>
                  </div>
                  <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[12px] text-center">
                    <p className="leading-[16px]">Scan to share your experience</p>
                  </div>
                </div>
              </div>

              {/* QR Actions */}
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
                <button className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 flex-1 bg-[rgba(99,14,212,0.06)] hover:bg-[rgba(99,14,212,0.1)] cursor-pointer transition-colors">
                  <img alt="" className="shrink-0 size-[20px]" src={imgDownload} />
                  <span className="font-['Poppins'] text-[12px] font-semibold text-[#630ed4]">Download</span>
                </button>
                <button className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 flex-1 bg-[rgba(99,14,212,0.06)] hover:bg-[rgba(99,14,212,0.1)] cursor-pointer transition-colors">
                  <img alt="" className="shrink-0 size-[20px]" src={imgShare} />
                  <span className="font-['Poppins'] text-[12px] font-semibold text-[#630ed4]">Share</span>
                </button>
                <button className="content-stretch flex flex-col gap-[4px] items-center justify-center p-[12px] relative rounded-[8px] shrink-0 flex-1 bg-[rgba(99,14,212,0.06)] hover:bg-[rgba(99,14,212,0.1)] cursor-pointer transition-colors">
                  <img alt="" className="shrink-0 size-[20px]" src={imgPrint} />
                  <span className="font-['Poppins'] text-[12px] font-semibold text-[#630ed4]">Print</span>
                </button>
              </div>
            </div>

            {/* Review Link Card */}
            <div className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] border border-[#ececf2] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[16px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full">
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[16px]">
                <p className="leading-[24px]">Review Link</p>
              </div>
              <div className="bg-[#f8f8fc] border border-[#ccc3d8] border-solid content-stretch flex items-center gap-[8px] px-[12px] py-[10px] relative rounded-[8px] shrink-0 w-full">
                <img alt="" className="shrink-0 size-[16px]" src={imgLink} />
                <span className="font-['Poppins'] text-[12px] text-[#4a4455] flex-[1_0_0] truncate">reviewai.app/r/artisan-cafe</span>
                <button className="shrink-0">
                  <img alt="" className="size-[16px]" src={imgEditIcon} />
                </button>
              </div>
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[12px]">
                <p className="leading-[16px]">Share this link directly with customers via SMS, email, or social media.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
