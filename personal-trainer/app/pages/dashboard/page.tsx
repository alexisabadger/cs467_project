import LeftSidebar from '@/components/LeftSidebar';
import MainContent from '@/components/MainContent';
import RightSidebar from '@/components/RightSidebar';

export default function HomePage() {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          gap: '1rem',
          padding: '1rem',
          height: '100vh',
        }}
      >
        <LeftSidebar />
        <MainContent />
        <RightSidebar />
      </div>
    </>
  );
}