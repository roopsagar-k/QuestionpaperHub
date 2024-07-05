import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Test } from "@/app/types/types";

const PaginationChange = ({
  pageNo,
  test,
  index,
  setIndex,
}: {
  pageNo: number;
  test: Test;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 right-1/2">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setIndex(index === 0 ? index : index - 1)}
              href={"#"}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={`${pageNo === 1 ? "hidden" : ""}`}
              href="#"
            >
              {pageNo - 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              {pageNo}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              className={`${
                pageNo === test?.questions?.length ? "hidden" : ""
              }`}
              href="#"
            >
              {pageNo + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setIndex(
                  index === test?.questions?.length! - 1 ? index : index + 1
                )
              }
              href={`#`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationChange;
