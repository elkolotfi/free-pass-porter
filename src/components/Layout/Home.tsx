import { AccessResults } from '@/components/Misc/AccessResults';
import Head from './Head';


export default function Home() {
  return (
    <div className="home">
      <Head />
      <AccessResults />
    </div>
  );
}