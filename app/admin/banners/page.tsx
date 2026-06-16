import { getBanners } from "@/lib/db";
import BannerManager from "@/components/admin/BannerManager";

export default function AdminBannersPage() {
  const banners = getBanners().sort((a, b) => a.order - b.order);

  return (
    <div>
      <h1 className="font-serif text-3xl text-brand-brownDark mb-2">Promo Banners</h1>
      <p className="text-brand-brown/70 mb-8">
        Active banners appear in the offer/promotion sections on the Home page.
      </p>
      <BannerManager initialBanners={banners} />
    </div>
  );
}
