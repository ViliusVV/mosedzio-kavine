import { PageParams } from "@/types";
import MenuPage from "./menu/page";

export default async function IndexPage(props: PageParams) {
    return <MenuPage params={props.params}/>
}
