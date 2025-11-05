import NavBar from "@/components/view/navigation/NavBar";

export default function MainLayout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
}
