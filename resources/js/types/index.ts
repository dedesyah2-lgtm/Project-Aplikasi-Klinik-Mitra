export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface PaginationLinks {
    url:string;
    label:string;
    active:boolean;
}

export interface Meta {
 current_page:number;
 from:number;
 last_page:number;
 links: PaginationLinks[];
 path:string;
 per_page:number;
 to:number;
 total:number;
}

export interface Pasien {
    id: number;
    nomor_pasien: string;
    nama_lengkap: string;
    jenis_kelamin: 'laki-laki' | 'perempuan';
    nomor_telepon: string;
    alamat: string;
    tanggal_lahir: string;
    golongan_darah: 'A' | 'B' | 'AB' | 'O'
    pekerjaan: string;
    nomor_ktp: string;
    usia: string;
}