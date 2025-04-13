import Topbar from "./topbar";

export default function PageTemplate(props: {
  children: React.ReactNode[] | React.ReactNode;
}) {
  return <div className="">
      <Topbar/>
      <div className="grid grid-rows justify-items-center min-h-screen md:px-8 pt-8 px-3 gap-8">
        <main className="flex flex-col gap-[32px] w-full lg:w-[900px] items-center">
          {props.children}
        </main>
        <footer className="row-start-3 flex flex-wrap items-center justify-center">
          <p>{"UAB \"Bartva\" " + Date().slice(11, 15)}</p>
        </footer>
      </div>
    </div>
}