type ErrorMessageProps = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
      {message}
    </div>
  );
}
