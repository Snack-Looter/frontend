"use client";

import { useEffect, useState } from "react";
import type { SignupData } from "@/app/register/page";
import {
  getCities,
  getKoperasiList,
  getProvinces,
  type City,
  type Koperasi,
  type Province,
} from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { SelectField } from "@/components/ui/SelectField";
import { PushButton } from "@/components/ui/PushButton";

export function Step3Koperasi({
  data,
  onChange,
  errors,
  onNext,
  onBack,
}: {
  data: SignupData;
  onChange: (patch: Partial<SignupData>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [koperasiList, setKoperasiList] = useState<Koperasi[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingKoperasi, setLoadingKoperasi] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch(() => setLoadError("Gagal memuat daftar provinsi. Coba muat ulang halaman."))
      .finally(() => setLoadingProvinces(false));
  }, []);

  function handleProvinceChange(id: number) {
    const province = provinces.find((p) => p.province_id === id);
    onChange({
      provinceId: id,
      provinceName: province?.province_name ?? "",
      cityId: null,
      cityName: "",
      koperasiId: null,
      koperasiName: "",
    });
    setCities([]);
    setKoperasiList([]);
    setLoadingCities(true);
    getCities(id)
      .then(setCities)
      .catch(() => setLoadError("Gagal memuat daftar kota."))
      .finally(() => setLoadingCities(false));
  }

  function handleCityChange(id: number) {
    const city = cities.find((c) => c.city_id === id);
    onChange({ cityId: id, cityName: city?.city_name ?? "", koperasiId: null, koperasiName: "" });
    setKoperasiList([]);
    setLoadingKoperasi(true);
    getKoperasiList(id)
      .then(setKoperasiList)
      .catch(() => setLoadError("Gagal memuat daftar koperasi."))
      .finally(() => setLoadingKoperasi(false));
  }

  function handleKoperasiChange(id: number) {
    const kop = koperasiList.find((k) => k.koperasi_id === id);
    onChange({ koperasiId: id, koperasiName: kop?.koperasi_name ?? "" });
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!data.koperasiId) return;
    onNext();
  }

  return (
    <form onSubmit={handleNext}>
      <Card animate className="flex flex-col gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="font-body text-label text-neutral hover:text-primary transition-colors mb-2"
          >
            ← Kembali
          </button>
          <h2 className="font-display text-title text-ink">Koperasi kamu yang mana?</h2>
          <p className="font-body text-body text-ink-soft mt-1">
            Satu akun cuma bisa terhubung ke satu koperasi.
          </p>
        </div>

        <SelectField
          label="Provinsi"
          value={data.provinceId ?? ""}
          onChange={handleProvinceChange}
          loading={loadingProvinces}
          placeholder="Pilih provinsi"
          options={provinces.map((p) => ({ value: p.province_id, label: p.province_name }))}
        />

        <SelectField
          label="Kabupaten/Kota"
          value={data.cityId ?? ""}
          onChange={handleCityChange}
          loading={loadingCities}
          disabled={!data.provinceId}
          placeholder={data.provinceId ? "Pilih kota" : "Pilih provinsi dulu"}
          options={cities.map((c) => ({ value: c.city_id, label: c.city_name }))}
          emptyMessage={data.provinceId ? "Belum ada kota terdaftar di provinsi ini." : undefined}
        />

        <SelectField
          label="Nama Koperasi"
          value={data.koperasiId ?? ""}
          onChange={handleKoperasiChange}
          loading={loadingKoperasi}
          disabled={!data.cityId}
          placeholder={data.cityId ? "Pilih koperasi" : "Pilih kota dulu"}
          options={koperasiList.map((k) => ({ value: k.koperasi_id, label: k.koperasi_name }))}
          error={errors.koperasi_id}
          emptyMessage={data.cityId ? "Belum ada koperasi terdaftar di kota ini." : undefined}
        />

        {loadError && <p className="font-body text-label text-danger">{loadError}</p>}

        <PushButton type="submit" disabled={!data.koperasiId} className="w-full mt-1">
          Lanjut
        </PushButton>
      </Card>
    </form>
  );
}
