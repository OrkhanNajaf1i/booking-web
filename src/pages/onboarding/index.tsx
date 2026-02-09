import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { authStore } from '../../features/auth/model/auth.store';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [businessType, setBusinessType] = useState<'solo' | 'multi' | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!businessName.trim()) return;

    setLoading(true);
    // Fake API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Yeni business ID yarat
    const newBusinessId = `biz_${Date.now()}`;
    
    // Mock: İstifadəçiyə bu business-i əlavə et
    // const user = authStore.getUser();
    // if (user) {
    //   user.businessIds.push(newBusinessId);
    //   localStorage.setItem('currentUser', JSON.stringify(user));
    // }

    // Dashboard-a yönləndir
    navigate(`/business/${newBusinessId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Başlıq */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            İlk biznesinizi yaradın 🚀
          </h1>
          <p className="text-gray-600">
            Rezervasiya sistemini qurmaq üçün bir neçə addım qalıb
          </p>
        </div>

        {/* Addım 1: Business növü seçimi */}
        {!businessType && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Solo Business */}
            <button
              onClick={() => setBusinessType('solo')}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                👤
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Solo Business
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tək filial. Saç salonu, klinika, məşqçi və s.
              </p>
              <div className="text-sm font-medium text-blue-600 group-hover:underline">
                Bu variant seç →
              </div>
            </button>

            {/* Multi Business */}
            <button
              onClick={() => setBusinessType('multi')}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                🏢
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Multi-Location
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Bir neçə filial. Şəbəkə restoranları, klinikalar və s.
              </p>
              <div className="text-sm font-medium text-blue-600 group-hover:underline">
                Bu variant seç →
              </div>
            </button>
          </div>
        )}

        {/* Addım 2: Business adı */}
        {businessType && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <button
              onClick={() => setBusinessType(null)}
              className="mb-6 text-sm text-gray-500 hover:text-gray-700"
            >
              ← Geri
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {businessType === 'solo' ? 'Solo Business' : 'Multi-Location'} yaradırsınız
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biznesin adı
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Məs: Elit Saç Salonu"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={!businessName.trim() || loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Yaradılır...' : 'Biznesi yarat və başla'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
