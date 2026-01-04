import { TradeForm } from '@/components/trade-view/trade-form';

export default function JournalingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log New Trade</h1>
        <p className="text-muted-foreground mt-1">
          Upload your chart and let AI analyze your setup
        </p>
      </div>

      <TradeForm />
    </div>
  );
}
