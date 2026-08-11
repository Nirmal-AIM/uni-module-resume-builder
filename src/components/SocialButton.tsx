import { ChevronRight } from 'lucide-react';
import { Button } from './Button';

type SocialButtonProps = { provider: string; onClick?: () => void; disabled?: boolean };

export function SocialButton({ provider, onClick, disabled }: SocialButtonProps) {
  return (
    <Button type="button" outline onClick={onClick} disabled={disabled} className="justify-start gap-3 px-5 text-sm">
      <span className="flex h-[18px] w-[18px] items-center justify-center text-[11px] font-bold text-gray-400">
        {provider === 'Google' ? 'G' : '●'}
      </span>
      <span>Continue with {provider}</span>
      <ChevronRight aria-hidden="true" className="ml-auto h-3.5 w-3.5 text-gray-400" />
    </Button>
  );
}
