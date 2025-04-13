import { PageParams } from "@/types";
import MenuPage from "./menu/page";


export default async function IndexPage(props: PageParams) {
  const { lang } = await props.params;

  return <div>
    <MenuPage/>
  </div>
}
