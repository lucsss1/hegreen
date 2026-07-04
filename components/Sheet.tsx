"use client";

export default function Sheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`fixed inset-0 z-[999] items-end justify-center sm:items-center ${
        open ? "flex" : "hidden"
      }`}
      style={{ background: "rgba(26,26,20,.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] bg-paper border-t-2 border-ink px-[18px] pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] sm:border-2 sm:mb-6">
        <div className="w-[30px] h-[2px] bg-rule2 mx-auto mb-[18px]" />
        {children}
      </div>
    </div>
  );
}
