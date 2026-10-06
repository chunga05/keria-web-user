import React, { Suspense } from "react";
import UnderConstruction from "@/components/UnderConstruction";

interface UnderConstructionPageProps {
  searchParams?: Promise<{ feature?: string; title?: string }>;
}

async function UnderConstructionContent({ searchParams }: UnderConstructionPageProps) {
  const params = searchParams ? await searchParams : {};
  const featureName = params.feature;
  const customTitle = params.title;

  return (
    <div className="w-full flex-grow flex items-center justify-center py-12 px-4">
      <UnderConstruction
        variant="page"
        featureName={featureName}
        title={customTitle}
        showBackButton={true}
        backButtonHref="/hoat-dong/loi-nhan"
      />
    </div>
  );
}

export default function UnderConstructionPage({ searchParams }: UnderConstructionPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
        </div>
      }
    >
      <UnderConstructionContent searchParams={searchParams} />
    </Suspense>
  );
}
