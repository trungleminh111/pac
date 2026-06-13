import { notFound } from "next/navigation";
import { TagForm } from "../../tag-form";
import { getAdminTagById } from "../../tag-query";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditTagPage({ params }: Props) {
  const tag = await getAdminTagById(params.id);

  if (!tag) {
    notFound();
  }

  return <TagForm mode="edit" tag={tag} />;
}