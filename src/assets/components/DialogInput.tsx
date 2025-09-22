import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

interface DialogInputProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    value: number | null;
    onChange: (value: number | null) => void;
    onSubmit: () => void;
}

export const DialogInput: React.FC<DialogInputProps> = ({ open, onOpenChange, value, onChange, onSubmit }) => {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-80 p-6 bg-white rounded-md shadow-lg transform -translate-x-1/2 -translate-y-1/2">
                <Dialog.Title className="text-lg font-bold mb-4">Edit Point Value</Dialog.Title>
                <input
                    type="number"
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
                    value={value !== null ? value : ''}
                    onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
                    autoFocus
                />
                <div className="flex justify-end space-x-2">
                    <button
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                            onSubmit();
                            onOpenChange(false);
                        }}
                    >
                        Save
                    </button>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};
