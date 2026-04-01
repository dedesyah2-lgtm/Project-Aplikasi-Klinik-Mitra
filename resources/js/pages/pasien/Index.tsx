import CustomPagination from "@/components/custom-pagination";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";

import AppLayout from "@/layouts/app-layout";
import { handleChangePerPage } from "@/lib/utils";
import { BreadcrumbItem, Pasien } from "@/types";
import { Input} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Head, router, usePage } from "@inertiajs/react";
// import { log } from "console";
import { Printer, RefreshCcw, Search, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import FormPasien from "./components/FormPasien";
import { toast } from "sonner";

const breadcrumbs: BreadcrumbItem[] = [
{
 title: 'Data Pasien Klinik',
 href: '/data-pasien',
}
]

const index = () => {

  const { pasiens, filters }: any = usePage().props;
  const [search, setSearch] = useState(filters?.search || '');
  const meta = pasiens.meta;
  const path = meta.path;
  useEffect(()=>{
  console.log(pasiens);
  }, [])

  const searchData = (e: React.FormEvent) => {
    e.preventDefault();

    router.get(path, {
      search,
      today: filters?.today ? true : undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const clearSearch = () => {
    setSearch('');
    router.get(path, {}, {
      preserveState: true,
      replace: true,
    });
  };

  const filterToday = () => {
  router.get(path, {
    today: true,
    search: search || undefined,
  }, {
    preserveState: true,
    replace: true,
  });
  };
  
  const showAllData = () => {
  router.get(path, {
    search: search || undefined,
  }, {
    preserveState: true,
    replace: true,
  });
  };

  const printPdf = () => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (filters?.today) params.append("today", "1");

    const url = `/data-pasien/cetak/pdf?${params.toString()}`;

    window.open(url, "_blank");
  };

// useEffect(() => {
//   router.get(path, {
//     today: true
//   }, {
//     preserveState: true,
//     replace: true
//   });
// }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Data Pasien" />
      <div className='flex items-center gap-x-5 mb-1'>
        <select className='border rounded-md px-3 py-2' onChange={(e) => handleChangePerPage(parseInt(e.target.value), path)}
          defaultValue={meta.per_page}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
  <div className='flex items-center gap-x-1 w-full'>
  <form onSubmit={searchData} className='flex items-center gap-x-1 w-full'>
  <Input
    type="search"
  placeholder="Cari nama pasien, nomor pasien, atau NIK"
  className="w-full max-w-xl px-4 py-2 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition"
  onChange={(e) => setSearch(e.target.value)}
  value={search}
  />

  <Button type="submit" className="h-9 w-9 p-0 cursor-pointer">
    <Search size={16} />
  </Button>

  <Button type="button" className="h-9 w-9 p-0 cursor-pointer" onClick={clearSearch}>
    <RefreshCcw size={16} />
  </Button>
    <Button
    type="button"
    onClick={filterToday}
    variant={filters?.today ? "default" : "outline"}
    className="h-9 px-3 cursor-pointer"
  >
    Hari Ini
  </Button>

  <Button
    type="button"
    onClick={showAllData}
    variant={!filters?.today ? "default" : "outline"}
    className="h-9 px-3 cursor-pointer"
  >
    Semua
  </Button>
  {filters?.today && (
  <p className="text-sm text-slate-500 mt-2">
    Menampilkan data pasien hari ini 📅 (
    {new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
    )
  </p>
  )}
  <Button
    type="button"
    onClick={printPdf}
    variant="outline"
    className="h-9 rounded-xl border-emerald-200 px-4 text-emerald-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 cursor-pointer"
    title="Cetak Semua Data Pasien"
  >
    <span className="flex items-center gap-2">
          <Printer size={16} />
          Cetak Data Pasien
        </span>
  </Button>
</form>
</div>
      <FormPasien />
      </div>
      <Table>
        <TableHeader>
            <TableHead className='w-10 text-center'>No</TableHead>
            <TableHead>Nomor Pasien</TableHead>
            <TableHead>Nomor KTP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jenis Kelamin</TableHead>
            <TableHead>Usia</TableHead>
            <TableHead className='w-32 text-center'>Opsi</TableHead>
        </TableHeader>
      <TableBody>
  {pasiens.data.map((pasien: Pasien, index: number) => (
    <TableRow key={pasien.id}>
      <TableCell className='text-center'>
        {(meta.from ?? 0) + index}
      </TableCell>
      <TableCell>{pasien.nomor_pasien}</TableCell>
      <TableCell>{pasien.nomor_ktp}</TableCell>
      <TableCell>{pasien.nama_lengkap}</TableCell>
      <TableCell>{pasien.jenis_kelamin}</TableCell>
      <TableCell>{pasien.usia}</TableCell>
      <TableCell>
        <div className='flex gap-x-1 items-center justify-center'>

          <Button
          variant="destructive"
            size="icon" 
            title="Hapus Data Pasien"
              onClick={() => {
              const confirmed = window.confirm(`Yakin ingin menghapus data pasien "${pasien.nama_lengkap}"? Tindakan ini tidak dapat dibatalkan.`);
                if (!confirmed) return;
                router.delete(`/data-pasien/${pasien.id}`, {
                  preserveScroll: true,
                  onSuccess: () => {
                    // toast.success("Data pasien berhasil dihapus.");
                  },
                  onError: () => {
                    toast.error("Gagal menghapus data pasien.");
                  },
                });
              }}
            className="text-white cursor-pointer rounded-xl shadow-sm hover:scale-105 active:scale-95 transition"
              >

              <Trash className="h-4 w-4" />
              
            </Button>

              <FormPasien pasien={pasien}/>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
        <div>
          <CustomPagination meta={meta} />
        </div>
    </AppLayout>
  )
}

export default index