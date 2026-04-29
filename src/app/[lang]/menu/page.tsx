import MenuWeb from "@/components/menu-web";
import PageTemplate from "@/components/page-template";
import { PageParams } from "@/types";

export default async function MenuPage(props: PageParams) {
  const { lang } = await props.params;

  return (
    <PageTemplate lang={lang} theme="dark">
      <MenuWeb lang={lang} />
    </PageTemplate>
  );
}
