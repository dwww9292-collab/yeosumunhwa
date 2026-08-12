import { Link } from "react-router-dom";

export default function TicketCTA() {
  return (
    <section className="py-16 md:py-20 bg-background-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="mb-6">
          <p className="text-sm text-accent-500 font-bold mb-2">지금 양주에서는</p>
          <h2 className="text-2xl md:text-3xl font-bold text-accent-500">공연/전시 예매</h2>
        </div>
        <div className="mb-8">
          <p className="text-lg md:text-xl font-bold text-foreground-950 mb-2">
            <span className="text-primary-500">#Concert</span>{" "}
            <span className="text-primary-500">#Performance</span>{" "}
            <span className="text-primary-500">#Exhibition</span>
          </p>
          <p className="text-foreground-600">
            현재 진행중인 공연 또는 전시를 예매하실 수 있습니다.
          </p>
        </div>
        <Link
          to="/business/performance"
          className="inline-flex items-center gap-2 bg-primary-500 text-white px-10 py-4 rounded text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
        >
          <i className="ri-ticket-line"></i>예매하러 가기
        </Link>
      </div>
    </section>
  );
}