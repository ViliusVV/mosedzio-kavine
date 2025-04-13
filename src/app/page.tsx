import MenuPage from "./[lang]/menu/page";
import { Locale } from "@/i18n-config";

export default async function IndexPage() {
  // create promis which return PageParams with lt lang
  function getParams(): Promise<{ lang: Locale}> {
    return Promise.resolve({ lang: 'lt' });
  }

  return <MenuPage params={getParams()}/>
}
