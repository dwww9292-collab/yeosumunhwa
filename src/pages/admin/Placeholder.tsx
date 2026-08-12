export default function AdminPlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
      <p className="text-sm text-gray-500 mb-8">{phase} 에서 구현 예정입니다.</p>
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
        <i className="ri-tools-line text-3xl"></i>
        <p className="mt-3 text-sm">준비 중인 기능입니다.</p>
      </div>
    </div>
  );
}
