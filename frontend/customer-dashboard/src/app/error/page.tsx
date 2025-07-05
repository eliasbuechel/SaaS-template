import React, { Suspense } from "react";
import ErrorContent from "@/app/error/ErrorContent";

export default function ErrorPage() {
  return (
      <Suspense fallback={<div>Loading error details...</div>}>
        <ErrorContent />
      </Suspense>
  );
}