export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      <main className="auth-main-content">{children}</main>
    </div>
  );
}
