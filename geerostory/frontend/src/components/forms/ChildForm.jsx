import { useState, useEffect } from 'react';
import TextField from '../ui/TextField';
import Button from '../ui/Button';
import { cn } from '../../lib/cn';

const AGE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 3); // 3..12

export default function ChildForm({ initialValues, onSubmit, submitLabel, loading, error }) {
  const [name, setName] = useState(initialValues?.name || '');
  const [age, setAge] = useState(initialValues?.age || 6);
  const [description, setDescription] = useState(initialValues?.physicalDescription || '');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || '');
      setAge(initialValues.age || 6);
      setDescription(initialValues.physicalDescription || '');
    }
  }, [initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError("Please enter your child's first name.");
      return;
    }
    setLocalError('');
    await onSubmit({ name: name.trim(), age, physicalDescription: description.trim() });
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
      <TextField
        label="Your child's first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Maya"
        required
      />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-lavender-100">Age</span>
        <div className="flex flex-wrap gap-2">
          {AGE_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAge(option)}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-colors',
                age === option
                  ? 'bg-lavender-300 text-night-900'
                  : 'border border-night-500 bg-night-700/70 text-lavender-100',
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-lavender-100">Physical description</span>
          <span className="text-xs font-medium text-lavender-200/45">Optional</span>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. curly brown hair, glasses, loves dinosaur T-shirts — only if you'd like Geero to include it"
          rows={3}
          className="w-full rounded-xl border border-night-500 bg-night-800/80 px-4 py-3 text-base text-lavender-50 placeholder:text-lavender-200/35 focus:border-lavender-300 focus:outline-none focus:ring-2 focus:ring-lavender-300/30"
        />
        <p className="text-xs text-lavender-200/50">
          We'll never describe your child's appearance in a story unless you tell us to here.
        </p>
      </div>

      {displayError && <p className="text-sm text-rose-300">{displayError}</p>}

      <div className="mt-auto pt-2">
        <Button type="submit" disabled={loading} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
