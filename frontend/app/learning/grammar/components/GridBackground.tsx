// frontend/app/learning/grammar/components/GridBackground.tsx

export function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 基礎紫色網格 */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #a855f7 1px, transparent 1px),
            linear-gradient(to bottom, #a855f7 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* 左上方紫色發光體 */}
      <div
        className="absolute top-0 left-1/3 w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, #6366f120 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* 右下方紫色發光體 */}
      <div
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, #a855f715 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
}
