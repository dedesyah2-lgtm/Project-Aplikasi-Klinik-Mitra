
import { index } from "@/actions/App/Http/Controllers/PasienController";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Meta } from "@/types";
import { PanelRightInactiveIcon } from "lucide-react";
import React from "react";

interface CustomPaginationProps {
    meta: Meta
}

const CustomPagination = ({ meta }: CustomPaginationProps) => {
    return (
    <div>
    <Pagination className='mt-4'>
        <PaginationContent>
            <PaginationItem className='flex justify-center gap-x-1'>
        {meta.links
        .filter((item) => !item.label.toLowerCase().includes('pagination'))
        .map((item, index) => (
            <PaginationLink 
            size={"sm"}
            key={index}
            href={item.url}
            isActive={item.active}
            className={`${item.active ? 'bg-primary text-primary-foreground hover:bg-primary/80' : ''} rounded-md`}
            >
            {item.label.replace(/&laquo;|&raquo;/g, '')}
            </PaginationLink>
            ))
            }
            </PaginationItem>
        </PaginationContent>
    </Pagination>
    </div>
    )
}

export default CustomPagination