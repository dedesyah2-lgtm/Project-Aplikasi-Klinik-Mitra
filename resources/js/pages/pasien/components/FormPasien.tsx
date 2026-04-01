import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pasien } from "@/types";
import { EditIcon, Printer } from "lucide-react";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";
import { toast } from "sonner";
import axios from "axios";

interface FormPasienProps {
  pasien?: Pasien;
}

const FormPasien = ({ pasien }: FormPasienProps) => {
  const [open, setOpen] = useState(false);
  const [nikError, setNikError] = useState("");
  const [checkingNik, setCheckingNik] = useState(false);
  const [isPasienLama, setIsPasienLama] = useState(false);

  const lastCheckedNik = useRef("");
  const lastToastNik = useRef("");

  const { data, setData, post, put, processing, errors, reset, clearErrors } =
    useForm({
      nama_lengkap: pasien?.nama_lengkap || "",
      alamat: pasien?.alamat || "",
      nomor_telepon: pasien?.nomor_telepon || "",
      jenis_kelamin: pasien?.jenis_kelamin || "",
      tanggal_lahir: pasien?.tanggal_lahir || "",
      golongan_darah: pasien?.golongan_darah || "",
      pekerjaan: pasien?.pekerjaan || "",
      nomor_ktp: pasien?.nomor_ktp || "",
    });

  // =========================
  // Helper: validasi format NIK
  // =========================
  const isValidNikFormat = (nik: string) => /^\d{16}$/.test(nik);

  // =========================
  // Helper: parse NIK -> tanggal lahir & jenis kelamin
  // =========================
  const parseNik = (nik: string) => {
    if (!isValidNikFormat(nik)) return null;

    const tglPart = nik.substring(6, 8);
    const blnPart = nik.substring(8, 10);
    const thnPart = nik.substring(10, 12);

    let day = parseInt(tglPart, 10);
    const month = parseInt(blnPart, 10);
    const year2 = parseInt(thnPart, 10);

    let gender = "Laki-laki";

    if (day > 40) {
      gender = "Perempuan";
      day -= 40;
    }

    const currentYear = new Date().getFullYear() % 100;
    const fullYear = year2 <= currentYear ? 2000 + year2 : 1900 + year2;

    // validasi tanggal dasar
    const testDate = new Date(fullYear, month - 1, day);
    const isValidDate =
      testDate.getFullYear() === fullYear &&
      testDate.getMonth() === month - 1 &&
      testDate.getDate() === day;

    if (!isValidDate) return null;

    const tanggalLahir = `${fullYear}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return {
      tanggal_lahir: tanggalLahir,
      jenis_kelamin: gender,
    };
  };

  // =========================
  // Reset helper
  // =========================
  const resetLocalState = () => {
    setNikError("");
    setCheckingNik(false);
    setIsPasienLama(false);
    lastCheckedNik.current = "";
    lastToastNik.current = "";
  };

  // =========================
  // Auto parsing dari NIK
  // =========================
  useEffect(() => {
    if (pasien) return; // mode edit tidak perlu auto parse

    const nik = data.nomor_ktp;

    if (!nik) {
      setNikError("");
      setIsPasienLama(false);
      setCheckingNik(false);
      lastCheckedNik.current = "";
      lastToastNik.current = "";

      setData({
        nama_lengkap: "",
        alamat: "",
        nomor_telepon: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
        golongan_darah: "",
        pekerjaan: "",
        nomor_ktp: "",
      });

      return;
    }

    if (nik.length < 16) {
      setNikError("NIK harus 16 digit");
      setIsPasienLama(false);
      return;
    }

    if (!isValidNikFormat(nik)) {
      setNikError("Format NIK tidak valid");
      setIsPasienLama(false);
      return;
    }

    const parsed = parseNik(nik);

    if (!parsed) {
      setNikError("NIK tidak valid atau tanggal lahir tidak terbaca");
      setIsPasienLama(false);
      return;
    }

    setNikError("");

    // isi otomatis tanggal lahir & jenis kelamin dari NIK
    setData((prev) => ({
      ...prev,
      tanggal_lahir: parsed.tanggal_lahir,
      jenis_kelamin: parsed.jenis_kelamin,
    }));
  }, [data.nomor_ktp, pasien, setData]);

  // =========================
  // Auto cek pasien lama berdasarkan NIK
  // =========================
  useEffect(() => {
    if (pasien) return; // jangan cek saat mode edit

    const nik = data.nomor_ktp;

    if (!isValidNikFormat(nik)) return;
    if (lastCheckedNik.current === nik) return;

    const timeout = setTimeout(async () => {
      try {
        setCheckingNik(true);

        const response = await axios.get(`/data-pasien/cek-nik/${nik}`);
        const result = response.data;

        lastCheckedNik.current = nik;

        if (result.exists && result.data) {
          const pasienLama = result.data;

          setIsPasienLama(true);

          setData({
            nama_lengkap: pasienLama.nama_lengkap || "",
            alamat: pasienLama.alamat || "",
            nomor_telepon: pasienLama.nomor_telepon || "",
            jenis_kelamin: pasienLama.jenis_kelamin || "",
            tanggal_lahir: pasienLama.tanggal_lahir || "",
            golongan_darah: pasienLama.golongan_darah || "",
            pekerjaan: pasienLama.pekerjaan || "",
            nomor_ktp: pasienLama.nomor_ktp || nik,
          });

          if (lastToastNik.current !== nik) {
            toast.success("Pasien lama ditemukan, data otomatis terisi");
            lastToastNik.current = nik;
          }
        } else {
          setIsPasienLama(false);

          // kalau pasien baru, pertahankan hasil parse dari NIK
          const parsed = parseNik(nik);

          setData((prev) => ({
            ...prev,
            nama_lengkap: "",
            alamat: "",
            nomor_telepon: "",
            golongan_darah: "",
            pekerjaan: "",
            tanggal_lahir: parsed?.tanggal_lahir || prev.tanggal_lahir,
            jenis_kelamin: parsed?.jenis_kelamin || prev.jenis_kelamin,
            nomor_ktp: nik,
          }));

          if (lastToastNik.current !== nik) {
            toast.info("NIK belum terdaftar, silakan input pasien baru");
            lastToastNik.current = nik;
          }
        }
      } catch (error) {
        console.error("Gagal cek NIK:", error);
        toast.error("Gagal mengecek data pasien");
      } finally {
        setCheckingNik(false);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [data.nomor_ktp, pasien, setData]);

  // =========================
  // Submit
  // =========================
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidNikFormat(data.nomor_ktp)) {
      setNikError("Nomor KTP harus terdiri dari 16 digit angka");
      toast.error("Nomor KTP tidak valid");
      return;
    }

    if (isPasienLama && !pasien) {
      toast.error("NIK sudah terdaftar, gunakan data pasien lama yang tersedia");
      return;
    }

    if (pasien) {
      put(`/data-pasien/${pasien.id}`, {
        onSuccess: () => {
          setOpen(false);
          clearErrors();
          reset();
          resetLocalState();
          toast.success("Data pasien berhasil diperbarui");
        },
        onError: () => {
          toast.error("Terjadi kesalahan saat memperbarui data pasien");
        },
      });
    } else {
      post("/data-pasien", {
        onSuccess: () => {
          setOpen(false);
          clearErrors();
          reset();
          resetLocalState();
          toast.success("Data pasien berhasil disimpan");
        },
        onError: () => {
          toast.error("Terjadi kesalahan saat menyimpan data pasien");
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setOpen(state);

        if (!state) {
          clearErrors();
          resetLocalState();

          if (!pasien) {
            reset();
          }
        }
      }}
    >
  <div className="flex items-center gap-2">
  {pasien ? (
    <>
      {/* Tombol Edit = trigger modal */}
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl border-slate-200 text-slate-700 shadow-sm transition-all duration-200 hover:scale-105 hover:border-slate-300 hover:bg-slate-50 active:scale-95 cursor-pointer"
          title="Edit Data Pasien"
        >
          <EditIcon size={16} className="text-slate-700" />
        </Button>
      </DialogTrigger>

      {/* Tombol Print = tombol biasa */}
      <Button
        type="button"
        variant="outline"
        className="h-9 rounded-xl border-emerald-200 px-4 text-emerald-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 cursor-pointer"
        onClick={() => {
          window.open(`/pasien/${pasien.id}/cetak-kartu`, "_blank");
        }}
        title="Cetak Kartu Pasien"
      >
        <span className="flex items-center gap-2">
          <Printer size={16} />
          Print
        </span>
      </Button>
    </>
  ) : (
    <DialogTrigger asChild>
      <Button
        type="button"
        variant="default"
        className="h-10 rounded-xl bg-slate-900 px-5 text-white font-medium shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-800 active:scale-95 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg leading-none">+</span>
          Pasien Baru
        </span>
      </Button>
    </DialogTrigger>
  )}
</div>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {pasien ? "EDIT DATA PASIEN" : "TAMBAH PASIEN"}
          </DialogTitle>
          <DialogDescription className="italic">
            Lengkapi data pasien dengan benar dan lengkap.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nomor KTP / NIK</label>
            <Input
              value={data.nomor_ktp}
              onChange={(e) => {
                const onlyNumber = e.target.value.replace(/\D/g, "").slice(0, 16);
                setData("nomor_ktp", onlyNumber);
              }}
              inputMode="numeric"
              maxLength={16}
              placeholder="Masukkan 16 digit NIK"
              disabled={!!pasien}
            />

            {checkingNik && (
              <p className="text-xs text-slate-500">Mengecek data pasien...</p>
            )}

            {isPasienLama && !pasien && (
              <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                <p className="font-semibold">Pasien lama ditemukan ✅</p>
                <p>
                  Nama:{" "}
                  <span className="font-medium">{data.nama_lengkap || "-"}</span>
                </p>
                <p>
                  Tanggal lahir:{" "}
                  <span className="font-medium">{data.tanggal_lahir || "-"}</span>
                </p>
                <p>
                  Jenis kelamin:{" "}
                  <span className="font-medium">{data.jenis_kelamin || "-"}</span>
                </p>
              </div>
            )}

            {nikError && <p className="text-sm text-red-500">{nikError}</p>}

            <InputError message={errors.nomor_ktp} />
          </div>

          {/* Nama */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input
              value={data.nama_lengkap}
              onChange={(e) => setData("nama_lengkap", e.target.value)}
              placeholder="Masukkan nama lengkap"
              disabled={isPasienLama && !pasien}
              className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}
            />
            <InputError message={errors.nama_lengkap} />
          </div>

          {/* Tanggal lahir & Gol darah */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tanggal Lahir</label>
              <Input
                type="date"
                value={data.tanggal_lahir}
                onChange={(e) => setData("tanggal_lahir", e.target.value)}
                disabled={isPasienLama && !pasien}
                className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}
              />
              <InputError message={errors.tanggal_lahir} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Golongan Darah</label>
              <Select
                value={data.golongan_darah}
                onValueChange={(value) => setData("golongan_darah", value)}
                disabled={isPasienLama && !pasien}
              >
                <SelectTrigger className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}>
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "AB", "O"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <InputError message={errors.golongan_darah} />
            </div>
          </div>

          {/* Jenis kelamin */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <div className="flex gap-4">
              {["Laki-laki", "Perempuan"].map((jk) => (
                <label key={jk} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={jk}
                    checked={data.jenis_kelamin === jk}
                    onChange={(e) => setData("jenis_kelamin", e.target.value)}
                    disabled={isPasienLama && !pasien}
                  />
                  {jk}
                </label>
              ))}
            </div>
            <InputError message={errors.jenis_kelamin} />
          </div>

          {/* Telepon & pekerjaan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nomor Telepon</label>
              <Input
                value={data.nomor_telepon}
                onChange={(e) => setData("nomor_telepon", e.target.value)}
                placeholder="08xxxxxxxxxx"
                disabled={isPasienLama && !pasien}
                className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}
              />
              <InputError message={errors.nomor_telepon} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Pekerjaan</label>
              <Input
                value={data.pekerjaan}
                onChange={(e) => setData("pekerjaan", e.target.value)}
                placeholder="Masukkan pekerjaan"
                disabled={isPasienLama && !pasien}
                className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}
              />
              <InputError message={errors.pekerjaan} />
            </div>
          </div>

          {/* Alamat */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Alamat Lengkap</label>
            <Textarea
              value={data.alamat}
              onChange={(e) => setData("alamat", e.target.value)}
              placeholder="Masukkan alamat lengkap"
              disabled={isPasienLama && !pasien}
              className={isPasienLama && !pasien ? "bg-slate-50 text-slate-700" : ""}
            />
            <InputError message={errors.alamat} />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={processing || checkingNik}
          >
            {processing ? "Menyimpan..." : pasien ? "Update" : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormPasien;