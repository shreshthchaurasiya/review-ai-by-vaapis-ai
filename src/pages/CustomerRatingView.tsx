import { useState } from "react";

const imgLogo = "https://www.figma.com/api/mcp/asset/7178317d-ce94-4f5e-b01d-fcf279b385cd";
const imgStarEmpty = "https://www.figma.com/api/mcp/asset/562bc729-92bc-412e-8ad5-ccc1d93843f4";
const imgLock = "https://www.figma.com/api/mcp/asset/f6fa0ada-c6c4-4251-8c58-88a459fb3218";

export default function CustomerRatingView() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating) {
      setSubmitted(true);
    }
  };

  return (
    <div className="content-stretch flex flex-col gap-[0.001px] items-center justify-center relative size-full min-h-screen" data-node-id="1:689" style={{ backgroundImage: "linear-gradient(90deg, rgb(249, 249, 255) 0%, rgb(249, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Customer Rating View">
      <div className="absolute bg-[#630ed4] blur-[30px] left-0 opacity-15 rounded-[150px] size-[300px] top-0" data-node-id="1:690" data-name="Background Decor" />
      <div className="absolute bg-[#6e3aca] blur-[30px] bottom-0 opacity-15 right-0 rounded-[150px] size-[300px]" data-node-id="1:691" data-name="Background+Blur" />
      <div className="content-stretch flex flex-col items-center max-w-[448px] px-[16px] relative shrink-0 w-full" data-node-id="1:692" data-name="Main Content Canvas (Mobile Focused)">
        {/* Header - Logo Section */}
        <div className="content-stretch flex flex-col items-start pb-[48px] relative shrink-0" data-node-id="1:693">
          <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0" data-node-id="1:694">
            <div className="bg-white content-stretch flex items-center justify-center p-[12px] relative rounded-[9999px] shrink-0 size-[80px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-node-id="1:695">
              <div className="flex-[1_0_0] h-full min-w-px relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="ReviewAI Logo" className="absolute h-[54.49%] left-0 max-w-none top-[22.75%] w-full object-contain" src={imgLogo} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="1:698">
              <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#6e3aca] text-[12px] text-center tracking-[1.2px] uppercase whitespace-nowrap">
                <p className="leading-[14.4px]">REVIEWAI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="content-stretch flex flex-col items-start pb-[48px] relative shrink-0 w-full" data-node-id="1:700">
          <div className="backdrop-blur-[6px] bg-[rgba(255,255,255,0.7)] border border-[rgba(255,255,255,0.3)] border-solid content-stretch flex flex-col items-center px-[25px] py-[41px] relative rounded-[32px] shrink-0 w-full shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]" data-node-id="1:701">
            {submitted ? (
              <div className="content-stretch flex flex-col items-center gap-[16px] relative shrink-0 w-full py-[24px]">
                <div className="text-[64px]">🎉</div>
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[28px] text-center tracking-[-0.32px]">
                  <p className="leading-[36px]">Thank you!</p>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] text-center">
                  <p className="leading-[25.6px]">Your feedback means the world to us.</p>
                </div>
                {selectedRating !== null && selectedRating >= 4 && (
                  <div className="mt-[16px] bg-[#630ed4] content-stretch flex items-center justify-center px-[24px] py-[14px] relative rounded-[9999px] shrink-0 w-full cursor-pointer">
                    <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-white text-[16px]">
                      <p className="leading-[24px]">Leave a Google Review →</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Heading */}
                <div className="mb-[-0.1px] relative shrink-0" data-node-id="1:703">
                  <div className="content-stretch flex flex-col items-start pb-[16px] relative size-full">
                    <div className="content-stretch flex flex-col items-center pl-[41.8px] pr-[41.81px] relative shrink-0" data-node-id="1:704">
                      <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[32px] text-center tracking-[-0.32px] whitespace-nowrap" data-node-id="1:705">
                        <p className="leading-[40px] mb-0">How was your</p>
                        <p className="leading-[40px] mb-0">experience at</p>
                        <p>
                          <span className="[word-break:break-word] font-['Poppins'] font-bold leading-[40px] not-italic text-[#630ed4]">Artisan Brew</span>
                          <span className="leading-[40px]">?</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtitle */}
                <div className="h-[91.19px] max-w-[280px] mb-[-0.1px] relative shrink-0 w-[280px]" data-node-id="1:706">
                  <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="1:707">
                    <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#4a4455] text-[16px] text-center whitespace-nowrap">
                      <p className="leading-[25.6px] mb-0">Your feedback helps us grow and</p>
                      <p className="leading-[25.6px]">provide better service to you.</p>
                    </div>
                  </div>
                </div>

                {/* Star Selector */}
                <div className="mb-[-0.1px] relative shrink-0" data-node-id="1:709">
                  <div className="content-stretch flex flex-col items-start pb-[24px] relative size-full">
                    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="1:710">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className="content-stretch flex flex-col items-center justify-center pb-[11px] pt-[4px] px-[4px] relative shrink-0 transition-transform hover:scale-110"
                        >
                          <div className="h-[38px] relative shrink-0 w-[40px]">
                            {selectedRating !== null && star <= selectedRating ? (
                              <span className="text-[32px] leading-[38px] block text-center">⭐</span>
                            ) : (
                              <img alt={`${star} star`} className="absolute block inset-0 max-w-none size-full" src={imgStarEmpty} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Textarea */}
                <div className="mb-[-0.1px] relative shrink-0 w-full" data-node-id="1:726">
                  <div className="content-stretch flex flex-col items-start pb-[31px] relative size-full">
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={"Tell us more about your \nexperience..."}
                      className="bg-[#f1f3ff] content-stretch flex items-start justify-center overflow-auto py-[15.295px] px-[16px] relative rounded-[12px] shadow-[0px_0px_0px_1px_rgba(204,195,216,0.3)] shrink-0 w-full min-h-[100px] resize-none font-['Poppins'] text-[16px] text-[rgba(123,116,135,0.6)] leading-[25.6px] border-none outline-none"
                    />
                  </div>
                </div>

                {/* CTA / helper text */}
                {!selectedRating ? (
                  <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#630ed4] text-[14px] text-center whitespace-nowrap" data-node-id="1:730">
                    <p className="leading-[16.8px]">Select a rating to continue</p>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-[#630ed4] content-stretch flex items-center justify-center px-[24px] py-[14px] relative rounded-[9999px] shrink-0 w-full cursor-pointer hover:bg-[#7c3aed] transition-colors"
                  >
                    <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-white text-[16px]">
                      <p className="leading-[24px]">Submit Feedback</p>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer - Contextual Help */}
        <div className="content-stretch flex flex-col gap-[24px] items-center opacity-60 relative shrink-0 w-full" data-node-id="1:731">
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="1:732">
            <div className="h-[15px] relative shrink-0 w-[12px]" data-node-id="1:733">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLock} />
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[12px] tracking-[0.24px] whitespace-nowrap" data-node-id="1:736">
              <p className="leading-[14.4px]">{`Verified & Secure Feedback`}</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="1:737">
            <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[12px] tracking-[0.24px] whitespace-nowrap cursor-pointer hover:underline" data-node-id="1:739">
              <p className="leading-[14.4px]">Terms</p>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[12px] tracking-[0.24px] whitespace-nowrap cursor-pointer hover:underline" data-node-id="1:741">
              <p className="leading-[14.4px]">Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="content-stretch flex flex-col items-center pt-[48px] pb-[16px] relative shrink-0 w-full" data-node-id="1:742">
        <div className="content-stretch flex flex-col items-center opacity-40 relative shrink-0 w-full" data-node-id="1:743">
          <div className="[word-break:break-word] flex flex-col font-['Poppins'] justify-center leading-[0] not-italic relative shrink-0 text-[#141b2b] text-[11px] text-center tracking-[0.275px] uppercase whitespace-nowrap" data-node-id="1:745">
            <p className="leading-[16.5px]">POWERED BY ADSHREE INC.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
