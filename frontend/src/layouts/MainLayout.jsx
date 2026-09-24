import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-ivory-50 dark:bg-navy-950 theme-fade">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-aurora opacity-70 dark:opacity-100"
        aria-hidden="true"
      />
      <Navbar />
      <main className="relative flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
