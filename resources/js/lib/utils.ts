import { router, type InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import path from 'path';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export const handleChangePerPage = (page: number, path:string) => {
    router.get(path, { perPage: page }, { preserveState: true, replace: true})
}