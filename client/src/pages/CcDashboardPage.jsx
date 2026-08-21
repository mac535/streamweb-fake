import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import StockManagementModal from "../components/expert/StockManagementModal";

export default function CcDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showStockModal, setShowStockModal] = useState(false);

  const ccCode = user?.username || user?.brcCode;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!ccCode) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl max-w-md">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">No Creative Corner Assigned</h2>
          <p className="text-secondary mb-6">This account does not have a Creative Corner code assigned.</p>
          <button onClick={handleLogout} className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#fdfbf7] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-on-surface/10 shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-on-surface/10">
          <h1
            className="text-2xl tracking-wider text-amber-600"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Creative Corner
          </h1>
          <p className="text-xs font-mono text-secondary mt-1">{ccCode}</p>
        </div>

        <nav className="flex-grow p-4">
          <div className="bg-amber-100 text-amber-700 rounded-xl px-4 py-3 flex items-center gap-3 font-bold text-sm">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            Dashboard
          </div>
        </nav>

        <div className="p-4 border-t border-on-surface/10">
          <div className="mb-4 px-2">
            <p className="text-sm font-bold text-on-surface truncate">{user?.schoolName || ccCode}</p>
            <p className="text-xs text-secondary">{user?.district}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-surface-container-low hover:bg-surface-container text-on-surface font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="w-full h-16 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:hidden border-b border-on-surface/10 shrink-0 sticky top-0 z-30">
          <h1 className="text-lg tracking-wider text-amber-600" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Creative Corner
          </h1>
          <button onClick={handleLogout} className="p-2 hover:bg-surface-container rounded-xl">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 md:px-20 space-y-6 max-w-[1280px] mx-auto w-full">
            {/* School Info Card */}
            <div className="bg-surface-container-low border border-on-surface/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-secondary font-mono">{ccCode}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase tracking-widest">SCHOOL</span>
                </div>
                <h2
                  className="text-3xl md:text-4xl text-on-surface tracking-wide mb-1"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1.2 }}
                >
                  {user?.schoolName || ccCode}
                </h2>
                <p className="text-secondary flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {user?.district}
                </p>
              </div>
            </div>

            {/* Tools */}
            <section>
              <h2
                className="text-2xl border-l-4 border-amber-500 pl-4 tracking-wide mb-4"
                style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1.3 }}
              >
                Management Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setShowStockModal(true)}
                  className="group bg-white border border-on-surface/10 rounded-xl p-5 flex flex-col shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-2xl">inventory_2</span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface tracking-tight leading-tight">Stock Management</h3>
                  </div>
                  <p className="text-secondary text-sm flex-grow">Manage and update your Creative Corner stock inventory.</p>
                  <div className="mt-4 pt-4 border-t border-on-surface/5 flex items-center justify-between text-amber-600 group-hover:text-amber-700 transition-colors">
                    <span className="text-sm font-bold uppercase tracking-wider">Manage Stock</span>
                    <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Stock Management Modal */}
      {showStockModal && ccCode && (
        <StockManagementModal
          brcCode={ccCode}
          brcName={user?.schoolName || ccCode}
          onClose={() => setShowStockModal(false)}
          isViewOnly={false}
        />
      )}
    </div>
  );
}
