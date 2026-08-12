import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import NoticePage from "../pages/community/notice/page";
import NewsPage from "../pages/community/news/page";
import ArchivePage from "../pages/community/archive/page";
import DataPage from "../pages/community/data/page";
import CommunityDetail from "../pages/community/CommunityDetail";
import RentStatusPage from "../pages/rent/status/page";
import RentSpacePage from "../pages/rent/space/page";
import BusinessPage from "../pages/business/page";
import PerformancePage from "../pages/business/performance/page";
import ExhibitionPage from "../pages/business/exhibition/page";
import FestivalPage from "../pages/business/festival/page";
import EventDetail from "../pages/business/EventDetail";
import BusinessDetail from "../pages/business/BusinessDetail";
import GreetingPage from "../pages/introduce/greeting/page";
import EstablishmentPage from "../pages/introduce/establishment/page";
import OrganizationPage from "../pages/introduce/organization/page";
import CIPage from "../pages/introduce/ci/page";
import PhilosophyPage from "../pages/introduce/philosophy/page";
import AnnouncePage from "../pages/introduce/announce/page";
import AnnounceDetail from "../pages/introduce/announce/detail";
import LocationPage from "../pages/introduce/location/page";
import AdminLogin from "../pages/admin/login/page";
import AdminLayout from "../pages/admin/layout";
import AdminDashboard from "../pages/admin/dashboard/page";
import AdminEvents from "../pages/admin/events/page";
import AdminPrograms from "../pages/admin/programs/page";
import AdminHero from "../pages/admin/hero/page";
import AdminRentals from "../pages/admin/rentals/page";
import AdminMembers from "../pages/admin/members/page";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import RequireAuth from "../features/auth/RequireAuth";
import MemberLogin from "../pages/member/login/page";
import MemberSignup from "../pages/member/signup/page";
import MemberResetRequest from "../pages/member/reset/page";
import ResetPassword from "../pages/reset-password/page";
import RentApply from "../pages/rent/apply/page";
import MyPage from "../pages/mypage/page";
import PolicyPage from "../pages/policy/page";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/community/notice", element: <NoticePage /> },
  { path: "/community/notice/:id", element: <CommunityDetail board="notice" /> },
  { path: "/community/news", element: <NewsPage /> },
  { path: "/community/news/:id", element: <CommunityDetail board="news" /> },
  { path: "/community/archive", element: <ArchivePage /> },
  { path: "/community/archive/:id", element: <CommunityDetail board="archive" /> },
  { path: "/community/data", element: <DataPage /> },
  { path: "/community/data/:id", element: <CommunityDetail board="data" /> },
  { path: "/rent/status", element: <RentStatusPage /> },
  { path: "/rent/space", element: <RentSpacePage /> },
  { path: "/rent/apply", element: <RequireAuth><RentApply /></RequireAuth> },

  // ---- 회원 ----
  { path: "/member/login", element: <MemberLogin /> },
  { path: "/member/signup", element: <MemberSignup /> },
  { path: "/member/reset", element: <MemberResetRequest /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/mypage", element: <RequireAuth><MyPage /></RequireAuth> },
  { path: "/business", element: <BusinessPage /> },
  { path: "/business/performance", element: <PerformancePage /> },
  { path: "/business/performance/:id", element: <EventDetail type="performance" /> },
  { path: "/business/exhibition", element: <ExhibitionPage /> },
  { path: "/business/exhibition/:id", element: <EventDetail type="exhibition" /> },
  { path: "/business/festival", element: <FestivalPage /> },
  { path: "/business/festival/:id", element: <EventDetail type="festival" /> },
  { path: "/business/:id", element: <BusinessDetail /> },
  { path: "/introduce/greeting", element: <GreetingPage /> },
  { path: "/introduce/establishment", element: <EstablishmentPage /> },
  { path: "/introduce/organization", element: <OrganizationPage /> },
  { path: "/introduce/ci", element: <CIPage /> },
  { path: "/introduce/philosophy", element: <PhilosophyPage /> },
  { path: "/introduce/announce", element: <AnnouncePage /> },
  { path: "/introduce/announce/:id", element: <AnnounceDetail /> },
  { path: "/introduce/location", element: <LocationPage /> },

  // ---- 이용안내(정책) ----
  { path: "/policy/:slug", element: <PolicyPage /> },

  // ---- 관리자 영역 ----
  { path: "/admin/login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "events", element: <AdminEvents /> },
      { path: "programs", element: <AdminPrograms /> },
      { path: "hero", element: <AdminHero /> },
      { path: "rentals", element: <AdminRentals /> },
      {
        path: "members",
        element: (
          <ProtectedRoute role="super_admin">
            <AdminMembers />
          </ProtectedRoute>
        ),
      },
    ],
  },

  { path: "*", element: <NotFound /> },
];

export default routes;