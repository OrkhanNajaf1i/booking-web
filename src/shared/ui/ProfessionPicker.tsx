/**
 * Peşə seçimi — sabit siyahı, amma öz sözü ilə yazmaq da olur.
 *
 * İki sahə birlikdə işləyir və birini digərindən ayırmaq olmur:
 *
 * - **Kateqoriya** (`category_slug`) sabit siyahıdandır və məcburidir.
 *   Müştəri tərəfdəki qruplaşdırma yalnız buna baxır. Sərbəst mətnə
 *   güvənsək, "berber"i səhv yazan biznes heç bir kateqoriyada
 *   tapılmır.
 * - **Peşə adı** (`service_category`) istəyə bağlıdır və istifadəçinin
 *   öz sözüdür ("Uşaq kardioloqu"). Kartda adın altında görünür,
 *   çünki kateqoriya adından daha məlumatlıdır.
 *
 * Ona görə yazmaq sərbəstdir, qruplaşdırma isə deyil: adam istədiyini
 * yaza bilir, amma hansı sahəyə aid olduğunu da göstərir.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronDown, Pencil } from 'lucide-react';

import { categoryApi } from '@/entities/catalog/api/categoryApi';

export interface ProfessionValue {
  /** Sabit kateqoriya slug-ı */
  categorySlug: string;
  /** İstifadəçinin öz yazdığı peşə adı (boş ola bilər) */
  customName: string;
}

interface Props {
  value: ProfessionValue;
  onChange: (next: ProfessionValue) => void;
}

/** Azərbaycan hərflərini ASCII-yə endirir ki, "dis" yazan "Diş"i tapsın. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u');
}

export function ProfessionPicker({ value, onChange }: Props) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['catalog', 'categories', 'all'],
    queryFn: categoryApi.listAll,
    // Taksonomiya nadir hallarda dəyişir.
    staleTime: 60 * 60 * 1000,
  });

  const selected = categories.find((item) => item.slug === value.categorySlug);

  // Sahədə görünən mətn: öz yazdığı varsa o, yoxsa seçilmiş kateqoriya.
  const [query, setQuery] = useState(value.customName || selected?.name || '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Kateqoriyalar sonra yüklənə bilər — ad gələndə sahəni doldururuq,
  // amma istifadəçi artıq yazıbsa toxunmuruq.
  useEffect(() => {
    if (!query && selected) setQuery(selected.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.slug]);

  // Kənara klik siyahını bağlayır.
  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  const matches = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return categories;
    return categories.filter((item) => normalize(item.name).includes(needle));
  }, [categories, query]);

  /** Yazılan mətn sabit adlardan birinə tam uyğundurmu. */
  const exactMatch = categories.find(
    (item) => normalize(item.name) === normalize(query.trim()),
  );

  const isCustom = query.trim().length > 0 && !exactMatch;

  const pick = (slug: string, name: string) => {
    setQuery(name);
    setOpen(false);
    // Siyahıdan seçim öz yazdığını əvəz edir.
    onChange({ categorySlug: slug, customName: '' });
  };

  const handleTyping = (text: string) => {
    setQuery(text);
    setOpen(true);

    const match = categories.find(
      (item) => normalize(item.name) === normalize(text.trim()),
    );

    if (match) {
      onChange({ categorySlug: match.slug, customName: '' });
      return;
    }

    // Siyahıdan seçilmiş addan öz yazısına keçəndə köhnə sahəni
    // saxlamırıq: "Diş həkimi" seçib sonra "Ürək cərrahı" yazan adam
    // səssizcə diş həkimləri arasında qalardı. Onsuz da öz yazısını
    // davam etdirirsə (artıq customName var) seçdiyi bölmə qalır —
    // hər hərfdə yenidən soruşmaq mənasızdır.
    const wasCustom = value.customName.length > 0;

    onChange({
      categorySlug: wasCustom ? value.categorySlug : '',
      customName: text.trim(),
    });
  };

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <input
          value={query}
          onChange={(event) => handleTyping(event.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={isLoading ? 'Yüklənir…' : 'Peşənizi seçin və ya yazın'}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen((previous) => !previous)}
          className="absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400"
        >
          <ChevronDown size={16} />
        </button>

        {open && (
          <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {matches.map((item) => (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => pick(item.slug, item.name)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span>{item.name}</span>
                  {item.slug === value.categorySlug && !isCustom && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </button>
              </li>
            ))}

            {matches.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500">
                Siyahıda belə peşə yoxdur — yazdığınız saxlanacaq.
              </li>
            )}
          </ul>
        )}
      </div>

      {/*
        Öz sözü ilə yazıbsa sahəni ayrıca soruşuruq. Yazı kartda
        görünür, qruplaşdırma isə seçilən sahəyə görə gedir — belə
        olmasa hər fərqli yazılış ayrı kateqoriya yaradardı.
      */}
      {isCustom && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="flex items-start gap-1.5 text-xs text-amber-900">
            <Pencil size={12} className="mt-0.5 shrink-0" />
            <span>
              <strong>«{query.trim()}»</strong> sizin peşəniz kimi
              yazılacaq. Müştərinin sizi hansı bölmədə tapacağını da
              seçin:
            </span>
          </p>

          <select
            value={value.categorySlug}
            onChange={(event) =>
              onChange({ categorySlug: event.target.value, customName: query.trim() })
            }
            className="mt-2 w-full rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">Bölmə seçin</option>
            {categories.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
