import { DrizzleAdmin } from "@/components";

type Params = Promise<{ action: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  return (
    <div>
      <DrizzleAdmin action={params.action} searchParams={searchParams} />
    </div>
  );
}
