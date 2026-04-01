import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
        const { flash }: any = usePage().props;
    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
        if (flash && flash.error) {
            toast.error(flash.error);
        }
        if (flash && flash.warning) {
            toast.warning(flash.warning);
        }
        if (flash && flash.info) {
            toast.info(flash.info);
        }
    }, [flash])
return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster 
        position='top-right'
        duration={3000}
        richColors
        />
        {children}
    </AppLayoutTemplate>
    )
};
