import Topbar from "./topbar";

export default function PageTemplate(props: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  return <div className="">
      <Topbar/>
      <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen md:p-8 p-2 gap-8">
        <main className="flex flex-col gap-[32px] row-start-2 items-center">
          {props.children}
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center">
          <p>UAB "Bartva" {Date().slice(11, 15)}</p>
        </footer>
      </div>
    </div>
}