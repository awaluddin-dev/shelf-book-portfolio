import TestimoniPage from '@/pages/testimoni/ui/TestimoniPage';

export default function Page({ params }: { params: Promise<{ token: string }> }) {
  return <TestimoniPage params={params} />;
}
